import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H11Jszb } from './h11_jszb.entity';
import { CreateH11JszbDto, UpdateH11JszbDto, H11JszbQueryDto } from './h11_jszb.dto';
import { H11ZypjPrimaryDto } from '../h11_zypj/h11_zypj.dto';
import { CreateH11JsxbDto } from '../h11_jsxb/h11_jsxb.dto';
import { H11ZypjService } from '../h11_zypj/h11_zypj.service';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_brxxService } from '../h11_brxx/h11_brxx.service';
import { H11YjkService } from '../h11_yjk/h11_yjk.service';
import { H11FpzbService } from '../h11_fpzb/h11_fpzb.service';
import { log } from 'console';

@Injectable()
export class H11JszbService {
  constructor(
    @InjectRepository(H11Jszb)
    private readonly h11JszbRepository: Repository<H11Jszb>,
    private readonly h11ZypjService: H11ZypjService,
    private readonly h11_lshService: h11_lshService,
    private readonly h11_brxxService: h11_brxxService,
    private readonly h11YjkService: H11YjkService,
    private readonly h11FpzbService: H11FpzbService,
  ) {}

  async create(createH11JszbDto: CreateH11JszbDto): Promise<string> {
    // 校验金额
    const Amount = await this.verifyAmount(createH11JszbDto);

    const h11ZypjPrimaryDto: H11ZypjPrimaryDto = { pjlxid: 'FPHM', usid: '9999', fyid: '1' };
    const fphm = (await this.h11ZypjService.getCurrentNumber(h11ZypjPrimaryDto)).dqhm; //获取发票号码
    if (!fphm) {
      throw new BadRequestException('发票号码获取失败');
    } else {
      // 查一下这个发票号码有没有被使用过
      const fphmRet = await this.h11FpzbService.findOne(fphm);
      if (fphmRet) {
        throw new BadRequestException('获取到的发票号码已使用,请重试!');
      }
    }

    const jsdh = (await this.h11_lshService.getSerialNumber('JSDH', '结算单号码', 10)).toString(); //获取结算单号
    if (!jsdh) throw new BadRequestException('结算单号获取失败');
    if (jsdh === '-1') throw new BadRequestException('发票号码获取失败');

    // 生成结算细表
    // Amount.costCategory.forEach((item) => {
    //   log('item', item);
    // });
    for (let i = 0; i < Amount.costCategory.length; i++) {
      const createH11JsxbDto: CreateH11JsxbDto = {
        jsdh: jsdh,
        fylbid: Amount.costCategory[i].fylbid,
        fylbmc: Amount.costCategory[i].fylbid,
        jsje: Amount.costCategory[i].jsje,
        zfje: Amount.costCategory[i].zfje,
        gfje: Amount.costCategory[i].zfje,
        jmje: Amount.costCategory[i].qtje - Amount.costCategory[i].zfje,
        ssje: Amount.costCategory[i].qtje,
      };
      log('createH11JsxbDto', createH11JsxbDto);
    }

    log('fphm', fphm);
    log('Amount', Amount);
    log('jsdh', jsdh);
    log('costCategory', Amount.costCategory.length);
    return '11';

    const createDto: CreateH11JszbDto = { ...createH11JszbDto, jsdh, fphm };
    const entity = this.h11JszbRepository.create(createDto);
    //return await this.h11JszbRepository.save(entity);

    return '1111';
  }

  async findAll(queryDto: H11JszbQueryDto): Promise<{ items: H11Jszb[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

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

    const [items, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { items, total };
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
      zyid: '000000034466', //createH11JszbDto.zyid,
      brlxid: '0601', //createH11JszbDto.brlxid,
      start: '2021.05.25', //createH11JszbDto.jssj,
      end: '2025.06.02', //createH11JszbDto.jssj,
      ksid: '0109', //createH11JszbDto.ksid,
    });

    const advancePayment = await this.h11YjkService.findAll({
      pageNo: 1,
      pageSize: 100,
      zyid: '000000034466',
    });

    const zfje = costCategory.reduce((acc, item) => acc + item.jsje, 0);
    const qtje = costCategory.reduce((acc, item) => acc + item.qthj, 0);
    const yjje = advancePayment.pageData.reduce((acc, item) => acc + item.yjje, 0);

    const jsjeSum = zfje + qtje;
    const ssjeSum = zfje + qtje;
    const syjeSum = yjje - jsjeSum;

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
