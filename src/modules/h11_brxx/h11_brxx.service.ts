import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h11_brxx } from './h11_brxx.entity';
import {
  Queryh11_brxxDto,
  CreateDto,
  UpdateDto,
  QueryCostDetailDto,
  QueryCostCategoryDto,
} from './dto';
import * as dayjs from 'dayjs';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_zybhService } from '../h11_zybh/h11_zybh.service';
import { h00_fylbService } from '../h00_fylb/h00_fylb.service';
import { log } from 'console';
import { getCompleteSqlWithParameters } from '@/utils/sql-utils';
@Injectable()
export class h11_brxxService {
  constructor(
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
    private readonly h11_lshService: h11_lshService,
    private readonly h11_zybhService: h11_zybhService,
    private readonly h00_fylbService: h00_fylbService,
  ) {}

  async findAll(queryDto: Queryh11_brxxDto) {
    const pageSize = queryDto.pageSize || 10;
    const pageNo = queryDto.pageNo || 1;

    // 使用QueryBuilder来避免参数类型问题
    // const queryBuilder = this.h11_brxxRepo.createQueryBuilder('h11_brxx');

    const queryBuilder = this.h11_brxxRepo
      .createQueryBuilder('h11_brxx')
      .leftJoinAndSelect('h11_brxx.brlxidEntity', 'brlxidEntity')
      .leftJoinAndSelect('h11_brxx.rycwEntity', 'rycwEntity')
      .leftJoinAndSelect('h11_brxx.cycwEntity', 'cycwEntity')
      .leftJoinAndSelect('h11_brxx.mzysEntity', 'mzysEntity')
      .leftJoinAndSelect('h11_brxx.sxysEntity', 'sxysEntity')
      .leftJoinAndSelect('h11_brxx.zrhsEntity', 'zrhsEntity')
      .leftJoinAndSelect('h11_brxx.zkbqidEntity', 'zkbqidEntity')
      .leftJoinAndSelect('h11_brxx.rybqidEntity', 'rybqidEntity')
      .leftJoin('h11_brxx.ryzdEntity', 'ryzdEntity')
      .leftJoin('h11_brxx.cyzdEntity', 'cyzdEntity')
      .addSelect(['ryzdEntity.icd11', 'ryzdEntity.icd11mc', 'ryzdEntity.ybbm', 'ryzdEntity.ybmc'])
      .addSelect(['cyzdEntity.icd11,cyzdEntity.icd11mc', 'cyzdEntity.ybbm', 'cyzdEntity.ybmc'])
      .leftJoinAndSelect('h11_brxx.yishEntity', 'yish', `yish.lx='饮食'`);

    if (queryDto?.value) {
      queryBuilder.andWhere(
        '(h11_brxx.brxm LIKE :value OR h11_brxx.sfzh LIKE :value OR h11_brxx.ylzh LIKE :value OR h11_brxx.jtdh LIKE :value OR h11_brxx.zybh LIKE :value OR h11_brxx.rycw LIKE :value)',
        { value: `%${queryDto?.value}%` },
      );
    }
    // 添加查询条件
    if (queryDto.brxm) {
      queryBuilder.andWhere('h11_brxx.brxm LIKE :brxm', { brxm: `%${queryDto.brxm.trim()}%` });
    }
    if (queryDto.jtdh) {
      queryBuilder.andWhere('h11_brxx.jtdh = :jtdh', { jtdh: `%${queryDto.jtdh.trim()}%` });
    }
    if (queryDto.zybh) {
      queryBuilder.andWhere('h11_brxx.zybh = :zybh', { zybh: `%${queryDto.zybh.trim()}%` });
    }
    if (queryDto.zyzt) {
      const zyzt = Number(queryDto.zyzt);
      if (zyzt === 1 || zyzt === 2) {
        queryBuilder.andWhere('(h11_brxx.zyzt <=2 or h11_brxx.zyzt is null)');
      } else {
        queryBuilder.andWhere('(h11_brxx.zyzt = :zyzt)', { zyzt: queryDto.zyzt });
      }
    }
    if (queryDto.ryksid) {
      queryBuilder.andWhere('h11_brxx.ryksid LIKE :ryksid', {
        ryksid: `%${queryDto.ryksid.trim()}%`,
      });
    }
    if (queryDto.mzys) {
      queryBuilder.andWhere('h11_brxx.mzys LIKE  :mzys', { mzys: `%${queryDto.mzys.trim()}%` });
    }
    if (queryDto.sxys) {
      queryBuilder.andWhere('h11_brxx.sxys LIKE  :sxys', { sxys: `%${queryDto.sxys.trim()}%` });
    }
    if (queryDto.rykssj && queryDto.ryjssj) {
      queryBuilder.andWhere('(h11_brxx.rysj BETWEEN :start AND :end)', {
        start: dayjs(queryDto.rykssj).format('YYYY-MM-DD 00:00:00'),
        end: dayjs(queryDto.ryjssj).format('YYYY-MM-DD 23:59:59'),
      });
    }
    if (queryDto.cykssj && queryDto.cyjssj) {
      queryBuilder.andWhere('(h11_brxx.cysj BETWEEN :start AND :end)', {
        start: dayjs(queryDto.cykssj).format('YYYY-MM-DD 00:00:00'),
        end: dayjs(queryDto.cyjssj).format('YYYY-MM-DD 23:59:59'),
      });
    }
    if (queryDto.ylzh) {
      queryBuilder.andWhere('h11_brxx.ylzh = :ylzh', { ylzh: queryDto.ylzh.trim() });
    }
    if (queryDto.sfzh) {
      queryBuilder.andWhere('h11_brxx.sfzh LIKE :sfzh', { sfzh: `%${queryDto.sfzh.trim()}%` });
    }
    if (queryDto.rycw) {
      queryBuilder.andWhere('h11_brxx.rycw = :rycw', { rycw: `%${queryDto.rycw.trim()}%` });
    }

    if (queryDto.ryjssj && queryDto.ryjssj) {
      queryBuilder.orderBy('h11_brxx.rysj', 'ASC');
    } else if (queryDto.cykssj && queryDto.cyjssj) {
      queryBuilder.orderBy('h11_brxx.cysj', 'ASC');
    } else {
      queryBuilder.orderBy('h11_brxx.rysj', 'ASC');
    }
    // 添加分页
    queryBuilder.skip((pageNo - 1) * pageSize).take(pageSize);
    console.log(getCompleteSqlWithParameters(queryBuilder));

    const [pageData, total] = await queryBuilder.getManyAndCount();
    return { pageData, total };
  }

