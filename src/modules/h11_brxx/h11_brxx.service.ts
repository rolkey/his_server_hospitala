import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, DataSource, Repository } from 'typeorm';
import { h11_brxx } from './h11_brxx.entity';
import {
  Queryh11_brxxDto,
  CreateDto,
  UpdateDto,
  QueryCostDetailDto,
  QueryCostCategoryDto,
  bedAllocationDto,
  QueryDto,
  ForciblyDeleteDto,
  receiptDto,
  TransferDepartmentDto,
} from './dto';
import dayjs = require('dayjs');
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_zybhService } from '../h11_zybh/h11_zybh.service';
import { h00_fylbService } from '../h00_fylb/h00_fylb.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { h13_cwsyxx } from '../h13_cwsyxx/h13_cwsyxx.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
@Injectable()
export class h11_brxxService {
  constructor(
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
    private readonly h11_lshService: h11_lshService,
    private readonly h11_zybhService: h11_zybhService,
    private readonly h00_fylbService: h00_fylbService,
    private readonly paramService: ParamService,
    private dataSource: DataSource,
  ) {}

  async getPatientListForReceipt(queryDto: receiptDto) {
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
    if (queryDto.zyzt) {
      const zyzt = Number(queryDto.zyzt);
      if ((zyzt === 1 || zyzt === 2) && queryDto.cycw !== '0') {
        baseQuery.andWhere('(h11_brxx.zyzt <= 2 OR h11_brxx.zyzt IS NULL)');
      } else {
        baseQuery.andWhere('h11_brxx.zyzt = :zyzt', { zyzt });
      }
    }

    if (queryDto.ryksid) {
      baseQuery.andWhere('h11_brxx.cyksid LIKE :ryksid', { ryksid: `%${queryDto.ryksid.trim()}%` });
    }
    baseQuery.andWhere((qb) => {
      // 创建子查询
      const subQuery = qb
        .subQuery()
        .select('1')
        .from('h12_yzxb', 'h12_yzxb')
        .leftJoin('h12_yzxb.syffidEntity', 'syffidEntity');
      subQuery.where('h12_yzxb.zyid = h11_brxx.zyid');
      // 费用类别过略
      if (queryDto.fylbid) {
        const fylbidList = queryDto.fylbid.split(',');
        subQuery.andWhere('h12_yzxb.fylbid IN (:...fylbidList)', { fylbidList });
      }

      if (queryDto.dyflid) {
        // 子查询中需用 JOIN 别名 syffidEntity，不能用实体属性路径 h12_yzxb.syffidEntity
        subQuery.andWhere('syffidEntity.dyflid IN (:...dyflidList)', {
          dyflidList: queryDto.dyflid.split(','),
        });
      }
      return `EXISTS (${subQuery.limit(1).getQuery()})`;
    });

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
        dybs: matchedRaw?.dybs || 0, // 添加打印标识字段，默认为0表示未打印
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
      if (queryDto.isZk === '1') {
        baseQuery.andWhere(
          ' ( EXISTS (SELECT zyid FROM h13_brzkqk WHERE h13_brzkqk.zyid = h11_brxx.zyid AND h13_brzkqk.ksid LIKE :zkksid) )',
          { zkksid: `%${queryDto.zkksid.trim()}%` },
        );
      } else {
        baseQuery.andWhere('h11_brxx.zkksid LIKE :zkksid', {
          zkksid: `%${queryDto.zkksid.trim()}%`,
        });
      }
    }

