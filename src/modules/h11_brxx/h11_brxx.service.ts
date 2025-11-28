import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { h11_brxx } from './h11_brxx.entity';
import {
  Queryh11_brxxDto,
  CreateDto,
  UpdateDto,
  QueryCostDetailDto,
  QueryCostCategoryDto,
  bedAllocationDto,
  QueryDto,
} from './dto';
import dayjs = require('dayjs');
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_zybhService } from '../h11_zybh/h11_zybh.service';
import { h00_fylbService } from '../h00_fylb/h00_fylb.service';

import DateFormater from '@/utils/DateFormater';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { h13_cwsyxx } from '../h13_cwsyxx/h13_cwsyxx.entity';
@Injectable()
export class h11_brxxService {
  constructor(
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
    private readonly h11_lshService: h11_lshService,
    private readonly h11_zybhService: h11_zybhService,
    private readonly h00_fylbService: h00_fylbService,
    private dataSource: DataSource,
  ) {}

  async findAll(queryDto: Queryh11_brxxDto) {
    const pageSize = queryDto.pageSize || 10;
    const pageNo = queryDto.pageNo || 1;

    // 1️⃣ 基础查询（不含关联表）
    const baseQuery = this.h11_brxxRepo.createQueryBuilder('h11_brxx');

    // --- 动态查询条件 ---
    if (queryDto?.value) {
      baseQuery.andWhere(
        `(h11_brxx.brxm LIKE :value OR h11_brxx.sfzh LIKE :value OR h11_brxx.ylzh LIKE :value
        OR h11_brxx.jtdh LIKE :value OR h11_brxx.zybh LIKE :value OR h11_brxx.rycw LIKE :value)`,
        { value: `%${queryDto?.value}%` },
      );
    }

    if (queryDto.brxm) {
      baseQuery.andWhere('h11_brxx.brxm LIKE :brxm', { brxm: `%${queryDto.brxm.trim()}%` });
    }

    if (queryDto.jtdh) {
      baseQuery.andWhere('h11_brxx.jtdh LIKE :jtdh', { jtdh: `%${queryDto.jtdh.trim()}%` });
    }

    if (queryDto.zybh) {
      baseQuery.andWhere('h11_brxx.zybh LIKE :zybh', { zybh: `%${queryDto.zybh.trim()}%` });
    }

    if (queryDto.zyzt) {
      const zyzt = Number(queryDto.zyzt);
      if ((zyzt === 1 || zyzt === 2) && queryDto.cycw !== '0') {
        baseQuery.andWhere('(h11_brxx.zyzt <= 2 OR h11_brxx.zyzt IS NULL)');
      } else {
        baseQuery.andWhere('h11_brxx.zyzt = :zyzt', { zyzt });
      }
    }

    if (queryDto.ryksid) {
      baseQuery.andWhere('h11_brxx.ryksid LIKE :ryksid', { ryksid: `%${queryDto.ryksid.trim()}%` });
    }

    if (queryDto.zkksid) {
      baseQuery.andWhere(
        ' ( EXISTS (SELECT zyid FROM h13_brzkqk WHERE h13_brzkqk.zyid = h11_brxx.zyid AND h13_brzkqk.ksid LIKE :zkksid) )',
        { zkksid: `%${queryDto.zkksid.trim()}%` },
      );
    }

    if (queryDto.mzys) {
      baseQuery.andWhere('h11_brxx.mzys LIKE :mzys', { mzys: `%${queryDto.mzys.trim()}%` });
    }

    if (queryDto.sxys) {
      baseQuery.andWhere('h11_brxx.sxys LIKE :sxys', { sxys: `%${queryDto.sxys.trim()}%` });
    }

    if (queryDto.rykssj && queryDto.ryjssj) {
      baseQuery.andWhere('(h11_brxx.rysj BETWEEN :start AND :end)', {
        start: dayjs(queryDto.rykssj).format('YYYY-MM-DD 00:00:00'),
        end: dayjs(queryDto.ryjssj).format('YYYY-MM-DD 23:59:59'),
      });
    }

    if (queryDto.cykssj && queryDto.cyjssj) {
      baseQuery.andWhere('(h11_brxx.cysj BETWEEN :start AND :end)', {
        start: dayjs(queryDto.cykssj).format('YYYY-MM-DD 00:00:00'),
        end: dayjs(queryDto.cyjssj).format('YYYY-MM-DD 23:59:59'),
      });
    }

    if (queryDto.ylzh) {
      baseQuery.andWhere('h11_brxx.ylzh = :ylzh', { ylzh: queryDto.ylzh.trim() });
    }

    if (queryDto.sfzh) {
      baseQuery.andWhere('h11_brxx.sfzh LIKE :sfzh', { sfzh: `%${queryDto.sfzh.trim()}%` });
    }

    if (queryDto.rycw) {
      baseQuery.andWhere('h11_brxx.rycw LIKE :rycw', { rycw: `%${queryDto.rycw.trim()}%` });
    }

    if (queryDto.cycw && queryDto.cycw === '0') {
      baseQuery.andWhere(' (h11_brxx.cycw is null or h11_brxx.cycw =:cycw) ', { cycw: '' });
    } else if (queryDto.cycw) {
      baseQuery.andWhere(' (h11_brxx.cycw =:cycw) ', { cycw: queryDto.cycw });
    }

    // 排序
    if (queryDto.ryjssj && queryDto.ryjssj) {
      baseQuery.orderBy('h11_brxx.rysj', 'ASC');
    } else if (queryDto.cykssj && queryDto.cyjssj) {
      baseQuery.orderBy('h11_brxx.cysj', 'ASC');
    } else {
      baseQuery.orderBy('h11_brxx.rysj', 'ASC');
    }

    // 2️⃣ 第一次查询 — 仅分页ID + 总数
    const { raw } = await baseQuery
      .select('h11_brxx.zyid', 'zyid')
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .getRawAndEntities();

    const ids = raw.map((row) => row.zyid);
    if (ids.length === 0) {
      return { pageData: [], total: 0 };
    }

    // 3️⃣ 第二次查询 — 详情 + Join + 计算字段
    const detailQuery = this.h11_brxxRepo
      .createQueryBuilder('h11_brxx')
      .leftJoinAndSelect('h11_brxx.brlxidEntity', 'brlxidEntity')
      .leftJoinAndSelect('h11_brxx.rycwEntity', 'rycwEntity')
      .leftJoinAndSelect('h11_brxx.cycwEntity', 'cycwEntity')
      .leftJoinAndSelect('h11_brxx.mzysEntity', 'mzysEntity')
      .leftJoinAndSelect('h11_brxx.sxysEntity', 'sxysEntity')
      .leftJoinAndSelect('h11_brxx.zrhsEntity', 'zrhsEntity')
      .leftJoinAndSelect('h11_brxx.zkbqidEntity', 'zkbqidEntity')
      .leftJoinAndSelect('h11_brxx.rybqidEntity', 'rybqidEntity')
      .leftJoinAndSelect('h11_brxx.bz4Entity', 'bz4', `bz4.lx = '病人所属'`)
      .leftJoin('h11_brxx.ryzdEntity', 'ryzdEntity')
      .leftJoin('h11_brxx.cyzdEntity', 'cyzdEntity')
      .addSelect([
        'ryzdEntity.icd11',
        'ryzdEntity.icd11mc',
        'ryzdEntity.ybbm',
        'ryzdEntity.ybmc',
        'cyzdEntity.icd11',
        'cyzdEntity.icd11mc',
        'cyzdEntity.ybbm',
        'cyzdEntity.ybmc',
      ])
      .leftJoinAndSelect('h11_brxx.yishEntity', 'yish', `yish.lx='饮食'`)
      .whereInIds(ids)
      .addSelect(
        `CASE
          WHEN h11_brxx.zyzt < 3 THEN DATEDIFF(DAY, h11_brxx.rysj, GETDATE())
          ELSE DATEDIFF(DAY, h11_brxx.rysj, h11_brxx.cysj)
        END`,
        'zyts1',
      )
      .addSelect('0', 'isfinish')
      .addSelect(
        `(SELECT CASE
            WHEN ISNULL(y.kshs, '0') = '0' THEN 1
            WHEN CONVERT(VARCHAR(10), y.yzrq, 120) = CONVERT(VARCHAR(10), GETDATE(), 120) THEN 2
            ELSE 0 END
          FROM (
            SELECT h12_yzxb.yzrq, h12_yzxb.kshs,
            ROW_NUMBER() OVER(PARTITION BY h12_yzxb.zyid ORDER BY h12_yzxb.yzrq DESC) fsp
            FROM h12_yzxb
            WHERE h12_yzxb.ysbz = 1 AND h12_yzxb.zyid = h11_brxx.zyid
          ) AS y WHERE y.fsp = 1)`,
        'isexecute',
      )
      .addSelect(
        `CASE
          WHEN CONVERT(VARCHAR(10), h11_brxx.rysj, 120) = CONVERT(VARCHAR(10), GETDATE(), 120) THEN 1
          ELSE 0 END`,
        'istoday',
      );

    // 4️⃣ 查询详细数据 + raw 结果（合并为一次查询）
    const { entities: pageData, raw: rawResult } = await detailQuery.getRawAndEntities();

    // 5️⃣ 合并结果
    const result = pageData.map((entity) => {
      const matchedRaw = rawResult.find((raw) => raw.h11_brxx_zyid === entity.zyid);
      return {
        ...entity,
        zyts1: matchedRaw?.zyts1,
        isexecute: matchedRaw?.isexecute,
        istoday: matchedRaw?.istoday,
        ztbz: entity.zyzt === 4 ? 1 : 0,
        rysj: entity.rysj ? dayjs(entity.rysj).format('YYYY-MM-DD HH:mm:ss') : '',
        cysj: entity.cysj ? dayjs(entity.cysj).format('YYYY-MM-DD HH:mm:ss') : '',
        ryqzsj: entity.ryqzsj ? dayjs(entity.ryqzsj).format('YYYY-MM-DD HH:mm:ss') : '',
        jssj: entity.jssj ? dayjs(entity.jssj).format('YYYY-MM-DD HH:mm:ss') : '',
        csrq: entity.csrq ? dayjs(entity.csrq).format('YYYY-MM-DD HH:mm:ss') : '',
      };
    });

    return { pageData: result, total: raw.length };
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

  async bedAllocation(dto: bedAllocationDto) {
    await this.dataSource.transaction(async (manager) => {
      try {
        const brxxRepository = manager.getRepository(h11_brxx);

        const cwsyxxRepository = manager.getRepository(h13_cwsyxx);

        const [brxx, cwsyxx] = await Promise.all([
          brxxRepository.findOne({
            where: { zyid: dto.zyid },
            select: { rycw: true, cycw: true, zyid: true },
          }),
          cwsyxxRepository.findOne({ where: { cwid: dto.cwid, ksid: dto.ksid } }),
        ]);

        if (cwsyxx?.zyid) {
          throw new CustomException(ERR.ERR_10000, '床位已有患者');
        }
        if (!brxx) {
          throw new CustomException(ERR.ERR_10000, '未找到有效住院信息');
        }
        cwsyxx.zyid = dto.zyid;
        cwsyxx.lrsj = new Date();
        cwsyxx.cwzt = 4;
        cwsyxx.cwfpxx = `护士"${dto.lryxm}"在${dayjs().format('YYYY.MM.DD HH:mm')}分配`;
        cwsyxx.lryid = dto.lryid;
        brxx.rycw = cwsyxx.cwid;
        brxx.cycw = cwsyxx.cwid;
        brxx.rysj = dto.rysj;
        await Promise.all([cwsyxxRepository.save(cwsyxx), brxxRepository.save(brxx)]);
      } catch (error) {
        console.error(error);
        throw new CustomException(ERR.ERR_10000, error.message ?? '分配床位失败');
      }
    });
  }

  async findPatientTotal(queryDto: QueryDto) {
    const { sxys = '', ryksid = '', zkksid = '', rykssj, ryjssj, cykssj, cyjssj } = queryDto;

    // 通用日期格式化函数
    const buildDateRange = (start: string, end: string) => ({
      start: dayjs(start).format('YYYY-MM-DD 00:00:00'),
      end: dayjs(end).format('YYYY-MM-DD 23:59:59'),
    });

    // 创建通用 QueryBuilder 函数
    const qb = () => this.h11_brxxRepo.createQueryBuilder('h11_brxx');

    const rysjRange = buildDateRange(rykssj, ryjssj);
    const cysjRange = buildDateRange(cykssj, cyjssj);

    // 1. myQuery
    const myQuery = qb()
      .andWhere('h11_brxx.sxys LIKE :sxys', { sxys: `%${sxys.trim()}%` })
      .andWhere('h11_brxx.ryksid LIKE :ryksid', { ryksid: `%${ryksid.trim()}%` })
      .andWhere('h11_brxx.rysj BETWEEN :start AND :end', rysjRange);

    // 2. zkQuery
    const zkQuery = qb()
      .andWhere(
        `EXISTS (
        SELECT 1
        FROM h13_brzkqk zk
        WHERE zk.zyid = h11_brxx.zyid
          AND zk.ksid LIKE :zkksid
      )`,
        { zkksid: `%${zkksid.trim()}%` },
      )
      .andWhere('h11_brxx.rysj BETWEEN :start AND :end', rysjRange);

    // 3. inQuery (在院)
    const inQuery = qb()
      .andWhere('(h11_brxx.zyzt <= 2 OR h11_brxx.zyzt IS NULL)')
      .andWhere('h11_brxx.ryksid LIKE :ryksid', { ryksid: `%${ryksid.trim()}%` })
      .andWhere('h11_brxx.rysj BETWEEN :start AND :end', rysjRange);

    // 4. dbQuery (待办)
    const dbQuery = qb()
      .andWhere('h11_brxx.zyzt <= 3')
      .andWhere('h11_brxx.ryksid LIKE :ryksid', { ryksid: `%${ryksid.trim()}%` })
      .andWhere('h11_brxx.rysj BETWEEN :start AND :end', rysjRange);

    // 5. outQuery (出院)
    const outQuery = qb()
      .andWhere('h11_brxx.zyzt = 4')
      .andWhere('h11_brxx.ryksid LIKE :ryksid', { ryksid: `%${ryksid.trim()}%` })
      .andWhere('h11_brxx.cysj BETWEEN :start AND :end', cysjRange);

    const [my, zk, IN, db, out] = await Promise.all([
      myQuery.getCount(),
      zkQuery.getCount(),
      inQuery.getCount(),
      dbQuery.getCount(),
      outQuery.getCount(),
    ]);

    return { my, zk, in: IN, db, out };
  }
}
