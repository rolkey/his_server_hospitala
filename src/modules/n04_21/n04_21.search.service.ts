import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import dayjs = require('dayjs');
import { SearchFilterItemDto, SearchListQueryDto } from './dto/search-list.dto';

const DATETIME_FIELDS = new Set([
  'csrq',
  'rysj',
  'cysj',
  'zkrq',
  'riqi',
  'jdrq',
  'qzrq',
]);

const ZDMC_EXPR = `(SELECT TOP 1 N04_22.zdmc FROM N04_22 WHERE (N04_22.zdlx = '2' OR N04_22.zdlx = '1') AND N04_22.zyid = N04_21.zyid ORDER BY N04_22.zdxh ASC)`;

type FieldMeta = { expr: string; type: 'string' | 'number' | 'date' };

/** 允许过滤的字段 → SQL 表达式。key 必须与前端 fields 一致，禁止拼接用户输入的列名。 */
const FILTER_FIELDS: Record<string, FieldMeta> = {
  zybh: { expr: 'N04_21.zybh', type: 'string' },
  bah: { expr: 'N04_21.BAH', type: 'string' },
  xm: { expr: 'N04_21.XM', type: 'string' },
  xb: { expr: 'N04_21.XB', type: 'string' },
  nl: { expr: 'N04_21.NL', type: 'number' },
  zycs: { expr: 'N04_21.ZYCS', type: 'number' },
  csrq: { expr: 'N04_21.CSRQ', type: 'date' },
  csd3: { expr: 'N04_21.CSD3', type: 'string' },
  rysj: { expr: 'N04_21.RYSJ', type: 'date' },
  rykb: { expr: 'N04_21.RYKB', type: 'string' },
  cysj: { expr: 'N04_21.CYSJ', type: 'date' },
  sjzy: { expr: 'N04_21.SJZY', type: 'string' },
  zdmc: { expr: ZDMC_EXPR, type: 'string' },
  mzzd_xyzd: { expr: 'N04_21.MZZD_XYZD', type: 'string' },
  sjbz: { expr: 'N04_21.sjbz', type: 'number' },
  ylfkfs: { expr: 'N04_21.YLFKFS', type: 'string' },
  bzxx: { expr: 'N04_21.bzxx', type: 'string' },
  bzxx1: { expr: 'N04_21.bzxx1', type: 'string' },
  jkkh: { expr: 'N04_21.JKKH', type: 'string' },
  gj: { expr: 'N04_21.GJ', type: 'string' },
  xsetz: { expr: 'N04_21.XSETZ', type: 'number' },
  xserytz: { expr: 'N04_21.XSERYTZ', type: 'number' },
  csd1: { expr: 'N04_21.CSD1', type: 'string' },
  csd2: { expr: 'N04_21.CSD2', type: 'string' },
  gg1: { expr: 'N04_21.GG1', type: 'string' },
  gg2: { expr: 'N04_21.GG2', type: 'string' },
  gg3: { expr: 'N04_21.GG3', type: 'string' },
  mz: { expr: 'N04_21.MZ', type: 'string' },
  sfzh: { expr: 'N04_21.SFZH', type: 'string' },
  zy: { expr: 'N04_21.ZY', type: 'string' },
  hy: { expr: 'N04_21.HY', type: 'string' },
  xzz1: { expr: 'N04_21.XZZ1', type: 'string' },
  xzz2: { expr: 'N04_21.XZZ2', type: 'string' },
  xzz3: { expr: 'N04_21.XZZ3', type: 'string' },
  dh: { expr: 'N04_21.DH', type: 'string' },
  yb1: { expr: 'N04_21.YB1', type: 'string' },
  hkdz1: { expr: 'N04_21.HKDZ1', type: 'string' },
  hkdz2: { expr: 'N04_21.HKDZ2', type: 'string' },
  hkdz3: { expr: 'N04_21.HKDZ3', type: 'string' },
  yb2: { expr: 'N04_21.YB2', type: 'string' },
  gzdwjdz: { expr: 'N04_21.GZDWJDZ', type: 'string' },
  dwdh: { expr: 'N04_21.DWDH', type: 'string' },
  yb3: { expr: 'N04_21.YB3', type: 'string' },
  lxrxm: { expr: 'N04_21.LXRXM', type: 'string' },
  gx: { expr: 'N04_21.GX', type: 'string' },
  dz: { expr: 'N04_21.DZ', type: 'string' },
  dh1: { expr: 'N04_21.DH1', type: 'string' },
  rytj: { expr: 'N04_21.RYTJ', type: 'string' },
  zllb: { expr: 'N04_21.ZLLB', type: 'string' },
  rysj_s: { expr: 'N04_21.RYSJ_S', type: 'number' },
  rybf: { expr: 'N04_21.RYBF', type: 'string' },
  zkkb: { expr: 'N04_21.ZKKB', type: 'string' },
  cysj_s: { expr: 'N04_21.CYSJ_S', type: 'number' },
  cykb: { expr: 'N04_21.CYKB', type: 'string' },
  cybf: { expr: 'N04_21.CYBF', type: 'string' },
  mzd_zyzd: { expr: 'N04_21.MZD_ZYZD', type: 'string' },
  jbdm: { expr: 'N04_21.JBDM', type: 'string' },
  jbbm: { expr: 'N04_21.JBBM', type: 'string' },
  sslclj: { expr: 'N04_21.SSLCLJ', type: 'string' },
  zyyj: { expr: 'N04_21.ZYYJ', type: 'string' },
  zyzlsb: { expr: 'N04_21.ZYZLSB', type: 'string' },
  zyzljs: { expr: 'N04_21.ZYZLJS', type: 'string' },
  bzsh: { expr: 'N04_21.BZSH', type: 'string' },
  wbyy: { expr: 'N04_21.WBYY', type: 'string' },
  jbbm1: { expr: 'N04_21.JBBM1', type: 'string' },
  blzd: { expr: 'N04_21.BLZD', type: 'string' },
  jbbm2: { expr: 'N04_21.JBBM2', type: 'string' },
  blh: { expr: 'N04_21.BLH', type: 'string' },
  ywgm: { expr: 'N04_21.YWGM', type: 'string' },
  gmyw: { expr: 'N04_21.GMYW', type: 'string' },
  sj: { expr: 'N04_21.SJ', type: 'string' },
  xx: { expr: 'N04_21.XX', type: 'string' },
  rh: { expr: 'N04_21.RH', type: 'string' },
  kzr: { expr: 'N04_21.KZR', type: 'string' },
  zrys: { expr: 'N04_21.ZRYS', type: 'string' },
  zzys: { expr: 'N04_21.ZZYS', type: 'string' },
  zyys: { expr: 'N04_21.ZYYS', type: 'string' },
  zrhs: { expr: 'N04_21.ZRHS', type: 'string' },
  jxys: { expr: 'N04_21.JXYS', type: 'string' },
  sxys: { expr: 'N04_21.SXYS', type: 'string' },
  bmy: { expr: 'N04_21.BMY', type: 'string' },
  bazl: { expr: 'N04_21.BAZL', type: 'string' },
  zkys: { expr: 'N04_21.ZKYS', type: 'string' },
  zkhs: { expr: 'N04_21.ZKHS', type: 'string' },
  zkrq: { expr: 'N04_21.ZKRQ', type: 'date' },
  lyfs: { expr: 'N04_21.LYFS', type: 'string' },
  yzzy_jgmc: { expr: 'N04_21.YZZY_JGMC', type: 'string' },
  wsy_jgmc: { expr: 'N04_21.WSY_JGMC', type: 'string' },
  zzyjh: { expr: 'N04_21.ZZYJH', type: 'string' },
  md: { expr: 'N04_21.MD', type: 'string' },
  ryq_t: { expr: 'N04_21.RYQ_T', type: 'number' },
  ryq_xs: { expr: 'N04_21.RYQ_XS', type: 'number' },
  ryq_fz: { expr: 'N04_21.RYQ_FZ', type: 'number' },
  ryh_t: { expr: 'N04_21.RYH_T', type: 'number' },
  ryh_xs: { expr: 'N04_21.RYH_XS', type: 'number' },
  ryh_fz: { expr: 'N04_21.RYH_FZ', type: 'number' },
  fzr: { expr: 'N04_21.FZR', type: 'string' },
  tjfzr: { expr: 'N04_21.TJFZR', type: 'string' },
  lxdh: { expr: 'N04_21.LXDH', type: 'string' },
  riqi: { expr: 'N04_21.RIQI', type: 'date' },
  jdrq: { expr: 'N04_21.jdrq', type: 'date' },
  xhxb: { expr: 'N04_21.xhxb', type: 'string' },
  xxxb: { expr: 'N04_21.xxxb', type: 'string' },
  xxj: { expr: 'N04_21.xxj', type: 'string' },
  xqx: { expr: 'N04_21.xqx', type: 'string' },
  xqt: { expr: 'N04_21.xqt', type: 'string' },
  qzrq: { expr: 'N04_21.qzrq', type: 'date' },
  srqz: { expr: 'N04_21.srqz', type: 'string' },
  mzcy: { expr: 'N04_21.mzcy', type: 'string' },
  rycy: { expr: 'N04_21.rycy', type: 'string' },
  sqsh: { expr: 'N04_21.sqsh', type: 'string' },
  lcbl: { expr: 'N04_21.lcbl', type: 'string' },
  fxbl: { expr: 'N04_21.fxbl', type: 'string' },
  bajl: { expr: 'N04_21.bajl', type: 'string' },
  zrb: { expr: 'N04_21.zrb', type: 'string' },
  shss: { expr: 'N04_21.shss', type: 'string' },
  shsr: { expr: 'N04_21.shsr', type: 'string' },
  shxj: { expr: 'N04_21.shxj', type: 'string' },
  ry48: { expr: 'N04_21.ry48', type: 'string' },
  shks: { expr: 'N04_21.shks', type: 'string' },
  zczy: { expr: 'N04_21.zczy', type: 'string' },
  cyfs: { expr: 'N04_21.cyfs', type: 'string' },
  blfx: { expr: 'N04_21.blfx', type: 'string' },
  szbz: { expr: 'N04_21.szbz', type: 'number' },
  sscs: { expr: 'N04_21.sscs', type: 'string' },
  sscg: { expr: 'N04_21.sscg', type: 'string' },
  bz1: { expr: 'N04_21.bz1', type: 'string' },
  bz2: { expr: 'N04_21.bz2', type: 'string' },
  bz3: { expr: 'N04_21.bz3', type: 'string' },
  bz4: { expr: 'N04_21.bz4', type: 'string' },
  bz5: { expr: 'N04_21.bz5', type: 'string' },
  nldw: { expr: 'N04_21.nldw', type: 'string' },
};