    if (queryDto.fyksid) {
      baseQuery.andWhere('h11_brxx.zkksid LIKE :fyksid', { fyksid: `%${queryDto.fyksid.trim()}%` });
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

    if (queryDto.brlxid) {
      baseQuery.andWhere(`(h11_brxx.brlxid = :brlxid or :brlxid = 'ALL')`, {
        brlxid: `${queryDto.brlxid}`,
      });
    }

    if (queryDto.cycw && queryDto.cycw === '0') {
      baseQuery.andWhere(' (h11_brxx.cycw is null or h11_brxx.cycw = :cycw) ', { cycw: '' });
    } else if (queryDto.cycw) {
      baseQuery.andWhere(' (h11_brxx.cycw =:cycw) ', { cycw: queryDto.cycw });
    }

    // 排序
    if (queryDto.rykssj && queryDto.ryjssj) {
      baseQuery.orderBy('h11_brxx.rysj', 'ASC');
    } else if (queryDto.cykssj && queryDto.cyjssj) {
      baseQuery.orderBy('h11_brxx.cysj', 'ASC');
    } else {
      baseQuery.orderBy('h11_brxx.rysj', 'ASC');
    }

    // 2️⃣ 查询总数
    const total = await baseQuery.getCount();

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
      )
      .addSelect(
        `(select (case when COUNT(*) > 0 then 1 else 0 end) fsbz
          from BQ_TWMX
          where BQ_TWMX.ZYH = h11_brxx.zyid
          and DATEDIFF(DAY, BQ_TWMX.CLRQ,GetDate()) < 4
          and tw>37.4)`,
        'fsbz',
      )
      .addSelect(
        `(select (case when COUNT(*) > 0 then 1 else 0 end) cybz
          from h12_cycl
          where h12_cycl.zyid = h11_brxx.zyid)`,
        'cybz',
      )
      .addSelect(
        `(select (case when COUNT(*) > 0 then 1 else 0 end) tzbz
          from h12_yzxb
          where h12_yzxb.zyid = h11_brxx.zyid
          and h12_yzxb.ysbz = 1
          and h12_yzxb.yzlx = 1
          and h12_yzxb.sjbz = 1
          and h12_yzxb.jsbz <> 1
          and h12_yzxb.xmid = '0000000'
          and h12_yzxb.tzbz = 0)`,
        'tzbz',
      )
      .addSelect(
        `(select (case when COUNT(*) > 0 then 1 else 0 end) xyztjbz
         from h11_jshztzd1
         where h11_jshztzd1.zyid = h11_brxx.zyid)`,
        'xyztjbz',
      );

