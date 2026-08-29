import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import dayjs = require('dayjs');
import { AuditListQueryDto } from './dto/audit-list.dto';

const DATETIME_FIELDS = new Set([
  'csrq',
  'rysj',
  'cysj',
  'zkrq',
  'riqi',
  'jdrq',
  'jssj',
]);

/** 对齐 PB dw_dj 列表字段 + 查询 SQL SELECT */
const AUDIT_LIST_SELECT = `
  N04_21.zyid AS zyid,
  N04_21.zybh AS zybh,
  N04_21.USERCODE AS usercode,
  N04_21.USERNAME AS username,
  N04_21.YLFKFS AS ylfkfs,
  N04_21.JKKH AS jkkh,
  N04_21.ZYCS AS zycs,
  N04_21.BAH AS bah,
  N04_21.XM AS xm,
  N04_21.XB AS xb,
  N04_21.CSRQ AS csrq,
  N04_21.NL AS nl,
  N04_21.GJ AS gj,
  N04_21.BZYZS_NL AS bzyzs_nl,
  N04_21.XSETZ AS xsetz,
  N04_21.XSERYTZ AS xserytz,
  N04_21.CSD1 AS csd1,
  N04_21.CSD2 AS csd2,
  N04_21.CSD3 AS csd3,
  (
    ISNULL((SELECT TOP 1 RTRIM(dqmc) FROM h00_dqbm WHERE dqbm = N04_21.CSD1), '')
    + ISNULL((SELECT TOP 1 RTRIM(dqmc) FROM h00_dqbm WHERE dqbm = N04_21.CSD2), '')
    + ISNULL((SELECT TOP 1 RTRIM(dqmc) FROM h00_dqbm WHERE dqbm = N04_21.CSD3), '')
  ) AS csdmc,
  N04_21.GG1 AS gg1,
  N04_21.GG2 AS gg2,
  N04_21.GG3 AS gg3,
  N04_21.MZ AS mz,
  N04_21.SFZH AS sfzh,
  N04_21.ZY AS zy,
  N04_21.HY AS hy,
  N04_21.XZZ1 AS xzz1,
  N04_21.XZZ2 AS xzz2,
  N04_21.XZZ3 AS xzz3,
  N04_21.DH AS dh,
  N04_21.YB1 AS yb1,
  N04_21.HKDZ1 AS hkdz1,
  N04_21.HKDZ2 AS hkdz2,
  N04_21.HKDZ3 AS hkdz3,
  N04_21.YB2 AS yb2,
  N04_21.GZDWJDZ AS gzdwjdz,
  N04_21.DWDH AS dwdh,
  N04_21.YB3 AS yb3,
  N04_21.LXRXM AS lxrxm,
  N04_21.GX AS gx,
  N04_21.DZ AS dz,
  N04_21.DH1 AS dh1,
  N04_21.RYTJ AS rytj,
  N04_21.ZLLB AS zllb,
  N04_21.RYSJ AS rysj,
  N04_21.RYSJ_S AS rysj_s,
  N04_21.RYKB AS rykb,
  N04_21.RYBF AS rybf,
  N04_21.ZKKB AS zkkb,
  N04_21.CYSJ AS cysj,
  N04_21.CYSJ_S AS cysj_s,
  N04_21.CYKB AS cykb,
  N04_21.CYBF AS cybf,
  N04_21.SJZY AS sjzy,
  N04_21.MZD_ZYZD AS mzd_zyzd,
  N04_21.JBDM AS jbdm,
  N04_21.MZZD_XYZD AS mzzd_xyzd,
  N04_21.JBBM AS jbbm,
  N04_21.SSLCLJ AS sslclj,
  N04_21.ZYYJ AS zyyj,
  N04_21.ZYZLSB AS zyzlsb,
  N04_21.ZYZLJS AS zyzljs,
  N04_21.BZSH AS bzsh,
  N04_21.WBYY AS wbyy,
  N04_21.JBBM1 AS jbbm1,
  N04_21.BLZD AS blzd,
  N04_21.JBBM2 AS jbbm2,
  N04_21.BLH AS blh,
  N04_21.YWGM AS ywgm,
  N04_21.GMYW AS gmyw,
  N04_21.SJ AS sj,
  N04_21.XX AS xx,
  N04_21.RH AS rh,
  N04_21.KZR AS kzr,
  N04_21.ZRYS AS zrys,
  N04_21.ZZYS AS zzys,
  N04_21.ZYYS AS zyys,
  N04_21.ZRHS AS zrhs,
  N04_21.JXYS AS jxys,
  N04_21.SXYS AS sxys,
  N04_21.BMY AS bmy,
  N04_21.BAZL AS bazl,
  N04_21.ZKYS AS zkys,
  N04_21.ZKHS AS zkhs,
  N04_21.ZKRQ AS zkrq,
  N04_21.LYFS AS lyfs,
  N04_21.YZZY_JGMC AS yzzy_jgmc,
  N04_21.WSY_JGMC AS wsy_jgmc,
  N04_21.ZZYJH AS zzyjh,
  N04_21.MD AS md,
  N04_21.RYQ_T AS ryq_t,
  N04_21.RYQ_XS AS ryq_xs,
  N04_21.RYQ_FZ AS ryq_fz,
  N04_21.RYH_T AS ryh_t,
  N04_21.RYH_XS AS ryh_xs,
  N04_21.RYH_FZ AS ryh_fz,
  N04_21.FZR AS fzr,
  N04_21.TJFZR AS tjfzr,
  N04_21.LXDH AS lxdh,
  N04_21.RIQI AS riqi,
  N04_21.sjbz AS sjbz,
  N04_21.nldw AS nldw,
  N04_21.bzxx AS bzxx,
  N04_21.bzxx1 AS bzxx1,
  N04_21.bz3 AS bz3,
  N04_21.tjbz AS tjbz,
  N04_21.drgbz AS drgbz,
  N04_21.jdrq AS jdrq,
  h11_brxx.jssj AS jssj,
  h11_brxx.mzys AS mzys,
  h11_brxx.cyksid AS cyksid,
  h11_brxx.sxys AS gcys,
  (SELECT TOP 1 icd10 FROM N04_22 WHERE zdlx = '2' AND zyid = N04_21.zyid) AS zzdbm,
  (SELECT TOP 1 zdmc FROM N04_22 WHERE zdlx = '2' AND zyid = N04_21.zyid) AS zzdmc,
  (SELECT TOP 1 ssjczbm FROM N04_23 WHERE main_oprn_flag = '1' AND zyid = N04_21.zyid) AS ssdbm,
  (SELECT TOP 1 ssjczmc FROM N04_23 WHERE main_oprn_flag = '1' AND zyid = N04_21.zyid) AS ssdmc,
  ISNULL((SELECT TOP 1 ISNULL(szbz, 0) FROM n04_jksz WHERE zyid = N04_21.zyid), 0) AS printbz
`;