/** 对齐用户提供的 N04_21 列表 SQL，并附加出院诊断 zdmc */
const SEARCH_LIST_SELECT = `
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
  N04_21.jdrq AS jdrq,
  N04_21.xhxb AS xhxb,
  N04_21.xxxb AS xxxb,
  N04_21.xxj AS xxj,
  N04_21.xqx AS xqx,
  N04_21.xqt AS xqt,
  N04_21.qzrq AS qzrq,
  N04_21.srqz AS srqz,
  N04_21.mzcy AS mzcy,
  N04_21.rycy AS rycy,
  N04_21.sqsh AS sqsh,
  N04_21.lcbl AS lcbl,
  N04_21.fxbl AS fxbl,
  N04_21.bajl AS bajl,
  N04_21.zrb AS zrb,
  N04_21.shss AS shss,
  N04_21.shsr AS shsr,
  N04_21.shxj AS shxj,
  N04_21.ry48 AS ry48,
  N04_21.shks AS shks,
  N04_21.zczy AS zczy,
  N04_21.cyfs AS cyfs,
  N04_21.blfx AS blfx,
  N04_21.bz1 AS bz1,
  N04_21.szbz AS szbz,
  N04_21.sscs AS sscs,
  N04_21.sscg AS sscg,
  N04_21.bz2 AS bz2,
  N04_21.bz3 AS bz3,
  N04_21.bz4 AS bz4,
  N04_21.bz5 AS bz5,
  ${ZDMC_EXPR} AS zdmc
`;

