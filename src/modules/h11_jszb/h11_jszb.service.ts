import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { H11Jszb } from './h11_jszb.entity';
import {
  CreateH11JszbDto,
  UpdateH11JszbDto,
  H11JszbQueryDto,
  H11JszbCancelDto,
} from './h11_jszb.dto';
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
import { ParamService } from '../h12_xmzd/service/param.service';
import dayjs = require('dayjs');


@Injectable()
export class H11JszbService {
  constructor(
    @InjectRepository(H11Jszb)
    private readonly h11JszbRepository: Repository<H11Jszb>,
    private readonly h11_lshService: h11_lshService,
    private readonly h11_brxxService: h11_brxxService,
    private readonly h11YjkService: H11YjkService,
    private readonly paramService: ParamService,
    private dataSource: DataSource,
  ) { }

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
      const createDto: CreateH11JszbDto = { ...createH11JszbDto, jsdh, sfsj: new Date() };
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
  async createByManager(createH11JszbDto: CreateH11JszbDto, manager: EntityManager) {
    // 校验金额
    const Amount = await this.verifyAmount(createH11JszbDto);

    const jsdh = (await this.h11_lshService.getSerialNumber('JSDH', '结算单号码', 10)).toString(); //获取结算单号
    if (!jsdh) throw new BadRequestException('结算单号获取失败');
    if (jsdh === '-1') throw new BadRequestException('发票号码获取失败');

    try {
      // 保存h11_jszb
      const createDto: CreateH11JszbDto = { ...createH11JszbDto, jsdh, sfsj: new Date() };
      const mainEntity = await manager.save(H11Jszb, createDto);

      // 保存h11_xnh 结构
      const createH11XnhDto: CreateH11XnhDto = {
        ...createH11JszbDto.paymentType,
        fphm: jsdh,
        bz1: '1',
        zyid: createH11JszbDto.zyid,
        zyh: createH11JszbDto.zybh,
        brxm: createH11JszbDto.brxm,
      };
      await manager.save(H11Xnh, createH11XnhDto);

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

      await manager.save(H11Jsxb, createH11JsxbDto); //结算细表

      // 修改费用状态
      // 1.修改预交款状态
      await manager
        .createQueryBuilder()
        .update(H11Yjk)
        .set({ jsbz: 1, jsdh: jsdh })
        .where('jsbz = 0')
        .andWhere('zyid = :zyid', { zyid: createH11JszbDto.zyid })
        .execute();

      // 2.医嘱主表打上结算标志
      await manager
        .createQueryBuilder()
        .update(h12_yzzb)
        .set({ jsbz: 1 })
        .where('zyid = :zyid', { zyid: createH11JszbDto.zyid })
        .execute();

      // 3.给医嘱执行表打上结算标志和结算单号
      await manager
        .createQueryBuilder()
        .update(h13_yzzxcs)
        .set({ jsbz: 1, jsdh: jsdh })
        .where('jsbz=0')
        .andWhere('sfbz=1')
        .andWhere('zyid = :zyid', { zyid: createH11JszbDto.zyid })
        .execute();

      // 4.给医嘱执行表打上结算标志和结算单号
      await manager.query(
        `UPDATE h13_cwzy SET jsbz = $1,jsdh = $2 WHERE (zyid = $3) AND
	      ( h13_cwzy.jsbz='0') AND
			  ( h13_cwzy.sfbz='1') AND
        ( h13_cwzy.tzsj is not null)`,
        ['1', jsdh, createH11JszbDto.zyid],
      );

      // 5.给手术细表打上结算标志和结算单号
      await manager.query(
        `UPDATE h15_ssxb SET jsbz = $1,jsdh = $2 WHERE (zyid = $3) AND
	      ( h15_ssxb.sfbz = '1' ) AND  
        ( h15_ssxb.jsbz = '0' ) AND
        ( convert( char(10),h15_ssxb.ssrq,102) <= $4)`,
        ['1', jsdh, createH11JszbDto.zyid, dayjs(createH11JszbDto.zzsj).format('YYYY.MM.DD')],
      );

      // 6.给手术主表表打上结算标志和结算单号
      await manager.query(
        `UPDATE h15_sszb SET jsbz = $1 WHERE (zyid = $2) AND
        ( h15_sszb.jsbz = '0' ) AND
        ( convert( char(10),h15_sszb.ssrq,102) <= $3)`,
        ['1', createH11JszbDto.zyid, dayjs(createH11JszbDto.zzsj).format('YYYY.MM.DD')],
      );

      // 7.给处方执行表打上结算标志和结算单号
      await manager.query(
        `UPDATE h12_yzcfxb SET jsbz = $1,jsdh = $2 WHERE (zyid = $3) AND
        ( h12_yzcfxb.jsbz = '0' ) AND
			  ( h12_yzcfxb.sfbz = '1') AND
        ( convert( char(10),h12_yzcfxb.rq,102) <= $4)`,
        ['1', jsdh, createH11JszbDto.zyid, dayjs(createH11JszbDto.zzsj).format('YYYY.MM.DD')],
      );

      // 8.修改在院状态
      if (createH11JszbDto.jslx === 1 || createH11JszbDto.jslx === 4) {
        await manager
          .createQueryBuilder()
          .update('h11_brxx')
          .set({ zyzt: 4 })
          .where('zyid = :zyid', { zyid: createH11JszbDto.zyid })
          .execute();
      } else if (createH11JszbDto.jslx === 3) {
        await manager
          .createQueryBuilder()
          .update('h11_brxx')
          .set({ zyzt: 7 })
          .where('zyid = :zyid', { zyid: createH11JszbDto.zyid })
          .execute();
      }
      return mainEntity;
    } catch (err) {
      throw err
    } finally {
    }
  }
  async findAll(queryDto: H11JszbQueryDto): Promise<{ pageData: H11Jszb[]; total: number }> {
    const { pageNo = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const queryBuilder = this.h11JszbRepository.createQueryBuilder('jszb');

    // 添加过滤条件
    if (filters.value) {
      queryBuilder.andWhere(
        '(jszb.jsdh LIKE :value or jszb.zybh LIKE :value or jszb.brxm LIKE :value or jszb.zyid LIKE :value)',
        { value: `%${filters.value}%` },
      );
    }

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
    if (filters.start) {
      queryBuilder.andWhere('jszb.sfsj >= :start', { start: filters.start });
    }
    if (filters.end) {
      queryBuilder.andWhere('jszb.sfsj <= :end', { end: filters.end });
    }

    queryBuilder.orderBy(`jszb.sfsj`, 'DESC');

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

    const zfje = costCategory.reduce((acc, item) => parseFloat((acc + item.jsje).toFixed(10)), 0);
    const qtje = costCategory.reduce((acc, item) => parseFloat((acc + item.qthj).toFixed(10)), 0);
    const yjje = advancePayment.pageData.reduce(
      (acc, item) => parseFloat((acc + item.yjje).toFixed(10)),
      0,
    );

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
      createH11JszbDto.paymentType.yfje4 +
      createH11JszbDto.paymentType.ljfykb +
      createH11JszbDto.paymentType.sjhj -
      createH11JszbDto.paymentType.yfje3

    if ((ssjeSum - yjje).toFixed(2) != fkje.toFixed(2)) {
      throw new BadRequestException(
        `传入付款方式总额(${fkje})与后台计算金额(${ssjeSum - yjje})不符,请检查!`,
      );
    }

    if (jsjeSum?.toFixed(2) != createH11JszbDto.jsje?.toFixed(2)) {
      throw new BadRequestException(
        `传入结算金额(${createH11JszbDto.jsje})与后台计算金额(${jsjeSum})不符,请检查!`,
      );
    }

    if (jsjeSum?.toFixed(2) != createH11JszbDto.zfje?.toFixed(2)) {
      throw new BadRequestException(
        `传入自费金额(${createH11JszbDto.zfje})与后台计算金额(${jsjeSum})不符,请检查!`,
      );
    }

    if (ssjeSum?.toFixed(2) != createH11JszbDto.ssje?.toFixed(2)) {
      throw new BadRequestException(
        `传入实收金额(${createH11JszbDto.ssje})与后台计算金额(${ssjeSum})不符,请检查!`,
      );
    }

    if (yjje?.toFixed(2) != createH11JszbDto.yjje?.toFixed(2)) {
      throw new BadRequestException(
        `传入预交金额(${createH11JszbDto.yjje})与后台计算金额(${yjje})不符,请检查!`,
      );
    }

    if (syjeSum?.toFixed(2) !== createH11JszbDto.syje?.toFixed(2)) {
      throw new BadRequestException(
        `传入剩余金额(${createH11JszbDto.syje})与后台计算金额(${syjeSum})不符,请检查!`,
      );
    }

    return { zfje, qtje, yjje, jsjeSum, ssjeSum, syjeSum, costCategory };
  }

  async cancel(dto: H11JszbCancelDto) {
    const userId = dto.czrid;
    const userName = dto.czrxm;
    const jszb = await this.findOne(dto.jsdh);
    if (!jszb) {
      throw new NotFoundException(`结算单号 ${jszb.jsdh} 不存在`);
    }
    if (!jszb.fpzh && jszb.fpzh != null) {
      throw new BadRequestException(`该结算单已经作废1！`);
    }
    if (jszb.sjzt === 0 && jszb.sjzt != null) {
      throw new BadRequestException(`该结算单已经作废2！`);
    }
    if (jszb.fpbz === 1 && jszb.fpbz != null) {
      throw new BadRequestException(`该结算单有发票，请先将发票作废！`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const jsdhZF = (
        await this.h11_lshService.getSerialNumber('JSDH', '结算单号码', 10)
      ).toString(); //获取结算单号
      if (!jsdhZF) throw new BadRequestException('结算单号获取失败');
      if (jsdhZF === '-1') throw new BadRequestException('发票号码获取失败');

      await this.cancelJSZB(dto.jsdh, jsdhZF, userId, userName, dto.zyid, queryRunner);
      //throw new BadRequestException('回滚测试!');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOld(jsdh: string) {
    const jszb = await this.findOne(jsdh);
    if (!jszb) {
      throw new NotFoundException(`结算单号 ${jsdh} 不存在`);
    }
    if (jszb.fpzh) {
      throw new BadRequestException(`该结算单已经作废1！`);
    }
    if (jszb.sjzt === 0) {
      throw new BadRequestException(`该结算单已经作废2！`);
    }
    if (jszb.fpbz === 1) {
      throw new BadRequestException(`该结算单有发票，请先将发票作废！`);
    }

    const jsdhNew = (
      await this.h11_lshService.getSerialNumber('JSDH', '结算单号码', 10)
    ).toString(); //获取结算单号

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1.修改h11_brxx
      await queryRunner.manager
        .createQueryBuilder()
        .update('h11_brxx')
        .set({ qfjsje: 0, zyzt: 3, jssj: null })
        .where('zyid = :zyid', { zyid: jszb.zyid })
        .execute();

      // 2.恢复预结算金额wrc
      await queryRunner.manager
        .createQueryBuilder()
        .update('h22_yhjl')
        .set({ sjzt: 0 })
        .where('mzid = :zyid', { zyid: jszb.zyid })
        .andWhere('bslx = :bslx', { bslx: '2' })
        .execute();

      // 3.
      await queryRunner.manager
        .createQueryBuilder()
        .update('h11_jshz')
        .set({ jshz: () => 'jshz + :zfje' })
        .setParameter('zfje', jszb.zfje)
        .where('zyid = :zyid', { zyid: jszb.zyid })
        .execute();

      // 4
      const mmjs = (await this.paramService.gfGetPara(11, 'zybh', '0', '住院号不允许')).toString();
      if (mmjs != '1') {
        await queryRunner.manager
          .createQueryBuilder()
          .update('h11_xnh')
          .set({ bz1: '0' })
          .where('fphm = :fphm', { fphm: jszb.fphm })
          .execute();
      }

      // 1.1.修改h13_yzzxcs
      await queryRunner.manager
        .createQueryBuilder()
        .update('h13_yzzxcs')
        .set({ jsbz: 0, jsdh: '' })
        .where('zyid IN (SELECT zyid FROM h11_brxx WHERE zyid = :zyid OR lsh = :zyid)', {
          zyid: jszb.zyid,
        })
        .andWhere('jsdh = :jsdh', { jsdh: jsdh })
        .execute();

      // 1.1.修改h12_yzzb
      await queryRunner.manager
        .createQueryBuilder()
        .update('h12_yzzb')
        .set({ jsbz: 0 })
        .where('zyid IN (SELECT zyid FROM h11_brxx WHERE zyid = :zyid OR lsh = :zyid)', {
          zyid: jszb.zyid,
        })
        .execute();

      // 1.2.将床位租用表(h13_cwzy)中属于该结算单的内容打上未结算标志
      await queryRunner.manager
        .createQueryBuilder()
        .update('h13_cwzy')
        .set({ jsbz: 0, jsdh: '' })
        .where('jsdh = :jsdh', { jsdh: jsdh })
        .execute();

      // 1.3.3.将预交款(h11_yjk)中属于该结算单的收据打上未结算标志
      // ....................

      // 1.4.将医嘱执行表(h12_yzcfxb)中属于该结算单的内容打上未结算标志
      await queryRunner.manager
        .createQueryBuilder()
        .update('h12_yzcfxb')
        .set({ jsbz: 0, jsdh: '' })
        .where('jsdh = :jsdh', { jsdh: jsdh })
        .execute();

      const yszje = await queryRunner.manager.query(
        'SELECT isnull(Sum(xmdj*jfyl*zfbl),0) as yszje FROM h15_ssxb WHERE sfbz = 1 And jsdh = $1',
        [jsdh],
      );

      // 1.5.将手术主表(h15_sszb)中属于该结算单的内容打上未结算标志
      await queryRunner.manager
        .createQueryBuilder()
        .update('h15_sszb')
        .set({ jsbz: 0, yszje: () => 'yszje + ' + yszje[0].yszje })
        .where('zyid = :zyid', { zyid: jszb.zyid })
        .execute();

      // 1.6.将手术细表(h15_ssxb)中属于该结算单的内容打上未结算标志
      await queryRunner.manager
        .createQueryBuilder()
        .update('h15_ssxb')
        .set({ jsbz: 0, jsdh: '' })
        .where('jsdh = :jsdh', { jsdh: jsdh })
        .execute();

      // 1.7.生成一条h11_jszb负数记录
      await queryRunner.manager.query(
        `INSERT INTO h11_jszb (
          jsdh, zybh, brxm, xbid, rysj, zyid, jslx, jsje, zfje, gfje,
          jmje, qfje, ssje, jmlxid, fpzh, yjje, syje,
          zzsj, ksid, ksmc, jsyid, jssj, jsyxm, fpbz, czf, sjzt, sfsj, fphm
        )
        SELECT 
          $1, zybh, brxm, xbid, rysj, zyid, jslx, jsje * -1, zfje * -1, gfje * -1,
          jmje * -1, qfje * -1, ssje * -1, jmlxid, $2, yjje * -1, syje * -1,
          zzsj, ksid, ksmc, $3, $4, $5, 
          fpbz, czf, sjzt, $4, fphm 
        FROM h11_jszb 
        WHERE jsdh = $2`,
        [jsdhNew, jsdh, jszb.jsyid, new Date(), jszb.jsyxm],
      );
      // 1.8.生成一条h11_jsxb负数记录
      await queryRunner.manager.query(
        `INSERT INTO h11_jsxb (
          jsdh, fylbid, fylbmc, jsje, zfje, gfje, jmje, qfje, ssje
        )
        SELECT 
          $1 as jsdh, fylbid, fylbmc, jsje * -1, zfje * -1, gfje * -1, 
          jmje * -1, qfje * -1, ssje * -1
        FROM h11_jsxb 
        WHERE jsdh = $2`,
        [jsdhNew, jsdh],
      );

      // 1.9.生成一条h11_xnh负数记录
      await queryRunner.manager.query(
        `INSERT INTO H11_xnh (
          fphm, zyid, zyh, brxm, ylzh, fyhj, kbhj, sjhj, bsbl, ljfyhj, ljfykb, ljsjhj, lxdz, jgmc, sfje, dbje, yhje, yhkh, je1, je2, bz1, xnhj, je3,
          szbz, mzbc, qtje1, qtje2, qtje3, qtje4, bzxx, zfje, qt1, qt2, qt3, qt4, yfje, yfje1, yfje2, yfje3, yfje4)
        SELECT 
          $1, zyid, zyh, brxm, ylzh, fyhj * -1, kbhj * -1, sjhj * -1, bsbl, ljfyhj * -1, ljfykb * -1, ljsjhj * -1, lxdz, jgmc, sfje * -1, dbje * -1, yhje * -1, yhkh, je1 * -1, je2 * -1, bz1, xnhj * -1, je3 * -1,
          szbz, mzbc * -1, qtje1 * -1, qtje2 * -1, qtje3 * -1, qtje4 * -1, bzxx, zfje * -1, qt1 * -1, qt2 * -1, qt3 * -1, qt4 * -1,
          yfje * -1, yfje1 * -1, yfje2 * -1, yfje3 * -1, yfje4 * -1
        FROM H11_xnh 
        WHERE fphm = $2`,
        [jsdhNew, jsdh],
      );

      // 2.0.修改h11_jszb.fpzh
      await queryRunner.manager
        .createQueryBuilder()
        .update('h11_jszb')
        .set({ fpzh: jsdhNew })
        .where('jsdh = :jsdh', { jsdh: jsdh })
        .execute();

      await queryRunner.commitTransaction();
      return 0;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 作废结算单(新)
   * @param jsdh 结算单号
   * @param queryRunner 事务
   */
  async cancelJSZB(
    jsdh: string,
    jsdhZF: string,
    userId: string,
    userName: string,
    zyid: string,
    queryRunner: any,
  ) {
    // 1.修改医嘱信息
    const mmjs = (await this.paramService.gfGetPara(11, 'mmjs', '0', '毛毛合并结算')).toString();
    if (mmjs == '0') {
      const updateYZZX = await queryRunner.query(
        `Update h13_yzzxcs Set jsbz = 0, jsdh = '' Where zyid = @0 and jsdh = @1`,
        [zyid, jsdh],
      );
      const updateYZZB = await queryRunner.query(`Update h12_yzzb Set jsbz = 0 Where zyid = @0`, [
        zyid,
      ]);
      const updateBRXX = await queryRunner.query(
        `Update h11_brxx Set qfjsje = 0,zyzt = 3,jssj = @0 Where zyid = @1`,
        ['', zyid],
      );
    } else if (mmjs == '1') {
      const updateYZZX = await queryRunner.query(
        `Update h13_yzzxcs Set jsbz = 0, jsdh = '' Where zyid in (select zyid from h11_brxx where zyid=@0  or ( lsh = @1)) and jsdh = @2`,
        [zyid, zyid, jsdh],
      );
      const updateYZZB = await queryRunner.query(
        `Update h12_yzzb Set jsbz = 0 Where zyid in (select zyid from h11_brxx where zyid=@0  or ( lsh = @1))`,
        [zyid, zyid],
      );
      const updateBRXX = await queryRunner.query(
        `Update h11_brxx Set qfjsje = 0,zyzt = 3,jssj = @0 Where zyid = @1 or lsh = @2`,
        ['', zyid, zyid],
      );
    } else {
      const updateYZZX = await queryRunner.query(
        `Update h13_yzzxcs Set jsbz = 0, jsdh = '' Where zyid in (select zyid from h11_brxx where zyid=@0  or ( lsh = @1 and brlxid='0601' )) and jsdh = @2`,
        [zyid, zyid, jsdh],
      );
      const updateYZZB = await queryRunner.query(
        `Update h12_yzzb Set jsbz = 0 Where zyid in (select zyid from h11_brxx where zyid=@0  or ( lsh = @1 and brlxid='0601'))`,
        [zyid, zyid],
      );
      const updateBRXX = await queryRunner.query(
        `Update h11_brxx Set qfjsje = 0,zyzt = 3,jssj = @0 Where zyid = @1 or (lsh = @2 and brlxid = '0601')`,
        ['', zyid, zyid],
      );
    }

    // 2.将床位租用表(h13_cwzy)中属于该结算单的内容打上未结算标志
    const updateCWZY = await queryRunner.query(
      `Update h13_cwzy Set jsbz = 0, jsdh = '' Where jsdh = @0`,
      [jsdh],
    );

    // 3.将预交款(h11_yjk)中属于该结算单的收据打上未结算标志
    const selectYJK = await queryRunner.query(
      `SELECT isnull(Sum(rmbje),0) AS rmbje
       FROM h11_yjk  
       WHERE jsdh = @0
       And sjlx = 1 And sjzt = 1`,
      [jsdh],
    );
    const selectJSHZ = await queryRunner.query(
      `SELECT h11_jshz.zyid,h11_jshz.zybh,h11_jshz.brxm,   
            h11_jshz.yjhz as yjhz,   
            h11_jshz.jshz,   
            h11_jshz.syyj,   
            h11_jshz.qtje,   
            h11_jshz.qfbz  
       FROM h11_jshz  
       WHERE zyid = @0`,
      [zyid],
    );
    if (selectJSHZ.length > 0) {
      const updateJSHZ = await queryRunner.query(
        `Update h11_jshz Set yjhz = yjhz + @0 Where zyid = @1`,
        [selectYJK[0].rmbje, zyid],
      );
    } else {
      const insertJSHZ = await queryRunner.query(
        `Insert h11_jshz(zyid,zybh,brxm,yjhz) Values(@0,@1,@2,@3)`,
        [zyid, '', '', selectYJK[0].rmbje],
      );
    }
    const updateYJK = await queryRunner.query(
      `Update h13_cwzy Set jsbz = 0, jsdh = '' Where jsdh = @0`,
      [jsdh],
    );

    // 处方
    const updateCF = await queryRunner.query(
      `Update h12_yzcfxb Set jsbz = 0, jsdh = '' Where jsdh = @0`,
      [jsdh],
    );

    // 4.将手术细表(h15_ssxb)中属于该结算单的内容打上未结算标志
    const selectSSXB = await queryRunner.query(
      `SELECT isnull(Sum(xmdj*jfyl*zfbl),0) AS yszje
       FROM h15_ssxb  
       WHERE jsdh = @0
       And sfbz = 1`,
      [jsdh],
    );
    const updateSSZB = await queryRunner.query(
      `Update h15_sszb Set yszje = yszje + @0,jsbz = 0 Where zyid = @1`,
      [selectSSXB[0].yszje, zyid],
    );
    const updateSSXB = await queryRunner.query(
      `Update h15_ssxb Set jsbz = 0, jsdh = '' Where jsdh = @0`,
      [jsdh],
    );

    // 5.插入负数
    const insertJSZB = await queryRunner.query(
      `INSERT INTO h11_jszb (jsdh, zybh, brxm, xbid, rysj, zyid, jslx, jsje, zfje, gfje, jmje, qfje, ssje, jmlxid, fpzh, yjje, syje,zzsj, ksid, ksmc, jsyid, jssj, jsyxm, fpbz, czf, sjzt, sfsj, fphm)
           SELECT @0, zybh, brxm, xbid, rysj, zyid, jslx, jsje * -1, zfje * -1, gfje * -1, jmje * -1, qfje * -1, ssje * -1, jmlxid, @1, yjje * -1, syje * -1,zzsj, ksid, ksmc, @2, @3, @4, fpbz, czf, sjzt, @5, fphm
           FROM h11_jszb 
           WHERE jsdh = @6`,
      [jsdhZF, jsdh, userId, new Date(), userName, new Date(), jsdh],
    );

    const insertJSXB = await queryRunner.query(
      `INSERT INTO h11_jsxb (jsdh, fylbid, fylbmc, jsje, zfje, gfje, jmje, qfje, ssje)
         SELECT @0, fylbid, fylbmc, jsje* -1, zfje* -1, gfje* -1, jmje* -1, qfje* -1, ssje* -1
         FROM h11_jsxb 
         WHERE jsdh = @1`,
      [jsdhZF, jsdh],
    );

    const insertXNH = await queryRunner.query(
      `INSERT INTO H11_xnh (fphm, zyid, zyh, brxm, ylzh, fyhj, kbhj, sjhj, bsbl, ljfyhj, ljfykb, ljsjhj, lxdz, jgmc, sfje, dbje, yhje, yhkh, je1, je2, bz1, xnhj, je3,szbz, mzbc, qtje1, qtje2, qtje3, qtje4, bzxx,zfje,qt1,qt2,qt3,qt4,yfje,yfje1,yfje2,yfje3,yfje4)
           SELECT @0, zyid, zyh, brxm, ylzh, fyhj * -1, kbhj * -1, sjhj * -1, bsbl, ljfyhj * -1, ljfykb * -1, ljsjhj * -1, lxdz, jgmc, sfje * -1, dbje * -1, yhje * -1, yhkh, je1 * -1, je2 * -1, bz1, xnhj * -1, je3 * -1,szbz, mzbc  * -1, qtje1 * -1, qtje2 * -1, qtje3 * -1, qtje4 * -1, bzxx,zfje * -1,qt1 * -1,qt2 * -1,qt3 * -1,qt4 * -1,yfje * -1,yfje1 * -1,yfje2 * -1,yfje3 * -1,yfje4 * -1
           FROM H11_xnh 
           WHERE fphm = @1`,
      [jsdhZF, jsdh],
    );

    // 6.修改结算主表
    const updateJSZBOld = await queryRunner.query(`Update h11_jszb Set fpzh = @0 Where jsdh = @1`, [
      jsdhZF,
      jsdh,
    ]);

    return 0;
  }
}