/** 未写首页：出院病人尚无 N04_21 记录，按列表字段从 h11_brxx 映射 */
const MISSING_HOMEPAGE_SELECT = `
  h11_brxx.zyid AS zyid,
  h11_brxx.zybh AS zybh,
  CAST(NULL AS VARCHAR(20)) AS usercode,
  CAST(NULL AS VARCHAR(60)) AS username,
  CAST(NULL AS VARCHAR(10)) AS ylfkfs,
  CAST(NULL AS VARCHAR(20)) AS jkkh,
  h11_brxx.zycs AS zycs,
  h11_brxx.bahm AS bah,
  h11_brxx.brxm AS xm,
  h11_brxx.xbid AS xb,
  h11_brxx.csrq AS csrq,
  h11_brxx.brnl AS nl,
  CAST(NULL AS VARCHAR(40)) AS gj,
  CAST(NULL AS DECIMAL(18, 0)) AS bzyzs_nl,
  CAST(NULL AS DECIMAL(18, 2)) AS xsetz,
  CAST(NULL AS DECIMAL(18, 2)) AS xserytz,
  CAST(NULL AS VARCHAR(40)) AS csd1,
  CAST(NULL AS VARCHAR(40)) AS csd2,
  h11_brxx.csddmc AS csd3,
  h11_brxx.csddmc AS csdmc,
  CAST(NULL AS VARCHAR(40)) AS gg1,
  CAST(NULL AS VARCHAR(40)) AS gg2,
  CAST(NULL AS VARCHAR(40)) AS gg3,
  h11_brxx.mzmc AS mz,
  h11_brxx.sfzh AS sfzh,
  CAST(NULL AS VARCHAR(40)) AS zy,
  CAST(NULL AS VARCHAR(10)) AS hy,
  CAST(NULL AS VARCHAR(40)) AS xzz1,
  CAST(NULL AS VARCHAR(40)) AS xzz2,
  CAST(NULL AS VARCHAR(40)) AS xzz3,
  CAST(NULL AS VARCHAR(20)) AS dh,
  CAST(NULL AS VARCHAR(10)) AS yb1,
  CAST(NULL AS VARCHAR(40)) AS hkdz1,
  CAST(NULL AS VARCHAR(40)) AS hkdz2,
  CAST(NULL AS VARCHAR(40)) AS hkdz3,
  CAST(NULL AS VARCHAR(10)) AS yb2,
  CAST(NULL AS VARCHAR(80)) AS gzdwjdz,
  h11_brxx.dwdh AS dwdh,
  CAST(NULL AS VARCHAR(10)) AS yb3,
  h11_brxx.lxrm AS lxrxm,
  CAST(NULL AS VARCHAR(10)) AS gx,
  h11_brxx.lxdz AS dz,
  h11_brxx.lxdh AS dh1,
  CAST(NULL AS VARCHAR(10)) AS rytj,
  CAST(NULL AS VARCHAR(10)) AS zllb,
  h11_brxx.rysj AS rysj,
  CAST(NULL AS VARCHAR(10)) AS rysj_s,
  h11_brxx.ryksmc AS rykb,
  CAST(NULL AS VARCHAR(20)) AS rybf,
  CAST(NULL AS VARCHAR(20)) AS zkkb,
  h11_brxx.cysj AS cysj,
  CAST(NULL AS VARCHAR(10)) AS cysj_s,
  h11_brxx.cyksmc AS cykb,
  CAST(NULL AS VARCHAR(20)) AS cybf,
  h11_brxx.zyts AS sjzy,
  CAST(NULL AS VARCHAR(80)) AS mzd_zyzd,
  CAST(NULL AS VARCHAR(30)) AS jbdm,
  h11_brxx.mzzd AS mzzd_xyzd,
  CAST(NULL AS VARCHAR(30)) AS jbbm,
  CAST(NULL AS VARCHAR(10)) AS sslclj,
  CAST(NULL AS VARCHAR(10)) AS zyyj,
  CAST(NULL AS VARCHAR(10)) AS zyzlsb,
  CAST(NULL AS VARCHAR(10)) AS zyzljs,
  CAST(NULL AS VARCHAR(10)) AS bzsh,
  CAST(NULL AS VARCHAR(80)) AS wbyy,
  CAST(NULL AS VARCHAR(30)) AS jbbm1,
  CAST(NULL AS VARCHAR(80)) AS blzd,
  CAST(NULL AS VARCHAR(30)) AS jbbm2,
  CAST(NULL AS VARCHAR(30)) AS blh,
  CAST(NULL AS VARCHAR(10)) AS ywgm,
  CAST(NULL AS VARCHAR(80)) AS gmyw,
  CAST(NULL AS VARCHAR(10)) AS sj,
  CAST(NULL AS VARCHAR(10)) AS xx,
  CAST(NULL AS VARCHAR(10)) AS rh,
  CAST(NULL AS VARCHAR(20)) AS kzr,
  CAST(NULL AS VARCHAR(20)) AS zrys,
  CAST(NULL AS VARCHAR(20)) AS zzys,
  CAST(NULL AS VARCHAR(20)) AS zyys,
  CAST(NULL AS VARCHAR(20)) AS zrhs,
  CAST(NULL AS VARCHAR(20)) AS jxys,
  h11_brxx.sxys AS sxys,
  CAST(NULL AS VARCHAR(20)) AS bmy,
  CAST(NULL AS VARCHAR(10)) AS bazl,
  CAST(NULL AS VARCHAR(20)) AS zkys,
  CAST(NULL AS VARCHAR(20)) AS zkhs,
  CAST(NULL AS DATETIME) AS zkrq,
  CAST(NULL AS VARCHAR(10)) AS lyfs,
  CAST(NULL AS VARCHAR(80)) AS yzzy_jgmc,
  CAST(NULL AS VARCHAR(80)) AS wsy_jgmc,
  CAST(NULL AS VARCHAR(10)) AS zzyjh,
  CAST(NULL AS VARCHAR(60)) AS md,
  CAST(NULL AS DECIMAL(12, 0)) AS ryq_t,
  CAST(NULL AS DECIMAL(24, 0)) AS ryq_xs,
  CAST(NULL AS DECIMAL(12, 0)) AS ryq_fz,
  CAST(NULL AS DECIMAL(12, 0)) AS ryh_t,
  CAST(NULL AS DECIMAL(24, 0)) AS ryh_xs,
  CAST(NULL AS DECIMAL(12, 0)) AS ryh_fz,
  CAST(NULL AS VARCHAR(12)) AS fzr,
  CAST(NULL AS VARCHAR(12)) AS tjfzr,
  h11_brxx.lxdh AS lxdh,
  CAST(NULL AS DATETIME) AS riqi,
  CAST(0 AS INT) AS sjbz,
  CAST(NULL AS VARCHAR(4)) AS nldw,
  CAST(NULL AS VARCHAR(10)) AS bzxx,
  CAST(NULL AS VARCHAR(20)) AS bzxx1,
  CAST(NULL AS VARCHAR(80)) AS bz3,
  CAST(0 AS SMALLINT) AS tjbz,
  CAST(0 AS SMALLINT) AS drgbz,
  CAST(NULL AS DATETIME) AS jdrq,
  h11_brxx.jssj AS jssj,
  h11_brxx.mzys AS mzys,
  h11_brxx.cyksid AS cyksid,
  h11_brxx.sxys AS gcys,
  CAST(NULL AS VARCHAR(30)) AS zzdbm,
  CAST(NULL AS VARCHAR(80)) AS zzdmc,
  CAST(NULL AS VARCHAR(30)) AS ssdbm,
  CAST(NULL AS VARCHAR(80)) AS ssdmc,
  CAST(0 AS INT) AS printbz
`;

