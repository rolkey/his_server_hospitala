import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { H11Jszb } from './h11_jszb.entity';
import { CreateH11JszbDto, UpdateH11JszbDto, H11JszbQueryDto } from './h11_jszb.dto';
import { CreateH11JsxbDto } from '../h11_jsxb/h11_jsxb.dto';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_brxxService } from '../h11_brxx/h11_brxx.service';
import { H11YjkService } from '../h11_yjk/h11_yjk.service';
import { H11Jsxb } from '../h11_jsxb/h11_jsxb.entity';
import { CreateH11XnhDto } from '../h11_xnh/h11_xnh.dto';
import { H11Xnh } from '../h11_xnh/h11_xnh.entity';
import { H11Yjk } from '../h11_yjk/h11_yjk.entity';
import { h12_yzzb } from '../h12_yzzb/h12_yzzb.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';

import { log } from 'console';
import * as dayjs from 'dayjs';

@Injectable()
export class H11JszbService {
  constructor(
    @InjectRepository(H11Jszb)
    private readonly h11JszbRepository: Repository<H11Jszb>,
    private readonly h11_lshService: h11_lshService,
    private readonly h11_brxxService: h11_brxxService,
    private readonly h11YjkService: H11YjkService,
    private dataSource: DataSource,
  ) {}

