import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { SmSsap } from './sm-ssap.entity';
import { CancelSmSsapDto, CreateSmSsapDto, FeeListQueryDto } from './dto/sm-ssap.dto';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { SmSssq } from '../sm-sssq/sm-sssq.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';

@Injectable()
export class SmSsapService {
  constructor(
    @InjectRepository(SmSsap)
    private readonly smSsapRepository: Repository<SmSsap>,
    @InjectRepository(h11_brxx)
    private readonly h11BrxxRepository: Repository<h11_brxx>,
    @InjectRepository(SmSssq)
    private readonly smSssqRepository: Repository<SmSssq>,
    private readonly gyIdentityService: GyIdentityService,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * 新增手术安排通知单
   * 规则（参考 PB：w_ss_gxmk_ssap.wf_save）：
   * - 校验：手术日期 >= 通知日期；手术医师(SSYS/SSYS_2)至少一个；手术名称(SSDM)必填
   * - 生成 SSBH（GyIdentity：SM_SSAP）
   * - 更新申请单 SM_SSSQ.APBZ=1（表示已安排）
   */
  async create(createDto: CreateSmSsapDto): Promise<{ ssbh: string; sqdh: number; zyid: string }> {
    // 1) 校验病人存在
    const patientInfo = await this.h11BrxxRepository.findOne({ where: { zyid: createDto.zyid } });
    if (!patientInfo) {
      throw new Error('病人不存在，请重新输入!');
    }

    // 2) 基础校验（日期/必填）
    const aprq = createDto.aprq ? new Date(createDto.aprq) : new Date();
    const ssrq = createDto.ssrq ? new Date(createDto.ssrq) : null;
    if (!ssrq) {
      throw new Error('请选择手术日期!');
    }
    if (ssrq < aprq) {
      throw new Error('手术日期不能小于通知日期!');
    }
    if (!createDto.ssys && !createDto.ssys_2) {
      throw new Error('请选择手术医师!');
    }
    if (!createDto.ssdm) {
      throw new Error('请选择手术名称!');
    }
    if (!createDto.sqdh) {
      throw new Error('缺少手术申请单号(sqdh)!');
    }

    // 3) 校验申请单存在且未作废/未安排
    const sssq = await this.smSssqRepository.findOne({ where: { sqdh: createDto.sqdh } });
    if (!sssq) {
      throw new Error(`手术申请单【${createDto.sqdh}】不存在!`);
    }
    if (sssq.zfbz === 1) {
      throw new Error('该手术申请单已作废，不能安排!');
    }
    if (sssq.apbz === 1) {
      throw new Error('该手术申请单已安排，不能重复安排!');
    }

    // 4) 生成手术编号（字符串存储）
    const ssbhNo = await this.gyIdentityService.getMax('SM_SSAP');
    if (!ssbhNo || ssbhNo < 0) {
      throw new Error('生成手术编号失败!');
    }
    const ssbh = String(ssbhNo);

    // 5) 事务：写入安排单 + 更新申请单状态
    return await this.entityManager.transaction(async (manager) => {
      // 防重复：同一申请单只能有一条安排单（以 zyid+sqdh 作为主键）
      const exists = await manager.findOne(SmSsap, {
        where: { zyid: createDto.zyid, sqdh: createDto.sqdh, zfbz: 0 },
      });
      if (exists) {
        throw new Error('该申请单已存在对应的手术安排通知单!');
      }

      const ap = this.smSsapRepository.create({
        ...createDto,
        ssbh,
        zyh: createDto.zyh ?? patientInfo.zybh ?? null,
        aprq,
        ssrq,
        // 默认标志位（与 PB 行为一致：新单均为 0）
        jzbz: createDto.jzbz ?? 0,
        hzbz: createDto.hzbz ?? 0,
        thbz: createDto.thbz ?? 0,
        mzbz: createDto.mzbz ?? 0,
        qxbz: createDto.qxbz ?? 0,
        ssbz: createDto.ssbz ?? 0,
        zfbz: createDto.zfbz ?? 0,
        jfbz: createDto.jfbz ?? 0,
        wcbz: createDto.wcbz ?? 0,
        shbz: createDto.shbz ?? 0,
        mzwcbz: createDto.mzwcbz ?? 0,
      });

      await manager.save(SmSsap, ap);

      await manager.update(
        SmSssq,
        { sqdh: createDto.sqdh },
        {
          apbz: 1,
          ssapsj: new Date(),
        },
      );

      return { ssbh, sqdh: createDto.sqdh, zyid: createDto.zyid };
    });
  }

  /**
   * 取消手术安排（作废）
   * 规则（参考 PB：cb_blankout + wf_save 作废分支）：
   * - 安排单存在且 zfbz=0
   * - 若已录入会诊/谈话/麻醉/器械/手术/费用/术后等记录则不允许作废
   * - 事务：SM_SSAP.zfbz=1，SM_SSSQ.APBZ=0
   */
  async cancel(dto: CancelSmSsapDto): Promise<{ zyid: string; sqdh: number }> {
    const { zyid, sqdh, ssbh } = dto;
    const ap = await this.smSsapRepository.findOne({
      where: { zyid, sqdh, ssbh: String(ssbh) },
    });
    if (!ap) {
      throw new Error('手术安排通知单不存在!');
    }
    if (ap.zfbz === 1) {
      throw new Error('该手术安排已作废，无需重复操作!');
    }

    // 已录入其它记录则不允许作废（与 PB cb_blankout 一致）
    const parts: string[] = [];
    if (ap.hzbz === 1) parts.push('会诊记录');
    if (ap.thbz === 1) parts.push('谈话记录');
    if (ap.mzbz === 1) parts.push('麻醉记录');
    if (ap.qxbz === 1) parts.push('器械准备');
    if (ap.ssbz === 1) parts.push('手术记录');
    if (ap.jfbz === 1) parts.push('手术费用');
    if (ap.shbz === 1) parts.push('术后信息');
    if (parts.length > 0) {
      throw new Error(`该通知单已录入${parts.join('、')}，不能取消安排!`);
    }

    await this.entityManager.transaction(async (manager) => {
      await manager.update(SmSsap, { zyid, sqdh }, { zfbz: 1 });
      await manager.update(SmSssq, { sqdh }, { apbz: 0 });
    });

    return { zyid, sqdh };
  }

  /**
   * 已安排手术列表查询（实体方式）
   * 查询条件：ZFBZ=0(未作废)、zyzt<3(在院)
   * 附带 sl：h15_ssxb 中 kshs 为空的条数；sjbz：h15_sszb 首条 bz1
   */
  async findArrangedList(ksid: string): Promise<any[]> {
    const qb = this.smSsapRepository
      .createQueryBuilder('ap')
      .innerJoinAndSelect('ap.h11BrxxEntity', 'brxx')
      .leftJoinAndSelect('brxx.brlxidEntity', 'brlxidEntity')
      .leftJoinAndSelect('brxx.mzysEntity', 'mzysEntity')
      .leftJoinAndSelect('brxx.ryzdEntity', 'ryzdEntity')
      .leftJoinAndSelect('ap.ssdmEntity', 'ssdmEntity')
      .leftJoinAndSelect('ap.mzdmEntity', 'mzdmEntity')
      .where('brxx.zyzt < :zyzt', { zyzt: 3 })
      .andWhere('ap.zfbz = :zfbz', { zfbz: 0 });
    if (ksid) {
      qb.andWhere('brxx.cyksid LIKE :ksid', { ksid: `%${ksid}%` });
    }

    const list = await qb.getMany();
    if (list.length === 0) return list;

    const zyids = [...new Set(list.map((ap) => ap.zyid))];
    const placeholders = zyids.map((_, i) => `@${i}`).join(',');

    const slSql = `SELECT zyid, COUNT(*) as sl FROM h15_ssxb WHERE zyid IN (${placeholders}) AND (ISNULL(kshs,'') = '') GROUP BY zyid`;
    const slRows: { zyid: string; sl: number }[] = await this.entityManager.query(slSql, zyids);
    const slMap = new Map(slRows.map((r) => [r.zyid, r.sl]));

    const sjbzSql = `SELECT zyid, bz1 as sjbz FROM (SELECT zyid, bz1, ROW_NUMBER() OVER (PARTITION BY zyid ORDER BY ssid) as rn FROM h15_sszb WHERE zyid IN (${placeholders})) t WHERE rn = 1`;
    const sjbzRows: { zyid: string; sjbz: string }[] = await this.entityManager.query(
      sjbzSql,
      zyids,
    );
    const sjbzMap = new Map(sjbzRows.map((r) => [r.zyid, r.sjbz]));

    return list.map((ap) => ({
      ...ap,
      sl: slMap.get(ap.zyid) ?? 0,
      sjbz: sjbzMap.get(ap.zyid) ?? null,
    }));
  }

  /**
   * 手术安排通知单查看详情（实体方式）
   * 条件：SM_SSAP.sqdh = sqdh 且 SM_SSAP.zfbz = 0
   * 关联：SM_SSSQ(SQDH)、h11_brxx(zyid)
   */
  async findDetail(sqdh: number): Promise<any | null> {
    const ap = await this.smSsapRepository
      .createQueryBuilder('ap')
      .innerJoinAndSelect('ap.h11BrxxEntity', 'brxx')
      .innerJoinAndSelect('ap.smSssqEntity', 'sssq')
      .where('ap.sqdh = :sqdh', { sqdh })
      .andWhere('ap.zfbz = :zfbz', { zfbz: 0 })
      .getOne();

    if (!ap) return null;

    const brxx = ap.h11BrxxEntity;
    const sssq = ap.smSssqEntity;
    return {
      ssbh: ap.ssbh,
      sqdh: ap.sqdh,
      zyh: ap.zyh,
      zybh: brxx?.zybh ?? null,
      brxm: brxx?.brxm ?? null,
      xbid: brxx?.xbid ?? null,
      brnl: brxx?.brnl ?? null,
      nldw: brxx?.nldw ?? null,
      csrq: brxx?.csrq ?? null,
      cyksid: brxx?.cyksid ?? null,
      zkksid: brxx?.zkksid ?? null,
      rycw: brxx?.rycw ?? null,
      brlxid: brxx?.brlxid ?? null,
      aprq: ap.aprq,
      ssrq: ap.ssrq,
      ssnm: ap.ssnm,
      sqks: sssq?.sqks ?? null,
      ssys: ap.ssys,
      ssyz: ap.ssyz,
      ssez: ap.ssez,
      sssz: ap.sssz,
      xshs: ap.xshs,
      xhhs: ap.xhhs,
      mzdm: ap.mzdm,
      mzys: ap.mzys,
      jzbz: ap.jzbz,
      hzbz: ap.hzbz,
      thbz: ap.thbz,
      mzbz: ap.mzbz,
      qxbz: ap.qxbz,
      ssbz: ap.ssbz,
      jfbz: ap.jfbz,
      zfbz: ap.zfbz,
      wcbz: ap.wcbz,
      shbz: ap.shbz,
      ssyq: ap.ssyq,
      zysx: ap.zysx,
      czgh: ap.czgh,
      ssys_2: ap.ssys_2,
      xshs_2: ap.xshs_2,
      xhhs_2: ap.xhhs_2,
      mzys_2: ap.mzys_2,
      ssfj: ap.ssfj,
      ssth: ap.ssth,
      mzwcbz: ap.mzwcbz,
      ssks: ap.ssks,
      zyid: ap.zyid,
      ssdm: ap.ssdm,
      sxys: ap.sxys,
      sqlx: ap.sqlx,
      zdbm: ap.zdbm,
      lszd: ap.lszd,
      sslx: ap.sslx,
      bzxx1: ap.bzxx1,
      bzxx2: ap.bzxx2,
      bzxx3: ap.bzxx3,
    };
  }

  /**
   * 费用列表查询（与旧版 PB 条件一致）
   * 关联 h11_brxx 与 SM_SSAP，支持：日期范围、在院状态、科室、病人类型、住院号/姓名检索等
   */
  async findFeeList(query?: FeeListQueryDto): Promise<any[]> {
    const conditions: string[] = ['h11_brxx.zyid = SM_SSAP.zyid'];
    const params: any[] = [];
    let paramIndex = 0;

    if (query?.zyid) {
      conditions.push(`h11_brxx.zyid = @${paramIndex}`);
      params.push(query.zyid);
      paramIndex++;
    }
    if (query?.ssrqStart != null) {
      conditions.push(`SM_SSAP.ssrq >= @${paramIndex}`);
      params.push(query.ssrqStart);
      paramIndex++;
    }
    if (query?.ssrqEnd != null) {
      conditions.push(`SM_SSAP.ssrq <= @${paramIndex}`);
      params.push(query.ssrqEnd);
      paramIndex++;
    }

    // 在院状态 zt：0/1=全部/在院(zyzt<=2), 3=待办(zyzt=3), 4=出院(zyzt=4)
    const zt = query?.zt !== undefined ? Number(query.zt) : 0;
    if (zt === 0 || zt === 1) {
      conditions.push('h11_brxx.zyzt <= 2');
    } else if (zt === 3) {
      conditions.push('h11_brxx.zyzt = 3');
    } else if (zt === 4) {
      conditions.push('h11_brxx.zyzt = 4');
    }

    // 检索关键字 cx：含中文按姓名模糊，否则按住院号前缀
    const cx = query?.cx?.trim();
    if (cx) {
      const hasChinese = [...cx].some((c) => c.charCodeAt(0) > 160);
      if (hasChinese) {
        conditions.push(`h11_brxx.brxm LIKE @${paramIndex}`);
        params.push(`%${cx}%`);
        paramIndex++;
      } else {
        conditions.push(`h11_brxx.zybh LIKE @${paramIndex}`);
        params.push(`${cx}%`);
        paramIndex++;
      }
    }
    if (query?.dateStart != null && query?.dateEnd != null) {
      conditions.push(`h11_brxx.rysj > @${paramIndex}`);
      params.push(query.dateStart);
      paramIndex++;
      conditions.push(`h11_brxx.rysj < @${paramIndex}`);
      params.push(query.dateEnd);
      paramIndex++;
    }

    // 科室 ksid：'0' 或空表示全部(like '%')
    const ksid = query?.ksid?.trim() || '0';
    if (ksid === '0') {
      conditions.push("UPPER(h11_brxx.cyksid) LIKE '%'");
    } else {
      conditions.push(`UPPER(h11_brxx.cyksid) LIKE UPPER(@${paramIndex})`);
      params.push(ksid);
      paramIndex++;
    }

    // 病人类型 brlx + 作废标志
    const brlx = query?.brlx?.trim() || '0';
    if (brlx === '0') {
      conditions.push("UPPER(h11_brxx.brlxid) LIKE '%'");
    } else {
      conditions.push(`UPPER(h11_brxx.brlxid) LIKE UPPER(@${paramIndex})`);
      params.push(brlx);
      paramIndex++;
    }
    const zfbz = query?.zfbz !== undefined ? query.zfbz : 0;
    conditions.push(`SM_SSAP.ZFBZ = @${paramIndex}`);
    params.push(zfbz);
    paramIndex++;

    // 基础条件：入院时间 > 2014.01.03
    conditions.push("h11_brxx.rysj > '2014-01-03'");

    const whereClause = conditions.join(' AND ');
    const orderClause = zt === 4 ? ' ORDER BY h11_brxx.cysj' : '';

    const sql = `
SELECT h11_brxx.zyid,
       h11_brxx.zybh,
       h11_brxx.brlxid,
       h11_brxx.brxm,
       h11_brxx.xbid,
       h11_brxx.brnl,
       h11_brxx.sfzh,
       h11_brxx.cyksmc,
       h11_brxx.hkdz,
       h11_brxx.jtdh,
       h11_brxx.nldw,
       h11_brxx.nldw1,
       h11_brxx.etys,
       h11_brxx.ryzd,
       h11_brxx.cyzd,
       h11_brxx.hlzt,
       h11_brxx.rybqid,
       h11_brxx.hljl,
       h11_brxx.rysj,
       h11_brxx.cycw,
       h11_brxx.mzys,
       h11_brxx.cyksid,
       0 AS fybz,
       0 AS tjbz,
       h11_brxx.bz4,
       h11_brxx.cysj,
       h11_brxx.lxdh,
       h11_brxx.zyzt,
       h11_brxx.zycs,
       h11_brxx.rybs,
       SM_SSAP.ssdm AS ssmc,
       SM_SSAP.ZFBZ AS sjbz,
       SM_SSAP.ssrq AS rq,
       SM_SSAP.ssbh AS xh,
       SM_SSAP.sqdh AS sqdh,
       SM_SSAP.ssbh AS ssbh,
       SM_SSAP.ssbz AS ssbz,
       SM_SSAP.qxbz AS qxbz,
       SM_SSAP.ssrq AS ssrq,
       SM_SSAP.ssys AS ssys,
       (CASE WHEN LEN(ISNULL(h11_brxx.lsh1,'')) > 0 THEN '1' ELSE '0' END) AS lsh1,
       h11_brxx.bahm,
       h11_brxx.bzxx,
       (SELECT ISNULL(SUM(yjje), 0) FROM h11_yjk WHERE h11_yjk.zyid = h11_brxx.zyid AND h11_yjk.sjzt = 1) AS yjk,
       CASE
         WHEN h11_brxx.zyzt < 4 THEN
           (SELECT ISNULL(SUM(t.je), 0)
            FROM (SELECT SUM(ROUND(xmdj, 2) * jfyl * (zxcs - bzxcs) * kyts) AS je
                  FROM h13_yzzxcs
                  WHERE h13_yzzxcs.zyid = h11_brxx.zyid
                  UNION ALL
                  SELECT SUM(jfyl * xmdj)
                  FROM h15_ssxb
                  WHERE h15_ssxb.zyid = h11_brxx.zyid) t)
         WHEN h11_brxx.zyzt = 4 THEN
           (SELECT ISNULL(SUM(fyhj), 0) FROM h11_fpzb WHERE h11_fpzb.zyid = h11_brxx.zyid AND h11_fpzb.sjzt = 1)
         ELSE ISNULL(h11_brxx.qfjsje, 0)
       END AS qfjsje,
       h11_brxx.zyts,
       h11_brxx.zkksid,
       h11_brxx.czry,
       (SELECT ISNULL(SUM(H11_xnh.sjhj), 0) FROM H11_xnh WHERE h11_brxx.zyid = H11_xnh.zyid AND ISNULL(bz1, '1') = '1') AS sjhj,
       (SELECT ISNULL(SUM(ISNULL(H11_xnh.ljfykb, 0) + ISNULL(H11_xnh.ljfyhj, 0) + ISNULL(H11_xnh.je2, 0) + ISNULL(H11_xnh.dbje, 0)), 0)
        FROM H11_xnh WHERE h11_brxx.zyid = H11_xnh.zyid AND ISNULL(bz1, '1') = '1') AS ybhj
FROM h11_brxx,
     SM_SSAP
WHERE ${whereClause}${orderClause}
`;
    return await this.entityManager.query(sql, params);
  }
}