type AuditFlags = {
  missingHomepage: boolean;
  zt: number;
  tjbz: number;
  sjbz: number;
  drgbz: string;
};

@Injectable()
export class N0421AuditService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * 病案首页审核列表。对齐 PB dw_dj.retrieve(
   *   idt_cyrqs, idt_cyrqe, al, ls_ksid, zt, tjbz, sjbz, lx, lb, ls_ssdq, ls_drgbz
   * )
   * 注：PB 中 lx（东软/银海）两支 SQL 完全相同，此处不再区分。
   */
  async findAuditList(dto: AuditListQueryDto): Promise<{
    pageData: Record<string, unknown>[];
    total: number;
  }> {
    const pageNo = Math.max(1, Math.floor(Number(dto.pageNo ?? 1)) || 1);
    const pageSize = Math.min(1000, Math.max(1, Math.floor(Number(dto.pageSize ?? 100)) || 100));
    const start = this.parseDayBound(dto.startDate, false);
    const end = this.parseDayBound(dto.endDate, true);
    if (dayjs(start).isAfter(dayjs(end))) {
      throw new BadRequestException('开始日期不能晚于结束日期');
    }

    const flags = this.resolveAuditFlags(Number(dto.auditStatus ?? 4));
    const { selectSql, fromSql, orderSql, params } = flags.missingHomepage
      ? this.buildMissingHomepageQuery(dto, start, end)
      : this.buildHomepageQuery(dto, start, end, flags);

    const offset = (pageNo - 1) * pageSize;
    const [rows, countRows] = await Promise.all([
      this.dataSource.query(
        `SELECT ${selectSql}
         ${fromSql}
         ${orderSql}
         OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
        params,
      ),
      this.dataSource.query(`SELECT COUNT(1) AS total ${fromSql}`, params),
    ]);

    const countRow = (countRows?.[0] ?? {}) as Record<string, unknown>;
    const total = Number(countRow.total ?? countRow.Total ?? 0);
    return {
      pageData: (rows as Record<string, unknown>[]).map((row) => this.normalizeRow(row)),
      total,
    };
  }

  /**
   * 对齐 PB ddlb_zt → zt / tjbz / sjbz / ls_drgbz
   * 1全部 2未写首页 3未提交 4未审核 5已审核 6drg未审 7drg已审
   */
  private resolveAuditFlags(auditStatus: number): AuditFlags {
    switch (auditStatus) {
      case 1:
        return { missingHomepage: false, zt: 0, tjbz: 0, sjbz: 0, drgbz: '%' };
      case 2:
        return { missingHomepage: true, zt: 0, tjbz: 0, sjbz: 0, drgbz: '%' };
      case 3:
        return { missingHomepage: false, zt: 1, tjbz: 0, sjbz: 0, drgbz: '%' };
      case 4:
        return { missingHomepage: false, zt: 1, tjbz: 1, sjbz: 0, drgbz: '%' };
      case 5:
        return { missingHomepage: false, zt: 1, tjbz: 1, sjbz: 1, drgbz: '%' };
      case 6:
        return { missingHomepage: false, zt: 1, tjbz: 1, sjbz: 1, drgbz: '0' };
      case 7:
        return { missingHomepage: false, zt: 1, tjbz: 1, sjbz: 1, drgbz: '1' };
      default:
        return { missingHomepage: false, zt: 1, tjbz: 1, sjbz: 0, drgbz: '%' };
    }
  }

  private buildHomepageQuery(
    dto: AuditListQueryDto,
    start: string,
    end: string,
    flags: AuditFlags,
  ): { selectSql: string; fromSql: string; orderSql: string; params: unknown[] } {
    const dateType = Number(dto.dateType) === 2 ? 2 : 1;
    const ksid = !dto.ksid || dto.ksid.trim() === '0' ? '%' : dto.ksid.trim();
    const patientType = Number(dto.patientType ?? 0);
    const ssdq = dto.ssdq && dto.ssdq.trim() ? dto.ssdq.trim() : '%';

    const params: unknown[] = [];
    const addParam = (value: unknown) => {
      const holder = `@${params.length}`;
      params.push(value);
      return holder;
    };

    const where: string[] = [
      `ISNULL(h11_brxx.cyksid, '') LIKE ${addParam(ksid)}`,
      `ISNULL(CAST(N04_21.drgbz AS VARCHAR(10)), '0') LIKE ${addParam(flags.drgbz)}`,
    ];

    const startHolder = addParam(start);
    const endHolder = addParam(end);
    if (dateType === 1) {
      where.push(`N04_21.cysj >= ${startHolder} AND N04_21.cysj <= ${endHolder}`);
    } else {
      where.push(`h11_brxx.jssj >= ${startHolder} AND h11_brxx.jssj <= ${endHolder}`);
    }

    if (flags.zt === 1) {
      where.push(`ISNULL(N04_21.tjbz, 0) = ${addParam(flags.tjbz)}`);
      where.push(`ISNULL(N04_21.sjbz, 0) = ${addParam(flags.sjbz)}`);
    }

    this.appendPatientTypeWhere(where, addParam, patientType, ssdq, 'N04_21.zyid');
    this.appendKeywordWhere(where, addParam, dto, {
      zybh: 'N04_21.zybh',
      bah: 'N04_21.BAH',
      xm: 'N04_21.XM',
    });

    const fromSql = `
      FROM N04_21
      LEFT JOIN h11_brxx ON N04_21.zyid = h11_brxx.zyid AND h11_brxx.zyzt <> 5
      WHERE ${where.join(' AND ')}
    `;

    return {
      selectSql: AUDIT_LIST_SELECT,
      fromSql,
      orderSql: 'ORDER BY N04_21.cysj DESC, N04_21.zyid ASC',
      params,
    };
  }

  private buildMissingHomepageQuery(
    dto: AuditListQueryDto,
    start: string,
    end: string,
  ): { selectSql: string; fromSql: string; orderSql: string; params: unknown[] } {
    const dateType = Number(dto.dateType) === 2 ? 2 : 1;
    const ksid = !dto.ksid || dto.ksid.trim() === '0' ? '%' : dto.ksid.trim();
    const patientType = Number(dto.patientType ?? 0);
    const ssdq = dto.ssdq && dto.ssdq.trim() ? dto.ssdq.trim() : '%';

    const params: unknown[] = [];
    const addParam = (value: unknown) => {
      const holder = `@${params.length}`;
      params.push(value);
      return holder;
    };

    const where: string[] = [
      'h11_brxx.zyzt <> 5',
      'NOT EXISTS (SELECT 1 FROM N04_21 WHERE N04_21.zyid = h11_brxx.zyid)',
      `ISNULL(h11_brxx.cyksid, '') LIKE ${addParam(ksid)}`,
    ];

    const startHolder = addParam(start);
    const endHolder = addParam(end);
    if (dateType === 1) {
      where.push(`h11_brxx.cysj >= ${startHolder} AND h11_brxx.cysj <= ${endHolder}`);
    } else {
      where.push(`h11_brxx.jssj >= ${startHolder} AND h11_brxx.jssj <= ${endHolder}`);
    }

    this.appendPatientTypeWhere(where, addParam, patientType, ssdq, 'h11_brxx.zyid');
    this.appendKeywordWhere(where, addParam, dto, {
      zybh: 'h11_brxx.zybh',
      bah: 'h11_brxx.bahm',
      xm: 'h11_brxx.brxm',
    });

    const fromSql = `
      FROM h11_brxx
      WHERE ${where.join(' AND ')}
    `;

    return {
      selectSql: MISSING_HOMEPAGE_SELECT,
      fromSql,
      orderSql: 'ORDER BY h11_brxx.cysj DESC, h11_brxx.zyid ASC',
      params,
    };
  }

  /**
   * 对齐 PB lb：
   * 0 全部 / 1 自费 brlxid='0201' /
   * 2 市医保 g10_djxx.bz2 like ssdq / 3 其他医保 not like ssdq
   * PB 中 lx=1 与 lx=2 条件相同。
   */
  private appendPatientTypeWhere(
    where: string[],
    addParam: (value: unknown) => string,
    patientType: number,
    ssdq: string,
    zyidExpr: string,
  ) {
    if (patientType === 1) {
      where.push("ISNULL(h11_brxx.brlxid, '') = '0201'");
    } else if (patientType === 2) {
      where.push(
        `${zyidExpr} IN (SELECT lsh FROM g10_djxx WHERE ISNULL(bz2, '') LIKE ${addParam(ssdq)})`,
      );
    } else if (patientType === 3) {
      where.push(
        `${zyidExpr} IN (SELECT lsh FROM g10_djxx WHERE ISNULL(bz2, '') NOT LIKE ${addParam(ssdq)})`,
      );
    }
  }

  private appendKeywordWhere(
    where: string[],
    addParam: (value: unknown) => string,
    dto: AuditListQueryDto,
    fields: { zybh: string; bah: string; xm: string },
  ) {
    if (dto.mzys) {
      where.push(`h11_brxx.mzys = ${addParam(dto.mzys.trim())}`);
    }
    if (dto.zybh) {
      where.push(`${fields.zybh} LIKE ${addParam(`%${dto.zybh.trim()}%`)}`);
    }
    if (dto.bah) {
      where.push(`${fields.bah} LIKE ${addParam(`%${dto.bah.trim()}%`)}`);
    }
    if (dto.xm) {
      where.push(`${fields.xm} LIKE ${addParam(`%${dto.xm.trim()}%`)}`);
    }
  }

  private parseDayBound(value: string, endOfDay: boolean): string {
    const parsed = dayjs(value);
    if (!value || !parsed.isValid()) {
      throw new BadRequestException('日期格式不正确');
    }
    return (endOfDay ? parsed.endOf('day') : parsed.startOf('day')).format('YYYY-MM-DD HH:mm:ss');
  }

  private normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const field = key.toLowerCase();
      if (DATETIME_FIELDS.has(field)) {
        result[field] = value ? dayjs(value as string | Date).format('YYYY-MM-DD HH:mm:ss') : null;
      } else {
        result[field] = value;
      }
    }
    return result;
  }
}