  async findOne(zyid: string) {
    const query = this.h11_brxxRepo
      .createQueryBuilder('h11_brxx')
      .select([
        `(SELECT sum(round(jfyl * xmdj * (zxcs - bzxcs) * kyts,2))
	FROM h13_yzzxcs
	WHERE h13_yzzxcs.zyid =h11_brxx.zyid) as yzfy`,
        `(SELECT sum(round(a.jfyl * a.xmdj,2))
	FROM h15_ssxb a, h15_sszb b
	WHERE a.zyid = h11_brxx.zyid AND  a.zyid = b.zyid AND a.ssid = b.ssid ) as ssfy`,
        `(SELECT sum(yjje)  FROM h11_yjk Where zyid = h11_brxx.zyid AND ksid = h11_brxx.ryksid And (sjzt = 1 OR sjzt = 3 ) and ISNULL(zfyid,'') = '') as yjk`,
      ])
      .where('h11_brxx.zyid = :zyid', { zyid });
    const result = await query.getRawOne();
    const h11_brxx = await this.h11_brxxRepo
      .createQueryBuilder('h11_brxx')
      .leftJoinAndSelect('h11_brxx.brlxidEntity', 'brlxidEntity')
      .leftJoinAndSelect('h11_brxx.rycwEntity', 'rycwEntity')
      .leftJoinAndSelect('h11_brxx.cycwEntity', 'cycwEntity')
      .leftJoinAndSelect('h11_brxx.mzysEntity', 'mzysEntity')
      .leftJoinAndSelect('h11_brxx.sxysEntity', 'sxysEntity')
      .leftJoinAndSelect('h11_brxx.zrhsEntity', 'zrhsEntity')
      .leftJoinAndSelect('h11_brxx.zkbqidEntity', 'zkbqidEntity')
      .leftJoinAndSelect('h11_brxx.rybqidEntity', 'rybqidEntity')
      .leftJoin('h11_brxx.ryzdEntity', 'ryzdEntity')
      .leftJoin('h11_brxx.cyzdEntity', 'cyzdEntity')
      .addSelect(['ryzdEntity.icd11', 'ryzdEntity.icd11mc', 'ryzdEntity.ybbm', 'ryzdEntity.ybmc'])
      .addSelect(['cyzdEntity.icd11', 'cyzdEntity.icd11mc', 'cyzdEntity.ybbm', 'cyzdEntity.ybmc'])
      .leftJoinAndSelect('h11_brxx.yishEntity', 'yish', `yish.lx='饮食'`)
      .where('h11_brxx.zyid = :zyid', { zyid })
      .getOne();
    h11_brxx.fyhj = result.yzfy + result.ssfy;
    h11_brxx.yjk = result.yjk;
    return h11_brxx;
  }
  async create(dto: CreateDto) {
    const entity = this.h11_brxxRepo.create(dto);

    entity.zyid = await this.h11_lshService.getSerialNumber('ZYID', '住院ID号', 12);
    this.h11_zybhService.addUpZYBH(Number(entity.zybh));

    return await this.h11_brxxRepo.save(entity);
  }

  async update(dto: UpdateDto) {
    const { zyid, ...rest } = dto;
    await this.h11_brxxRepo.update(zyid, rest);
    return await this.h11_brxxRepo.findOne({ where: { zyid } });
  }

  async costDetails(queryCostDetailDto: QueryCostDetailDto) {
    try {
      //费用明细
      return await this.h11_brxxRepo.query(
        `EXEC dbo.h11_yrqmx_yb @zyid='${queryCostDetailDto.zyid}', @date1='${queryCostDetailDto.start}', @date2='${queryCostDetailDto.end}', @ksid='${queryCostDetailDto.ksid}'`,
      );
    } catch (error) {
      throw new Error(`存储过程执行失败: ${error.message}`);
    }
  }

  async costCategory(queryCostCategoryDto: QueryCostCategoryDto) {
    try {
      // 费用类别
      const result = await this.h11_brxxRepo.query(
        `EXEC dbo.h11_zyjs @zyid='${queryCostCategoryDto.zyid}', @brlxid='${queryCostCategoryDto.brlxid}', @start='${queryCostCategoryDto.start}', @end='${queryCostCategoryDto.end}', @ksid='${queryCostCategoryDto.ksid}'`,
      );
      const resultNew = await Promise.all(
        result.map(async (item) => {
          const fylb = await this.h00_fylbService.findOne(item.fylbid);
          return { ...item, fylbmc: fylb?.fylbmc ?? '' };
        }),
      );
      return resultNew;
    } catch (error) {
      throw new Error(`存储过程执行失败: ${error.message}`);
    }
  }
}