    // 排序
    if (queryDto.rykssj && queryDto.ryjssj) {
      detailQuery.orderBy('h11_brxx.rysj', 'ASC');
    } else if (queryDto.cykssj && queryDto.cyjssj) {
      detailQuery.orderBy('h11_brxx.cysj', 'ASC');
    } else {
      detailQuery.orderBy('h11_brxx.rysj', 'ASC');
    }
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
        fsbz: matchedRaw?.fsbz,
        cybz: matchedRaw?.cybz,
        tzbz: matchedRaw?.tzbz,
        xyztjbz: matchedRaw?.xyztjbz,
        rysj: entity.rysj ? dayjs(entity.rysj).format('YYYY-MM-DD HH:mm:ss') : '',
        cysj: entity.cysj ? dayjs(entity.cysj).format('YYYY-MM-DD HH:mm:ss') : '',
        ryqzsj: entity.ryqzsj ? dayjs(entity.ryqzsj).format('YYYY-MM-DD HH:mm:ss') : '',
        jssj: entity.jssj ? dayjs(entity.jssj).format('YYYY-MM-DD HH:mm:ss') : '',
        csrq: entity.csrq ? dayjs(entity.csrq).format('YYYY-MM-DD HH:mm:ss') : '',
      };
    });

    //return { pageData: result, total: raw.length };
    return { pageData: result, total: total };
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
      .leftJoin('h11_brxx.mzzdEntity', 'mzzdEntity')
      .addSelect(['ryzdEntity.icd11', 'ryzdEntity.icd11mc', 'ryzdEntity.ybbm', 'ryzdEntity.ybmc'])
      .addSelect(['cyzdEntity.icd11', 'cyzdEntity.icd11mc', 'cyzdEntity.ybbm', 'cyzdEntity.ybmc'])
      .addSelect(['mzzdEntity.icd11', 'mzzdEntity.icd11mc', 'mzzdEntity.ybbm', 'mzzdEntity.ybmc'])
      .leftJoinAndSelect('h11_brxx.yishEntity', 'yish', `yish.lx='饮食'`)
      .where('h11_brxx.zyid = :zyid', { zyid })
      .getOne();
    if (h11_brxx) {
      h11_brxx.fyhj = result?.yzfy + result?.ssfy;
      h11_brxx.yjk = result?.yjk;
    }
    return h11_brxx;
  }

  // async create(dto: CreateDto) {
  //   const brxxCount = await this.h11_brxxRepo
  //     .createQueryBuilder('h11_brxx')
  //     .where('h11_brxx.sfzh = :sfzh', { sfzh: dto.sfzh })
  //     .andWhere('h11_brxx.zyzt < 3')
  //     .getCount();
  //   const entity = this.h11_brxxRepo.create(dto);

  //   if (brxxCount > 0) {
  //     throw new CustomException(ERR.ERR_10000, '该身份证号的病人已在院，不能重复入院');
  //   }

  //   entity.zyid = await this.h11_lshService.getSerialNumber('ZYID', '住院ID号', 12);
  //   this.h11_zybhService.addUpZYBH(Number(entity.zybh));

  //   return await this.h11_brxxRepo.save(entity);
  // }

  async create(dto: CreateDto) {
    // 使用数据库事务确保数据一致性
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 查询是否有相同身份证号且在院的病人
      const brxxCount = await queryRunner.manager
        .createQueryBuilder(h11_brxx, 'h11_brxx')
        .where('h11_brxx.sfzh = :sfzh', { sfzh: dto.sfzh })
        .andWhere('h11_brxx.zyzt < 3')
        .getCount();

      if (brxxCount > 0) {
        throw new CustomException(ERR.ERR_10000, '该身份证号的病人已在院，不能重复入院');
      }

      // 创建新实体
      const entity = queryRunner.manager.create(h11_brxx, dto);

      // 获取住院ID号
      entity.zyid = await this.h11_lshService.getSerialNumber('ZYID', '住院ID号', 12);
      // 更新住院编号
      await this.h11_zybhService.addUpZYBH(Number(entity.zybh));

      // 保存实体
      const result = await queryRunner.manager.save(entity);

      // 有通知单号时，更新通知单状态
      if (dto.tzdh) {
        const updateRYTZItem = await queryRunner.query(
          `UPDATE h23_rytz SET rybz = 1 where tzdh = @0`,
          [dto.tzdh],
        );
      }

      // 提交事务
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // 发生错误时回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放查询连接
      await queryRunner.release();
    }
  }

  async update(dto: UpdateDto) {
    const h11_brxx = await this.h11_brxxRepo.findOne({ where: { zyid: dto.zyid } });
    const newH11_brxx = this.h11_brxxRepo.merge(h11_brxx, dto);
    await this.h11_brxxRepo.save(newH11_brxx);
    return newH11_brxx;
  }

  async costDetails(queryCostDetailDto: QueryCostDetailDto) {
    try {
      //费用明细
      const detail = await this.h11_brxxRepo.query(
        `EXEC dbo.h11_yrqmx_yb @zyid='${queryCostDetailDto.zyid}', @date1='${queryCostDetailDto.start}', @date2='${queryCostDetailDto.end}', @ksid='${queryCostDetailDto.ksid}'`,
      );
      return detail;
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
          throw new CustomException(ERR.ERR_40101);
        }
        if (!brxx) {
          throw new CustomException(ERR.ERR_40102);
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
        if (error instanceof CustomException) {
          throw error; // 如果已经是 CustomException 类型，直接抛出
        } else throw new CustomException(ERR.ERR_40103);
      }
    });
  }

  async findPatientTotal(queryDto: QueryDto) {
    const { sxys = '', ryksid = '', zkksid = '', rykssj, ryjssj, cykssj, cyjssj } = queryDto;

    // 通用日期格式化函数
    const buildDateRange = (start: string, end: string) => ({
      start: dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
      end: dayjs(end).format('YYYY-MM-DD HH:mm:ss'),
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
      .andWhere('h11_brxx.rysj BETWEEN :start AND :end', rysjRange)
      .andWhere('h11_brxx.zyzt <= 2 OR h11_brxx.zyzt IS NULL');

    // 3. inQuery (在院)
    const inQuery = qb()
      .andWhere('(h11_brxx.zyzt <= 2 OR h11_brxx.zyzt IS NULL)')
      .andWhere('h11_brxx.ryksid LIKE :ryksid', { ryksid: `%${ryksid.trim()}%` })
      .andWhere('h11_brxx.rysj BETWEEN :start AND :end', rysjRange);

    // 4. dbQuery (待办)
    const dbQuery = qb()
      .andWhere('h11_brxx.zyzt = 3')
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

  /**
   *
   * @param queryCostCategoryDto 旧His强行删除功能
   */
  async forciblyDelete(dto: ForciblyDeleteDto) {
    const pwd = dto.pwd || '';
    const czrKsid = dto.czrKsid || '';
    const zyid = dto.zyid || '';
    const ghbh = dto.ghbh || ''; // 养老使用

    const sysPwd = await this.paramService.gfGetPara(
      99,
      'GLYMMMZFP',
      '1111',
      '门诊收费作废发票密码',
    );

    if (sysPwd !== pwd) {
      return {
        code: -1,
        msg: '录入密码不正确!',
      };
    }

    // 创建数据库查询运行器，用于管理事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const params: any[] = [zyid]; // 1.科室ID 2.药品ID 3.药品批次
      // 1.检查有无结算
      const FPZBItem = await queryRunner.query(
        `SELECT count(*) as count
         FROM h11_fpzb
         WHERE zyid = @0 AND sjzt = 1`,
        params,
      );
      const FPZBCount = FPZBItem?.[0]?.count || 0;
      if (FPZBCount > 0) {
        return {
          code: -1,
          msg: '该病人已结算不能删除!',
        };
      }

      // 2.检查有无医保登记
      const YBDJItem = await queryRunner.query(
        `SELECT count(*) as count
         FROM G10_DJXX
         WHERE lsh = @0 AND jsbz > 0`,
        params,
      );
      const YBDJCount = YBDJItem?.[0]?.count || 0;
      if (YBDJCount > 0) {
        return {
          code: -1,
          msg: '该病该病人有医保登记,请先将医保！',
        };
      }

      // 3.养老处理
      const ylmbbz = await this.paramService.gfGetPara(
        81,
        'ylmbbz',
        '0',
        '启用养老管理系统(1启用，0未启用)',
      );
      const ylybksid = await this.paramService.gfGetPara(
        81,
        'ylybksid',
        '',
        '启用养老医保科室编号',
      );
      if (ylmbbz === '1') {
        const YLItem = await queryRunner.query(
          `SELECT count(*) as count
         FROM dict_oldie
         WHERE id = @0 AND status <> 11`,
          [ghbh],
        );
        const YLCount = YLItem?.[0]?.count || 0;
        if (YLCount > 0 && ylybksid != czrKsid) {
          return {
            code: -1,
            msg: '请先办理退回，然后才可以删除!',
          };
        }

        const DCMXDelete = await queryRunner.query(`DELETE yw_dcmx  Where zyh = @0`, [ghbh]);
        //更新床位状态
        const CWSYXXUpdate = await queryRunner.query(
          `UPDATE h13_cwsyxx Set cwzt = 1,zyid='',id='',cwfpxx='病人信息删除1' Where  zyid = @0`,
          params,
        );
      }

      // 4.删除信息
      const ssxbDelete = await queryRunner.query(`DELETE h15_ssxb  Where zyid = @0`, params);
      const sszbDelete = await queryRunner.query(`DELETE h15_sszb  Where zyid = @0`, params);
      const yzxbDelete = await queryRunner.query(`DELETE h12_yzxb  Where zyid = @0`, params);
      const yzzbDelete = await queryRunner.query(`DELETE h12_yzzb  Where zyid = @0`, params);
      const yzzxcsDelete = await queryRunner.query(`DELETE h13_yzzxcs  Where zyid = @0`, params);
      const yjkDelete = await queryRunner.query(`DELETE h11_yjk  Where zyid = @0`, params);
      const jshztzd1Delete = await queryRunner.query(`DELETE h11_jshztzd1 Where zyid = @0`, params);
      const brxxDelete = await queryRunner.query(`DELETE h11_brxx Where zyid = @0`, params);

      // throw new Error(`回滚测试`);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return {
      code: 0,
      msg: '删除成功!',
    };
  }

  // 入院前校验
  async createCheck(queryDto: QueryDto) {
    return 0;
  }

  /**
   * 作废未确认出院
   * @param dto 住院ID
   */
  async cancelUnconfirmedDischarge(dto: { zyid: string; ksid: string }) {
    const { zyid } = dto;

    // 获取病人信息
    const brxxInfo = await this.h11_brxxRepo.findOne({
      where: { zyid },
    });

    if (!brxxInfo) {
      throw new CustomException(ERR.ERR_500, '未找到该病人信息');
    }

    const brxm = brxxInfo.brxm;
    const gfbh = brxxInfo.gfbh;

    // 创建数据库查询运行器，用于管理事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 检查是否已报销
      const jsbzResult = await queryRunner.query(
        `SELECT ISNULL(jsbz, 0) as jsbz FROM g10_djxx WHERE lsh = @0`,
        [zyid],
      );
      const jsbz = jsbzResult?.[0]?.jsbz || 0;

      if (jsbz === 4) {
        await queryRunner.rollbackTransaction();
        throw new CustomException(
          ERR.ERR_500,
          '该病人已报销，请联系医保科或收费取消医保结算，再作废出院！',
        );
      }

      // 2. 更新病人状态：将住院状态改为2（在院），清空出院时间
      await queryRunner.query(
        `UPDATE h11_brxx
         SET zyzt = 2, cysj = NULL
         WHERE zyzt = 3 AND zyid = @0`,
        [zyid],
      );

      // 3. 更新医嘱主表标志（接受科室，确认，医嘱主表标志改成0）
      // 注意：这里需要传入科室ID，从当前登录用户获取或从病人信息中获取
      // 临时使用病人所在科室ID
      const ksid = dto.ksid || ''; // 需要根据实际情况调整
      if (ksid) {
        await queryRunner.query(
          `UPDATE h12_yzzb
           SET tzbz = 0
           WHERE zyid = @0 AND ksid = @1`,
          [zyid, ksid],
        );
      }

      // 4. 删除随访记录
      await queryRunner.query(`DELETE FROM YW_SF_BRXX WHERE zyid = @0`, [zyid]);

      // 5. 处理养老相关（如果启用了养老管理系统）
      // const ylmbbz = await this.paramService.gfGetPara(
      //   81,
      //   'ylmbbz',
      //   '0',
      //   '启用养老管理系统(1启用，0未启用)',
      // );
      // const ylybksid = await this.paramService.gfGetPara(
      //   81,
      //   'ylybksid',
      //   '',
      //   '启用养老医保科室编号',
      // );

      // 判断当前科室是否非养老医保科室且启用了养老管理
      // if (ylmbbz === '1' && ksid && !ylybksid.includes(ksid)) {
      //   // 点餐作废
      //   if (gfbh) {
      //     await queryRunner.query(
      //       `UPDATE yw_dcmx SET yxbz = 1 WHERE zyh = @0`,
      //       [gfbh],
      //     );

      //     // 更新养老人员状态
      //     await queryRunner.query(
      //       `UPDATE dict_oldie SET status = 2 WHERE id = @0`,
      //       [gfbh],
      //     );

      //     // 更新会诊状态
      //     await queryRunner.query(
      //       `UPDATE work_consult SET status = 2 WHERE id = @0`,
      //       [gfbh],
      //     );
      //   }
      // }

      // 提交事务
      await queryRunner.commitTransaction();

      // TODO: 6. 写入日志（需要实现日志服务）
      // f_userlog_zf(zyid, brxm, ksid, ksmc, 0, '办理出院', '1')

      return {
        code: 0,
        msg: '作废出院成功，病人已恢复在院状态！',
      };
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw new CustomException(ERR.ERR_500, `作废出院失败: ${error.message}`);
    } finally {
      // 释放查询运行器
      await queryRunner.release();
    }
  }

  /**
   * 转科操作
   * @param dto 转科参数
   */
  async transferDepartment(dto: TransferDepartmentDto) {
    const { zyid, zkksid, zksj, ksid, userid, gfbh } = dto;

    // 1. 前置校验：检查转科科室ID是否存在
    if (!zkksid) {
      throw new CustomException(ERR.ERR_10000, '请输入要转的科室!');
    }

    // 创建数据库查询运行器，用于管理事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 2. 获取病人信息
      const brxxInfo = await queryRunner.manager.findOne(h11_brxx, {
        where: { zyid },
      });

      if (!brxxInfo) {
        throw new CustomException(ERR.ERR_500, '未找到该病人信息');
      }

      const brxm = brxxInfo.brxm;
      const cyksid = brxxInfo.cyksid;

      // 3. 前置校验：检查是否有未发药（根据系统参数判断）
      const zxyptxParam = await this.paramService.gfGetPara(13, 'zxyptx', '0', '执行药品提醒');

      if (zxyptxParam === '1') {
        // 检查是否有未发药的药品
        const unfyCount = await this.checkUnDispensedMedicine(queryRunner, zyid);
        if (unfyCount > 0) {
          throw new CustomException(ERR.ERR_41005, '该病人有未发药，请发药后，再办转科！');
        }
      }
      // 4. 前置校验：检查是否有项目未执行（根据系统参数判断）
      const zxxmtxParam = await this.paramService.gfGetPara(13, 'zxxmtx', '0', '执行项目提醒');

      if (zxxmtxParam === '1') {
        // 检查是否有未执行的项目
        const unexecutedCount = await this.checkUnExecutedItems(queryRunner, zyid);
        if (unexecutedCount > 0) {
          throw new CustomException(
            ERR.ERR_41006,
            '该病人有项目未执行，请医技科室执行后，再办转科！',
          );
        }
      }
      // 5. 检查床位是否停止
      const cwsyxxCount = await queryRunner.query(
        `SELECT COUNT(*) as count FROM h13_cwsyxx WHERE ksid = @0 AND zyid = @1`,
        [ksid, zyid],
      );

      if (cwsyxxCount[0]?.count > 0) {
        // 自动停止床位
        await queryRunner.query(
          `UPDATE h11_brxx SET rycw = '', cycw = '', cybs = '' WHERE zyid = @0`,
          [zyid],
        );
        await queryRunner.query(`UPDATE h13_cwsyxx SET zyid = '', cwfpxx = '' WHERE zyid = @0`, [
          zyid,
        ]);
      }
      // 6. 统计是否已经结账 - 如果有未结账费用，需要确认
      const jsbzCount = await queryRunner.query(
        `SELECT COUNT(*) as count FROM h13_yzzxcs WHERE zyid = @0 AND jsbz = 0 AND sfbz = 1`,
        [zyid],
      );

      // 注意：这里在实际应用中可能需要前端确认，暂时允许转科
      const hasUnpaidFees = jsbzCount[0]?.count > 0;
      if (hasUnpaidFees) {
        throw new CustomException(ERR.ERR_500, '该病人有未结账费用，请结账后，再办转科！');
      }
      // 7. 更新病人状态为转科状态(zyzt = 6)
      await queryRunner.query(
        `UPDATE h11_brxx
         SET zyzt = 6
         WHERE cyksid = @0 AND zyzt < 3 AND zyid = @1`,
        [ksid, zyid],
      );

      // 8. 记录转科信息到h13_brzkqk表（等待转科科室确认）
      await queryRunner.query(
        `INSERT INTO h13_brzkqk (zkksid, zksj, zyid, lrsj, lryid, ksid)
         VALUES (@0, @1, @2, GETDATE(), @3, @4)`,
        [zkksid, zksj, zyid, userid, ksid],
      );

      // 7. 转移押金（根据系统参数判断）
      const yjkzkParam = await this.paramService.gfGetPara(13, 'yjkzk', '0', '转科同时转押金');

      if (yjkzkParam === '1') {
        await queryRunner.query(`UPDATE h11_yjk SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
      }

      // 8. 处理医嘱数据（根据zkjl参数）
      const zkjlParam = await this.paramService.gfGetPara(13, 'zkjl', '0', '转科前与转科后分开');

      if (zkjlParam === '1') {
        // 直接更新医嘱等表的科室ID到新科室
        await queryRunner.query(`UPDATE h12_yzzb SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);

        await queryRunner.query(
          `UPDATE h12_yzxb SET ksid = @0, qt1 = '1' WHERE zyid = @1 AND ksid = @2`,
          [zkksid, zyid, ksid],
        );

        await queryRunner.query(`UPDATE h13_yzzxcs SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);

        await queryRunner.query(`UPDATE h11_yjk SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);

        await queryRunner.query(`UPDATE h12_blzb SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);

        await queryRunner.query(`UPDATE h15_sszb SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);

        await queryRunner.query(`UPDATE h15_ssxb SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);

        await queryRunner.query(`UPDATE BQ_HLJL_NEW SET BRKS = @0 WHERE zyh = @1`, [zkksid, zyid]);

        await queryRunner.query(`UPDATE bQ_xtjc SET brks = @0 WHERE zyh = @1`, [zkksid, zyid]);

        // 处理材料科室
        const clksid = await this.paramService.gfGetPara(
          13,
          'cl' + zkksid,
          '0603',
          '材料' + zkksid,
        );

        await queryRunner.query(
          `UPDATE h13_yzzxcs SET zkksid = @0
           WHERE zyid = @1 AND ISNULL(fybz, 0) = 0 AND fylbid = '15' AND zkksid = @2`,
          [clksid, zyid, cyksid],
        );

        await queryRunner.query(
          `UPDATE h12_yzxb SET ksid = @0
           WHERE zyid = @1 AND fylbid = '15' AND ksid = @2`,
          [clksid, zyid, cyksid],
        );
      } else {
        // 只标记医嘱停止标志
        await queryRunner.query(
          `UPDATE h12_yzzb
           SET tzbz = 1, tzsj = GETDATE(), tzrid = @0
           WHERE zyid = @1`,
          [userid, zyid],
        );
      }

      // 9. 删除结算提示记录
      await queryRunner.query(`DELETE FROM h11_jshztzd1 WHERE zyid = @0`, [zyid]);

      // 10. 处理养老系统相关（如果启用）
      // const ylmbbz = await this.paramService.gfGetPara(
      //   81,
      //   'ylmbbz',
      //   '0',
      //   '启用养老管理系统(1启用，0未启用)',
      // );

      // if (ylmbbz === '1' && gfbh) {
      //   // 更新养老老人转科科室编号
      //   await queryRunner.query(
      //     `UPDATE dict_oldie SET zkksid = @0 WHERE id = @1`,
      //     [zkksid, gfbh],
      //   );

      //   // 更新点餐明细
      //   await queryRunner.query(
      //     `UPDATE yw_dcmx SET ks = @0 WHERE zyh = @1`,
      //     [zkksid, gfbh],
      //   );
      // }

      // 提交事务
      await queryRunner.commitTransaction();

      // TODO: 11. 写入日志（需要实现日志服务）
      // f_userlog_zf(zyid, brxm, ksid, ksmc, 0, '办理转科', '1')

      return {
        code: 0,
        msg: '转科申请成功，等待目标科室确认！',
        hasUnpaidFees, // 返回是否有未结账费用的标识
      };
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw new CustomException(ERR.ERR_500, `${error.message}`, 200);
    } finally {
      // 释放查询运行器
      await queryRunner.release();
    }
  }

  /**
   * 检查病人是否有未发药的药品
   * @param queryRunner 查询运行器
   * @param zyid 住院ID
   * @returns 未发药数量
   */
  private async checkUnDispensedMedicine(queryRunner: any, zyid: string): Promise<number> {
    // 获取相关科室参数
    const xyksid = await this.paramService.gfGetPara(13, 'xyksid', '', '西药科室');
    const cyksid = await this.paramService.gfGetPara(13, 'cyksid', '', '草药科室');
    const zyksid = await this.paramService.gfGetPara(13, 'zyksid', '', '中药科室');
    const clksid = await this.paramService.gfGetPara(13, 'clksid', '', '材料科室');
    const qtksid = await this.paramService.gfGetPara(13, 'qtksid', '', '其他科室');
    const zjksid = await this.paramService.gfGetPara(13, 'zjksid', '', '制剂科室');
    // 1. 检查h13_yzzxcs表中未发药的药品
    const result1 = await queryRunner.query(
      `SELECT ISNULL(COUNT(*), 0) as count
       FROM h13_yzzxcs
       INNER JOIN h12_yzxb ON h13_yzzxcs.yzxh = h12_yzxb.yzxh
         AND h13_yzzxcs.yzlx = h12_yzxb.yzlx
         AND h13_yzzxcs.zyid = h12_yzxb.zyid
         AND h13_yzzxcs.mxxh = h12_yzxb.mxxh
       WHERE ISNULL(h13_yzzxcs.fybz, 0) <> 1
         AND (h12_yzxb.xmzl = 2 OR h12_yzxb.xmzl = 3)
         AND (h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) > 0
         AND h13_yzzxcs.jfyl > 0
         AND h13_yzzxcs.zyid = @0
         AND h13_yzzxcs.zkksid IN (@1, @2, @3, @4, @5, @6)`,
      [zyid, xyksid, cyksid, zyksid, clksid, qtksid, zjksid],
    );

    const count1 = result1[0]?.count || 0;
    if (count1 > 0) {
      return count1;
    }

    // 2. 检查h13_yzzxcs_tf表中未发药的退费药品
    const result2 = await queryRunner.query(
      `SELECT ISNULL(COUNT(*), 0) as count
       FROM h13_yzzxcs_tf
       INNER JOIN h12_yzxb ON h13_yzzxcs_tf.yzxh = h12_yzxb.yzxh
         AND h13_yzzxcs_tf.yzlx = h12_yzxb.yzlx
         AND h13_yzzxcs_tf.zyid = h12_yzxb.zyid
         AND h13_yzzxcs_tf.mxxh = h12_yzxb.mxxh
       WHERE ISNULL(h13_yzzxcs_tf.fybz, 0) <> 1
         AND (h12_yzxb.xmzl = 2 OR h12_yzxb.xmzl = 3)
         AND ABS(h13_yzzxcs_tf.zxcs - h13_yzzxcs_tf.bzxcs) > 0
         AND h13_yzzxcs_tf.jfyl > 0
         AND h13_yzzxcs_tf.zyid = @0
         AND h13_yzzxcs_tf.zkksid IN (@1, @2, @3, @4, @5, @6)`,
      [zyid, xyksid, cyksid, zyksid, clksid, qtksid, zjksid],
    );

    const count2 = result2[0]?.count || 0;
    if (count2 > 0) {
      return count2;
    }

    // 3. 检查手术医嘱未发药
    const ssclksid = await this.paramService.gfGetPara(13, 'ssclksid', '', '手术材料科室');
    const jpksid = await this.paramService.gfGetPara(13, 'jpksid', '', '精品科室');
    const hlksid = await this.paramService.gfGetPara(13, 'hlksid', '', '护理科室');

    const result3 = await queryRunner.query(
      `SELECT ISNULL(COUNT(*), 0) as count
       FROM h15_sszb
       INNER JOIN h15_ssxb ON h15_ssxb.zyid = h15_sszb.zyid
         AND h15_ssxb.ssid = h15_sszb.ssid
       INNER JOIN h11_brxx ON h15_sszb.zyid = h11_brxx.zyid
       WHERE h15_sszb.zyid = @0
         AND ABS(h15_ssxb.jfyl) > 0
         AND ISNULL(h15_ssxb.tpbz, 0) = 0
         AND ISNULL(h15_ssxb.tjbz, 0) = 1
         AND h15_ssxb.xmzl IN (2, 3)
         AND h15_ssxb.zxksid IN (@1, @2, @3, @4, @5, @6, @7, @8, @9)`,
      [zyid, xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid, jpksid, hlksid],
    );

    return result3[0]?.count || 0;
  }

  /**
   * 检查病人是否有项目未执行
   * @param queryRunner 查询运行器
   * @param zyid 住院ID
   * @returns 未执行项目数量
   */
  private async checkUnExecutedItems(queryRunner: any, zyid: string): Promise<number> {
    // 获取费用类别参数(参数值可能是逗号分隔的多个ID)
    const hlfylbid = await this.paramService.gfGetPara(40, 'hlfylbid', '08', '化验费用类别');
    const bcfylbid = await this.paramService.gfGetPara(40, 'bcfylbid', '', 'B超费用类别');
    const xgfylbid = await this.paramService.gfGetPara(40, 'xgfylbid', '', 'X光费用类别');
    const qtfylbid = await this.paramService.gfGetPara(40, 'qtfylbid', '', '其他费用类别');
    const mrfylbid = await this.paramService.gfGetPara(40, 'mrfylbid', '', 'MR费用类别');
    const zyfylbid = await this.paramService.gfGetPara(40, 'zyfylbid', '', '中医费用类别');
    const ctfylbid = await this.paramService.gfGetPara(40, 'ctfylbid', '', 'CT费用类别');
    const xdfylbid = await this.paramService.gfGetPara(40, 'xdfylbid', '', '心电费用类别');
    const kffylbid = await this.paramService.gfGetPara(40, 'kffylbid', '', '康复费用类别');
    const tsfylbid = await this.paramService.gfGetPara(40, 'tsfylbid', '', '特殊费用类别');

    // 将逗号分隔的字符串拆分成数组并过滤空值
    const splitAndFilter = (str: string): string[] => {
      if (!str || str.trim() === '') return [];
      return str
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '');
    };

    // 拆分各个费用类别
    const hl = splitAndFilter(hlfylbid); // 化验
    const bc = splitAndFilter(bcfylbid); // B超
    const xg = splitAndFilter(xgfylbid); // X光
    const qt = splitAndFilter(qtfylbid); // 其他
    const mr = splitAndFilter(mrfylbid); // MR
    const zy = splitAndFilter(zyfylbid); // 中医
    const ct = splitAndFilter(ctfylbid); // CT
    const xd = splitAndFilter(xdfylbid); // 心电
    const kf = splitAndFilter(kffylbid); // 康复
    const ts = splitAndFilter(tsfylbid); // 特殊

    // 合并所有费用类别ID到一个数组
    const fylbList = [...hl, ...bc, ...xg, ...qt, ...mr, ...zy, ...ct, ...xd, ...kf, ...ts];

    if (fylbList.length === 0) {
      return 0; // 如果没有配置费用类别,则不检查
    }

    // 检查未执行的项目
    const result = await queryRunner.query(
      `SELECT COUNT(*) as count
       FROM h13_yzzxcs
       INNER JOIN h12_yzxb ON h13_yzzxcs.yzxh = h12_yzxb.yzxh
         AND h13_yzzxcs.yzlx = h12_yzxb.yzlx
         AND h13_yzzxcs.zyid = h12_yzxb.zyid
         AND h13_yzzxcs.mxxh = h12_yzxb.mxxh
       INNER JOIN h12_yzzb ON h12_yzzb.yzxh = h12_yzxb.yzxh
         AND h12_yzzb.yzlx = h12_yzxb.yzlx
         AND h12_yzzb.zyid = h12_yzxb.zyid
       WHERE (ISNULL(h13_yzzxcs.sfbz, 0) <> 1 OR ISNULL(h13_yzzxcs.clbz, 0) <> 1)
         AND h12_yzxb.xmzl = 1
         AND (h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) > 0
         AND h13_yzzxcs.jfyl <> 0
         AND h13_yzzxcs.xmdj > 0
         AND h13_yzzxcs.fylbid IN (${fylbList.map((_, i) => `@${i + 1}`).join(',')})
         AND h12_yzzb.zyid = @0`,
      [zyid, ...fylbList],
    );

    return result[0]?.count || 0;
  }
}
