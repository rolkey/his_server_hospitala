import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { H11Fpzb } from './h11_fpzb.entity';
import { CreateH11FpzbDto, UpdateH11FpzbDto, H11FpzbQueryDto } from './h11_fpzb.dto';
import { H11ZypjPrimaryDto } from '../h11_zypj/h11_zypj.dto';
import { H11ZypjService } from '../h11_zypj/h11_zypj.service';
import { CreateH11FpxbDto } from '../h11_fpxb/h11_fpxb.dto';
import { H11Fpxb } from '../h11_fpxb/h11_fpxb.entity';
import { H11JszbService } from '../h11_jszb/h11_jszb.service';
import { H11JsxbService } from '../h11_jsxb/h11_jsxb.service';

import { log } from 'console';

@Injectable()
export class H11FpzbService {
  constructor(
    @InjectRepository(H11Fpzb)
    private readonly h11FpzbRepository: Repository<H11Fpzb>,
    private readonly h11ZypjService: H11ZypjService,
    private readonly h11JszbService: H11JszbService,
    private readonly h11JsxbService: H11JsxbService,
    private dataSource: DataSource,
  ) {}

  async create(createH11FpzbDto: CreateH11FpzbDto) {
    // 查询结算主表
    const h11Jszb = await this.h11JszbService.findOne(createH11FpzbDto.jsdh);
    if (!h11Jszb) {
      throw new BadRequestException('结算主表查询失败');
    }

    const h11ZypjPrimaryDto: H11ZypjPrimaryDto = { pjlxid: 'FPHM', usid: h11Jszb.jsyid, fyid: '1' };
    const fphm = (await this.h11ZypjService.getCurrentNumber(h11ZypjPrimaryDto)).dqhm; //获取发票号码
    if (!fphm) {
      throw new BadRequestException('发票号码获取失败');
    } else {
      // 查一下这个发票号码有没有被使用过
      const fphmRet = await this.findOne(fphm);
      if (fphmRet) {
        throw new BadRequestException('获取到的发票号码已使用,请重试!');
      }
    }

    // 生成发票主表
    const h11Fpzb: CreateH11FpzbDto = {
      jsdh: h11Jszb.jsdh,
      zybh: h11Jszb.zybh,
      zyid: h11Jszb.zyid,
      brxm: h11Jszb.brxm,
      xbid: h11Jszb.xbid,
      rysj: h11Jszb.rysj,
      zzsj: h11Jszb.zzsj,
      fpje: h11Jszb.ssje,
      yjje: h11Jszb.yjje,
      qtje: h11Jszb.gfje,
      syje: h11Jszb.syje,
      ksid: h11Jszb.ksid,
      ksmc: h11Jszb.ksmc,
      sfyid: h11Jszb.jsyid,
      sfyxm: h11Jszb.jsyxm,
      sfsj: new Date(),
      sjzt: 1,
      fyhj: h11Jszb.ssje,
      fphm: fphm,
      kshm: '',
    };

    // 生成发票细表
    const H11Jsxb = await this.h11JsxbService.findAllNotPage({ jsdh: createH11FpzbDto.jsdh });
    const createH11FpxbDto: CreateH11FpxbDto[] = [];

    if (H11Jsxb.items.length <= 0) {
      throw new BadRequestException('结算细表查询失败');
    }
    for (let i = 0; i < H11Jsxb.items.length; i++) {
      createH11FpxbDto[i] = {
        fphm: fphm,
        fpxmid: H11Jsxb.items[i].fylbid,
        fpxmmc: H11Jsxb.items[i].fylbmc,
        fpxmje: H11Jsxb.items[i].jsje,
        fpxmqtje: H11Jsxb.items[i].zfje,
      };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 保存发票主表
      const mainEntity = await queryRunner.manager.save(H11Fpzb, h11Fpzb);
      // 保存发票细表
      await queryRunner.manager.save(H11Fpxb, createH11FpxbDto);

      // 更新JSZB
      await queryRunner.manager
        .createQueryBuilder()
        .update('h11_jszb')
        .set({ fpbz: 1, fphm: fphm, sfsj: () => 'CURRENT_TIMESTAMP' })
        .where('jsdh = :jsdh', { jsdh: h11Jszb.jsdh })
        .execute();

      // 更新票据号码
      await queryRunner.manager
        .createQueryBuilder()
        .update('h11_zypj')
        .set({ dqhm: () => 'dqhm + 1' })
        .where('pjlxid = :pjlxid', { pjlxid: h11ZypjPrimaryDto.pjlxid })
        .andWhere('usid = :usid', { usid: h11ZypjPrimaryDto.usid })
        .andWhere('fyid = :fyid', { fyid: h11ZypjPrimaryDto.fyid })
        .execute();

      await queryRunner.commitTransaction();
      return mainEntity;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(queryDto: H11FpzbQueryDto): Promise<{ items: H11Fpzb[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.h11FpzbRepository.createQueryBuilder('fpzb');

    // 添加过滤条件
    if (filters.fphm) {
      queryBuilder.andWhere('fpzb.fphm = :fphm', { fphm: filters.fphm });
    }
    if (filters.kshm) {
      queryBuilder.andWhere('fpzb.kshm = :kshm', { kshm: filters.kshm });
    }
    if (filters.zybh) {
      queryBuilder.andWhere('fpzb.zybh = :zybh', { zybh: filters.zybh });
    }
    if (filters.jsdh) {
      queryBuilder.andWhere('fpzb.jsdh = :jsdh', { jsdh: filters.jsdh });
    }
    if (filters.zyid) {
      queryBuilder.andWhere('fpzb.zyid = :zyid', { zyid: filters.zyid });
    }
    if (filters.brxm) {
      queryBuilder.andWhere('fpzb.brxm LIKE :brxm', { brxm: `%${filters.brxm}%` });
    }
    if (filters.ksid) {
      queryBuilder.andWhere('fpzb.ksid = :ksid', { ksid: filters.ksid });
    }
    if (filters.ksmc) {
      queryBuilder.andWhere('fpzb.ksmc LIKE :ksmc', { ksmc: `%${filters.ksmc}%` });
    }

    const [items, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { items, total };
  }

  async findOne(fphm: string): Promise<H11Fpzb> {
    const found = await this.h11FpzbRepository.findOne({
      where: { fphm },
    });

    return found;
  }
}