  async create(createH11JszbDto: CreateH11JszbDto) {
    // 校验金额
    const Amount = await this.verifyAmount(createH11JszbDto);

    const jsdh = (await this.h11_lshService.getSerialNumber('JSDH', '结算单号码', 10)).toString(); //获取结算单号
    if (!jsdh) throw new BadRequestException('结算单号获取失败');
    if (jsdh === '-1') throw new BadRequestException('发票号码获取失败');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 保存h11_jszb
      const createDto: CreateH11JszbDto = { ...createH11JszbDto, jsdh };
      const mainEntity = await queryRunner.manager.save(H11Jszb, createDto);

      // 保存h11_xnh 结构
      const createH11XnhDto: CreateH11XnhDto = {
        ...createH11JszbDto.paymentType,
        fphm: jsdh,
        zyid: createH11JszbDto.zyid,
        zyh: createH11JszbDto.zybh,
        brxm: createH11JszbDto.brxm,
      };
      await queryRunner.manager.save(H11Xnh, createH11XnhDto);

      // 生成结算细表
      const createH11JsxbDto: CreateH11JsxbDto[] = [];
      for (let i = 0; i < Amount.costCategory.length; i++) {
        createH11JsxbDto[i] = {
          jsdh: jsdh,
          fylbid: Amount.costCategory[i].fylbid,
          fylbmc: Amount.costCategory[i].fylbmc,
          jsje: Amount.costCategory[i].jsje,
          zfje: Amount.costCategory[i].zfje,
          gfje: Amount.costCategory[i].zfje,
          jmje: Amount.costCategory[i].qtje - Amount.costCategory[i].zfje,
          ssje: Amount.costCategory[i].qtje,
        };
      }

      await queryRunner.manager.save(H11Jsxb, createH11JsxbDto); //结算细表

      // 修改费用状态
      // 1.修改预交款状态
      await queryRunner.manager
        .createQueryBuilder()
        .update(H11Yjk)
        .set({ jsbz: 1, jsdh: jsdh })
        .where('jsbz = 0')
        .andWhere('zyid = :zyid', { zyid: createH11JszbDto.zyid })
        .execute();

      // 2.医嘱主表打上结算标志
      await queryRunner.manager
        .createQueryBuilder()
        .update(h12_yzzb)
        .set({ jsbz: 1 })
        .where('zyid = :zyid', { zyid: createH11JszbDto.zyid })
        .execute();

      // 3.给医嘱执行表打上结算标志和结算单号
      await queryRunner.manager
        .createQueryBuilder()
        .update(h13_yzzxcs)
        .set({ jsbz: 1, jsdh: jsdh })
        .where('jsbz=0')
        .andWhere('sfbz=1')
        .andWhere('zyid = :zyid', { zyid: createH11JszbDto.zyid })
        .execute();

      // 4.给医嘱执行表打上结算标志和结算单号
      await queryRunner.query(
        `UPDATE h13_cwzy SET jsbz = $1,jsdh = $2 WHERE (zyid = $3) AND
	      ( h13_cwzy.jsbz='0') AND
			  ( h13_cwzy.sfbz='1') AND
        ( h13_cwzy.tzsj is not null)`,
        ['1', jsdh, createH11JszbDto.zyid],
      );

      // 5.给手术细表打上结算标志和结算单号
      await queryRunner.query(
        `UPDATE h15_ssxb SET jsbz = $1,jsdh = $2 WHERE (zyid = $3) AND
	      ( h15_ssxb.sfbz = '1' ) AND  
        ( h15_ssxb.jsbz = '0' ) AND
        ( convert( char(10),h15_ssxb.ssrq,102) <= $4)`,
        ['1', jsdh, createH11JszbDto.zyid, dayjs(createH11JszbDto.zzsj).format('YYYY.MM.DD')],
      );

      // 6.给手术主表表打上结算标志和结算单号
      await queryRunner.query(
        `UPDATE h15_sszb SET jsbz = $1 WHERE (zyid = $2) AND
        ( h15_sszb.jsbz = '0' ) AND
        ( convert( char(10),h15_sszb.ssrq,102) <= $3)`,
        ['1', createH11JszbDto.zyid, dayjs(createH11JszbDto.zzsj).format('YYYY.MM.DD')],
      );

      // 7.给处方执行表打上结算标志和结算单号
      await queryRunner.query(
        `UPDATE h12_yzcfxb SET jsbz = $1,jsdh = $2 WHERE (zyid = $3) AND
        ( h12_yzcfxb.jsbz = '0' ) AND
			  ( h12_yzcfxb.sfbz = '1') AND
        ( convert( char(10),h12_yzcfxb.rq,102) <= $4)`,
        ['1', jsdh, createH11JszbDto.zyid, dayjs(createH11JszbDto.zzsj).format('YYYY.MM.DD')],
      );

      // 8.修改在院状态
      if (createH11JszbDto.jslx === 1 || createH11JszbDto.jslx === 4) {
        await queryRunner.manager
          .createQueryBuilder()
          .update('h11_brxx')
          .set({ zyzt: 4 })
          .where('zyid = :zyid', { zyid: createH11JszbDto.zyid })
          .execute();
      } else if (createH11JszbDto.jslx === 3) {
        await queryRunner.manager
          .createQueryBuilder()
          .update('h11_brxx')
          .set({ zyzt: 7 })
          .where('zyid = :zyid', { zyid: createH11JszbDto.zyid })
          .execute();
      }

      await queryRunner.commitTransaction();
      return mainEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(queryDto: H11JszbQueryDto): Promise<{ pageData: H11Jszb[]; total: number }> {
    const { pageNo = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const queryBuilder = this.h11JszbRepository.createQueryBuilder('jszb');

    // 添加过滤条件
    if (filters.jsdh) {
      queryBuilder.andWhere('jszb.jsdh = :jsdh', { jsdh: filters.jsdh });
    }
    if (filters.zybh) {
      queryBuilder.andWhere('jszb.zybh = :zybh', { zybh: filters.zybh });
    }
    if (filters.brxm) {
      queryBuilder.andWhere('jszb.brxm LIKE :brxm', { brxm: `%${filters.brxm}%` });
    }
    if (filters.zyid) {
      queryBuilder.andWhere('jszb.zyid = :zyid', { zyid: filters.zyid });
    }
    if (filters.ksid) {
      queryBuilder.andWhere('jszb.ksid = :ksid', { ksid: filters.ksid });
    }
    if (filters.ksmc) {
      queryBuilder.andWhere('jszb.ksmc LIKE :ksmc', { ksmc: `%${filters.ksmc}%` });
    }

    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return { pageData, total };
  }

  async findOne(jsdh: string): Promise<H11Jszb> {
    const found = await this.h11JszbRepository.findOne({ where: { jsdh } });

    if (!found) {
      throw new NotFoundException(`结算单号 ${jsdh} 不存在`);
    }

    return found;
  }

  async update(jsdh: string, updateH11JszbDto: UpdateH11JszbDto): Promise<H11Jszb> {
    const result = await this.h11JszbRepository.update(jsdh, updateH11JszbDto);

    if (result.affected === 0) {
      throw new NotFoundException(`结算单号 ${jsdh} 不存在`);
    }

    return this.findOne(jsdh);
  }

  async remove(jsdh: string): Promise<void> {
    const result = await this.h11JszbRepository.delete(jsdh);

    if (result.affected === 0) {
      throw new NotFoundException(`结算单号 ${jsdh} 不存在`);
    }
  }

  async verifyAmount(createH11JszbDto: CreateH11JszbDto) {
    // 金额校验
    const costCategory = await this.h11_brxxService.costCategory({
      zyid: createH11JszbDto.zyid,
      brlxid: createH11JszbDto.brlxid,
      start: dayjs(createH11JszbDto.rysj).format('YYYY.MM.DD'),
      end: dayjs(createH11JszbDto.zzsj).format('YYYY.MM.DD'),
      ksid: createH11JszbDto.ksid,
    });

    const advancePayment = await this.h11YjkService.findAll({
      pageNo: 1,
      pageSize: 100,
      zyid: createH11JszbDto.zyid,
    });

    const zfje = costCategory.reduce((acc, item) => acc + item.jsje, 0);
    const qtje = costCategory.reduce((acc, item) => acc + item.qthj, 0);
    const yjje = advancePayment.pageData.reduce((acc, item) => acc + item.yjje, 0);

    const jsjeSum = zfje + qtje;
    const ssjeSum = zfje + qtje;
    const syjeSum = yjje - jsjeSum;
    const fkje =
      createH11JszbDto.paymentType.yhje +
      createH11JszbDto.paymentType.je1 +
      createH11JszbDto.paymentType.je3 +
      createH11JszbDto.paymentType.qt3 +
      createH11JszbDto.paymentType.kbhj +
      createH11JszbDto.paymentType.qtje4 +
      createH11JszbDto.paymentType.yfje +
      createH11JszbDto.paymentType.yfje4;
    if (ssjeSum - yjje != fkje) {
      throw new BadRequestException(
        `传入付款方式总额(${fkje})与后台计算金额(${ssjeSum - yjje})不符,请检查!`,
      );
    }

    if (jsjeSum != createH11JszbDto.jsje) {
      throw new BadRequestException(
        `传入结算金额(${createH11JszbDto.jsje})与后台计算金额(${jsjeSum})不符,请检查!`,
      );
    }

    if (jsjeSum != createH11JszbDto.zfje) {
      throw new BadRequestException(
        `传入自费金额(${createH11JszbDto.zfje})与后台计算金额(${jsjeSum})不符,请检查!`,
      );
    }

    if (ssjeSum != createH11JszbDto.ssje) {
      throw new BadRequestException(
        `传入实收金额(${createH11JszbDto.ssje})与后台计算金额(${ssjeSum})不符,请检查!`,
      );
    }

    if (yjje != createH11JszbDto.yjje) {
      throw new BadRequestException(
        `传入预交金额(${createH11JszbDto.yjje})与后台计算金额(${yjje})不符,请检查!`,
      );
    }

    if (syjeSum != createH11JszbDto.syje) {
      throw new BadRequestException(
        `传入剩余金额(${createH11JszbDto.syje})与后台计算金额(${syjeSum})不符,请检查!`,
      );
    }

    return { zfje, qtje, yjje, jsjeSum, ssjeSum, syjeSum, costCategory };
  }
}