@Injectable()
export class N0421SearchService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findSearchList(dto: SearchListQueryDto): Promise<{
    pageData: Record<string, unknown>[];
    total: number;
  }> {
    const pageNo = Math.max(1, Math.floor(Number(dto.pageNo ?? 1)) || 1);
    const pageSize = Math.min(1000, Math.max(1, Math.floor(Number(dto.pageSize ?? 100)) || 100));

    const params: unknown[] = [];
    const addParam = (value: unknown) => {
      const holder = `@${params.length}`;
      params.push(value);
      return holder;
    };

    const where = this.buildWhere(dto.filters || [], addParam);
    const fromSql = `
      FROM N04_21
      WHERE ${where.length ? where.join(' AND ') : '1 = 1'}
    `;
    const offset = (pageNo - 1) * pageSize;

    const [rows, countRows] = await Promise.all([
      this.dataSource.query(
        `SELECT ${SEARCH_LIST_SELECT}
         ${fromSql}
         ORDER BY N04_21.cysj DESC, N04_21.zyid ASC
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

  private buildWhere(
    filters: SearchFilterItemDto[],
    addParam: (value: unknown) => string,
  ): string[] {
    const where: string[] = [];
    for (const item of filters || []) {
      const clause = this.buildFilterClause(item, addParam);
      if (clause) where.push(clause);
    }
    return where;
  }

  private buildFilterClause(
    item: SearchFilterItemDto,
    addParam: (value: unknown) => string,
  ): string | null {
    const fieldKey = String(item?.field || '').trim().toLowerCase();
    const meta = FILTER_FIELDS[fieldKey];
    if (!meta) {
      throw new BadRequestException(`不支持的过滤字段: ${item?.field || ''}`);
    }

    const op = item.op;
    const expr = meta.expr;

    if (op === 'empty') {
      return `(${expr} IS NULL OR RTRIM(CAST(${expr} AS VARCHAR(8000))) = '')`;
    }
    if (op === 'notEmpty') {
      return `(${expr} IS NOT NULL AND RTRIM(CAST(${expr} AS VARCHAR(8000))) <> '')`;
    }

    if (op === 'between') {
      const start = this.normalizeValue(item.value, meta.type, false);
      const end = this.normalizeValue(item.value2, meta.type, true);
      if (start === null || end === null) return null;
      return `${expr} >= ${addParam(start)} AND ${expr} <= ${addParam(end)}`;
    }

    const value = this.normalizeValue(item.value, meta.type, op === 'lte');
    if (value === null || value === '') return null;

    switch (op) {
      case 'eq':
        if (meta.type === 'date') {
          const start = this.normalizeValue(item.value, 'date', false);
          const end = this.normalizeValue(item.value, 'date', true);
          if (start === null || end === null) return null;
          return `${expr} >= ${addParam(start)} AND ${expr} <= ${addParam(end)}`;
        }
        return `${expr} = ${addParam(value)}`;
      case 'ne':
        return `(${expr} <> ${addParam(value)} OR ${expr} IS NULL)`;
      case 'like':
        return `CAST(${expr} AS VARCHAR(8000)) LIKE ${addParam(`%${this.escapeLike(String(value))}%`)}`;
      case 'gt':
        return `${expr} > ${addParam(meta.type === 'date' ? this.normalizeValue(item.value, 'date', true) : value)}`;
      case 'gte':
        return `${expr} >= ${addParam(value)}`;
      case 'lt':
        return `${expr} < ${addParam(meta.type === 'date' ? this.normalizeValue(item.value, 'date', false) : value)}`;
      case 'lte':
        return `${expr} <= ${addParam(value)}`;
      default:
        throw new BadRequestException(`不支持的操作符: ${op}`);
    }
  }

  private normalizeValue(
    raw: string | number | null | undefined,
    type: FieldMeta['type'],
    endOfDay: boolean,
  ): string | number | null {
    if (raw === null || raw === undefined || raw === '') return null;
    if (type === 'date') {
      const parsed = dayjs(String(raw));
      if (!parsed.isValid()) {
        throw new BadRequestException('日期格式不正确');
      }
      return (endOfDay ? parsed.endOf('day') : parsed.startOf('day')).format('YYYY-MM-DD HH:mm:ss');
    }
    if (type === 'number') {
      const num = Number(raw);
      if (Number.isNaN(num)) {
        throw new BadRequestException('数值格式不正确');
      }
      return num;
    }
    return String(raw).trim();
  }

  private escapeLike(value: string): string {
    return value.replace(/[[\]%_]/g, (ch) => `[${ch}]`);
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
