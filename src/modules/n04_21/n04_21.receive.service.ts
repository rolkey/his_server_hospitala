import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import dayjs = require('dayjs');
import { ReceiveListQueryDto, ReceiveSignDto, ReceiveUnsignDto } from './dto/receive-list.dto';

const DATETIME_FIELDS = new Set([
  'csrq',
  'rysj',
  'cysj',
  'zkrq',
  'riqi',
  'jdrq',
  'jssj',
  'czsj',
]);

const RECEIVE_LIST_SELECT = `
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
  (SELECT TOP 1 zdmc FROM N04_22 WHERE zdlx = '2' AND zyid = N04_21.zyid) AS zzdmc,
  n04_czjl.czry AS czry,
  n04_czjl.jjry AS jjry,
  n04_czjl.jsbz AS jsbz,
  n04_czjl.czsj AS czsj,
  n04_czjl.bz1 AS bz1,
  N04_21.jbbm AS mzbm,
  (SELECT TOP 1 zdbm FROM N04_22 WHERE zdlx = '2' AND zyid = N04_21.zyid) AS zzdbm,
  CAST(0 AS INT) AS szbz
`;

@Injectable()
export class N0421ReceiveService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * 病案首页接收列表。对齐 PB dw_dj.retrieve(idt_cyrqs, idt_cyrqe, al, ls_ksid, ls_drgbz)
   */
  async findReceiveList(dto: ReceiveListQueryDto): Promise<{
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

    const { fromSql, params } = this.buildFromWhere(dto, start, end);
    const offset = (pageNo - 1) * pageSize;

    const [rows, countRows] = await Promise.all([
      this.dataSource.query(
        `SELECT ${RECEIVE_LIST_SELECT}
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

  /**
   * 病案签收。对齐 PB：
   * - 已签收（jsbz=1）跳过
   * - 无 n04_czjl 记录则 INSERT
   * - jsbz=0/空则 UPDATE
   */
  async signReceive(
    dto: ReceiveSignDto,
    czry: string,
  ): Promise<{ signed: number; skipped: number }> {
    const zyids = [
      ...new Set((dto.zyids || []).map((id) => String(id ?? '').trim()).filter(Boolean)),
    ];
    const jjry = String(dto.jjry ?? '').trim();
    const operator = String(czry ?? '').trim();
    const bz1 = dto.bz1 == null ? '' : String(dto.bz1).trim();

    if (!zyids.length) {
      throw new BadRequestException('请选择要签收的病人');
    }
    if (!jjry) {
      throw new BadRequestException('请选择交接人');
    }
    if (!operator) {
      throw new BadRequestException('无法获取当前操作人');
    }

    const czsj = this.parseSignTime(dto.czsj);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let signed = 0;
      let skipped = 0;

      for (const zyid of zyids) {
        const statusRows = (await queryRunner.query(
          `SELECT COUNT(1) AS cnt, MAX(ISNULL(jsbz, 0)) AS jsbz
           FROM n04_czjl
           WHERE zyid = @0`,
          [zyid],
        )) as Record<string, unknown>[];
        const status = statusRows?.[0] ?? {};
        const count = Number(status.cnt ?? status.Cnt ?? 0);
        const jsbz = Number(status.jsbz ?? status.Jsbz ?? 0);

        if (count > 0 && jsbz === 1) {
          skipped += 1;
          continue;
        }

        if (count === 0) {
          await queryRunner.query(
            `INSERT INTO n04_czjl (zyid, xh, czry, jjry, czsj, jsbz, bz1)
             VALUES (@0, 0, @1, @2, @3, 1, @4)`,
            [zyid, operator, jjry, czsj, bz1],
          );
        } else {
          await queryRunner.query(
            `UPDATE n04_czjl
             SET czry = @0, jjry = @1, czsj = @2, jsbz = 1, bz1 = @3
             WHERE zyid = @4`,
            [operator, jjry, czsj, bz1, zyid],
          );
        }
        signed += 1;
      }

      await queryRunner.commitTransaction();
      return { signed, skipped };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 取消签收。对齐 PB：
   * - 仅 jsbz=1 时 UPDATE：czry=''、jjry=''、czsj=取消时间、jsbz=0
   * - 无记录或未签收则跳过
   */
  async unsignReceive(dto: ReceiveUnsignDto): Promise<{ unsigned: number; skipped: number }> {
    const zyids = [
      ...new Set((dto.zyids || []).map((id) => String(id ?? '').trim()).filter(Boolean)),
    ];

    if (!zyids.length) {
      throw new BadRequestException('请选择要取消签收的病人');
    }

    const czsj = this.parseSignTime(dto.czsj);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let unsigned = 0;
      let skipped = 0;

      for (const zyid of zyids) {
        const statusRows = (await queryRunner.query(
          `SELECT COUNT(1) AS cnt, MAX(ISNULL(jsbz, 0)) AS jsbz
           FROM n04_czjl
           WHERE zyid = @0`,
          [zyid],
        )) as Record<string, unknown>[];
        const status = statusRows?.[0] ?? {};
        const count = Number(status.cnt ?? status.Cnt ?? 0);
        const jsbz = Number(status.jsbz ?? status.Jsbz ?? 0);

        if (count === 0 || jsbz !== 1) {
          skipped += 1;
          continue;
        }

        await queryRunner.query(
          `UPDATE n04_czjl
           SET czry = '', jjry = '', czsj = @0, jsbz = 0
           WHERE zyid = @1`,
          [czsj, zyid],
        );
        unsigned += 1;
      }

      await queryRunner.commitTransaction();
      return { unsigned, skipped };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private parseSignTime(value?: string): string {
    if (!value) {
      return dayjs().format('YYYY-MM-DD HH:mm:ss');
    }
    const parsed = dayjs(value);
    if (!parsed.isValid()) {
      throw new BadRequestException('签收时间格式不正确');
    }
    return parsed.format('YYYY-MM-DD HH:mm:ss');
  }

  private buildFromWhere(
    dto: ReceiveListQueryDto,
    start: string,
    end: string,
  ): { fromSql: string; params: unknown[] } {
    const dateType = Number(dto.dateType) === 2 ? 2 : 1;
    const ksid = !dto.ksid || dto.ksid.trim() === '0' ? '%' : dto.ksid.trim();
    const signStatus = Number(dto.signStatus ?? 0);
    const patientType = Number(dto.patientType ?? 0);

    const params: unknown[] = [];
    const addParam = (value: unknown) => {
      const holder = `@${params.length}`;
      params.push(value);
      return holder;
    };

    const where: string[] = [`ISNULL(h11_brxx.cyksid, '') LIKE ${addParam(ksid)}`];
    const startHolder = addParam(start);
    const endHolder = addParam(end);
    if (dateType === 1) {
      where.push(`N04_21.cysj >= ${startHolder} AND N04_21.cysj <= ${endHolder}`);
    } else {
      where.push(`h11_brxx.jssj >= ${startHolder} AND h11_brxx.jssj <= ${endHolder}`);
    }

    // ls_drgbz: 0 全部 / 1 未签收 / 2 已签收（n04_czjl.jsbz = 1）
    if (signStatus === 1) {
      where.push('N04_21.zyid NOT IN (SELECT zyid FROM n04_czjl WHERE ISNULL(jsbz, 0) = 1)');
    } else if (signStatus === 2) {
      where.push('N04_21.zyid IN (SELECT zyid FROM n04_czjl WHERE ISNULL(jsbz, 0) = 1)');
    }

    // 患者类别：07 自费 / 01 市医保(城镇职工) / 其余为其他医保
    if (patientType === 1) {
      where.push("ISNULL(N04_21.YLFKFS, '') = '07'");
    } else if (patientType === 2) {
      where.push("ISNULL(N04_21.YLFKFS, '') = '01'");
    } else if (patientType === 3) {
      where.push("ISNULL(N04_21.YLFKFS, '') NOT IN ('07', '01')");
    }

    if (dto.mzys) {
      where.push(`h11_brxx.mzys = ${addParam(dto.mzys.trim())}`);
    }
    if (dto.zybh) {
      where.push(`N04_21.zybh LIKE ${addParam(`%${dto.zybh.trim()}%`)}`);
    }
    if (dto.bah) {
      where.push(`N04_21.BAH LIKE ${addParam(`%${dto.bah.trim()}%`)}`);
    }
    if (dto.xm) {
      where.push(`N04_21.XM LIKE ${addParam(`%${dto.xm.trim()}%`)}`);
    }

    const fromSql = `
      FROM N04_21
      LEFT JOIN h11_brxx ON N04_21.zyid = h11_brxx.zyid AND h11_brxx.zyzt <> 5
      OUTER APPLY (
        SELECT TOP 1 czry, jjry, jsbz, czsj, bz1
        FROM n04_czjl
        WHERE zyid = N04_21.zyid
        ORDER BY czsj DESC
      ) n04_czjl
      WHERE ${where.join(' AND ')}
    `;

    return { fromSql, params };
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
