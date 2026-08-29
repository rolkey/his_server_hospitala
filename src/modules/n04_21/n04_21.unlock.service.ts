import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import dayjs = require('dayjs');
import { UnlockFormQueryDto, UnlockSaveDto } from './dto/unlock.dto';
import { UnlockListQueryDto } from './dto/unlock-list.dto';

const DEFAULT_BLLX = '首页';
const DEFAULT_BLBH = '01';
const DEFAULT_BLMC = '病案首页';

const DISCHARGE_DATETIME_FIELDS = new Set(['csrq', 'rysj', 'cysj', 'jssj']);
const UNLOCK_RECORD_DATETIME_FIELDS = new Set(['czsj', 'yxsj', 'sj1', 'sj2']);

/** 对齐 PB dw_cybr：出院病人列表 */
const DISCHARGE_LIST_SELECT = `
  h11_brxx.zyid AS zyid,
  h11_brxx.zybh AS zybh,
  h11_brxx.bahm AS bah,
  h11_brxx.bahm AS bahm,
  h11_brxx.zycs AS zycs,
  h11_brxx.brxm AS xm,
  h11_brxx.brxm AS brxm,
  h11_brxx.xbid AS xbid,
  h11_brxx.brnl AS brnl,
  h11_brxx.csrq AS csrq,
  h11_brxx.hkdz AS hkdz,
  h11_brxx.rysj AS rysj,
  h11_brxx.cyksid AS cyksid,
  h11_brxx.cyksmc AS cyksmc,
  h11_brxx.cysj AS cysj,
  h11_brxx.yebz AS yebz,
  h11_brxx.jssj AS jssj,
  h11_brxx.zyzt AS zyzt,
  h11_brxx.mzys AS mzys,
  h11_brxx.brlxid AS brlxid,
  h00_brlx.brlxmc AS brlxmc,
  h11_brxx.sxys AS gcys,
  h11_brxx.lxdh AS lxdh,
  h11_brxx.sfzh AS sfzh
`;

/** 对齐 PB dw_2：解锁记录列表 */
const UNLOCK_RECORD_LIST_SELECT = `
  h12_bljs.jsxh AS jsxh,
  h12_bljs.zyid AS zyid,
  h12_bljs.bllx AS bllx,
  h12_bljs.blbh AS blbh,
  h12_bljs.blmc AS blmc,
  h12_bljs.czsj AS czsj,
  h12_bljs.czry AS czry,
  h12_bljs.yxsj AS yxsj,
  h12_bljs.sm AS sm,
  h12_bljs.sj1 AS sj1,
  h12_bljs.sj2 AS sj2,
  h12_bljs.bzxx AS bzxx,
  h12_bljs.bz1 AS bz1,
  h12_bljs.bz2 AS bz2,
  h12_bljs.bz3 AS bz3,
  h12_bljs.bz4 AS bz4,
  h12_bljs.bz5 AS bz5
`;

@Injectable()
export class N0421UnlockService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * 出院病人列表。对齐 PB dw_cybr.Retrieve，条件按出院日期等拼接到 h11_brxx。
   */
  async findDischargeList(dto: UnlockListQueryDto): Promise<{
    pageData: Record<string, unknown>[];
    total: number;
  }> {
    if (!dto.startDate || !dto.endDate) {
      throw new BadRequestException('起始时间和结束时间不能为空');
    }
    const { pageNo, pageSize, fromSql, params } = this.buildUnlockListQuery(dto);
    const offset = (pageNo - 1) * pageSize;
    const fromClause = `FROM h11_brxx LEFT JOIN h00_brlx ON h00_brlx.brlxid = h11_brxx.brlxid ${fromSql}`;

    const [rows, countRows] = await Promise.all([
      this.dataSource.query(
        `SELECT ${DISCHARGE_LIST_SELECT}
         ${fromClause}
         ORDER BY h11_brxx.cysj DESC, h11_brxx.zyid ASC
         OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
        params,
      ),
      this.dataSource.query(`SELECT COUNT(1) AS total ${fromClause}`, params),
    ]);

    return {
      pageData: (rows as Record<string, unknown>[]).map((row) =>
        this.normalizeRow(row, DISCHARGE_DATETIME_FIELDS),
      ),
      total: this.readTotal(countRows),
    };
  }

  /**
   * 解锁记录列表。对齐 PB dw_2：h12_bljs INNER JOIN h11_brxx。
   * 传入 zyid 时只查该病人全部解锁记录。
   */
  async findUnlockRecordList(dto: UnlockListQueryDto): Promise<{
    pageData: Record<string, unknown>[];
    total: number;
  }> {
    const zyid = String(dto.zyid ?? '').trim();
    if (zyid) {
      return this.findUnlockRecordsByZyid(zyid, dto);
    }
    if (!dto.startDate || !dto.endDate) {
      throw new BadRequestException('起始时间和结束时间不能为空');
    }

    const { pageNo, pageSize, fromSql, params } = this.buildUnlockListQuery(dto);
    const offset = (pageNo - 1) * pageSize;
    const fromClause = `FROM h12_bljs INNER JOIN h11_brxx ON h12_bljs.zyid = h11_brxx.zyid ${fromSql}`;

    const [rows, countRows] = await Promise.all([
      this.dataSource.query(
        `SELECT ${UNLOCK_RECORD_LIST_SELECT}
         ${fromClause}
         ORDER BY h12_bljs.czsj DESC, h12_bljs.jsxh DESC
         OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
        params,
      ),
      this.dataSource.query(`SELECT COUNT(1) AS total ${fromClause}`, params),
    ]);

    return {
      pageData: (rows as Record<string, unknown>[]).map((row) =>
        this.normalizeRow(row, UNLOCK_RECORD_DATETIME_FIELDS),
      ),
      total: this.readTotal(countRows),
    };
  }

  private async findUnlockRecordsByZyid(
    zyid: string,
    dto: UnlockListQueryDto,
  ): Promise<{ pageData: Record<string, unknown>[]; total: number }> {
    const pageNo = Math.max(1, Math.floor(Number(dto.pageNo ?? 1)) || 1);
    const pageSize = Math.min(1000, Math.max(1, Math.floor(Number(dto.pageSize ?? 100)) || 100));
    const offset = (pageNo - 1) * pageSize;
    const fromClause = `FROM h12_bljs WHERE h12_bljs.zyid = @0`;
    const params = [zyid];

    const [rows, countRows] = await Promise.all([
      this.dataSource.query(
        `SELECT ${UNLOCK_RECORD_LIST_SELECT}
         ${fromClause}
         ORDER BY h12_bljs.czsj DESC, h12_bljs.jsxh DESC
         OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
        params,
      ),
      this.dataSource.query(`SELECT COUNT(1) AS total ${fromClause}`, params),
    ]);

    return {
      pageData: (rows as Record<string, unknown>[]).map((row) =>
        this.normalizeRow(row, UNLOCK_RECORD_DATETIME_FIELDS),
      ),
      total: this.readTotal(countRows),
    };
  }

  /**
   * 解锁表单预填。对齐 PB openwithparm(w_basy_edit)：
   * 从当前病人生成新解锁行（jsxh 为空则不查旧记录），默认病历类型=首页。
   */
  async getUnlockForm(dto: UnlockFormQueryDto) {
    const zyid = String(dto.zyid || '').trim();
    if (!zyid) {
      throw new BadRequestException('住院ID不能为空');
    }

    const patient = await this.findPatient(zyid);
    const jsxh = await this.peekNextJsxh();
    const now = dayjs();

    return {
      jsxh: String(jsxh),
      zyid: patient.zyid,
      bllx: DEFAULT_BLLX,
      blbh: DEFAULT_BLBH,
      blmc: DEFAULT_BLMC,
      bz1: patient.xm,
      bz2: patient.bah,
      yxsj: now.add(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      sm: '',
      czsj: now.format('YYYY-MM-DD HH:mm:ss'),
      czry: '',
      yxbz: 0,
      yxbzText: '未生成',
    };
  }

  /**
   * 保存解锁。对齐 PB：校验证号/姓名，setitem yxbz=1 后 Update 写入 h12_bljs。
   */
  async saveUnlock(dto: UnlockSaveDto, operatorId = '') {
    const zyid = String(dto.zyid || '').trim();
    const operator = String(operatorId || dto.czry || '').trim();
    const sm = String(dto.sm ?? '').trim();

    if (!zyid) {
      throw new BadRequestException('请输入证号!');
    }
    if (!operator) {
      throw new BadRequestException('无法获取当前操作人');
    }

    const patient = await this.findPatient(zyid);
    const name = String(patient.xm || '').trim();
    if (!name) {
      throw new BadRequestException('请输入姓名!');
    }

    const yxsj = this.parseDateTime(dto.yxsj, '解锁期限格式不正确');
    const czsj = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isIdentity = await this.isJsxhIdentity(queryRunner);
      const params = [
        zyid.slice(0, 12),
        DEFAULT_BLLX,
        DEFAULT_BLBH,
        DEFAULT_BLMC,
        czsj,
        operator.slice(0, 10),
        yxsj,
        sm.slice(0, 200),
        name.slice(0, 30),
        String(patient.bah || '').trim().slice(0, 20),
      ];

      let jsxh = '';
      if (isIdentity) {
        const inserted = (await queryRunner.query(
          `INSERT INTO dbo.h12_bljs (
             zyid, bllx, blbh, blmc, czsj, czry, yxsj, sm, bz1, bz2, yxbz
           )
           OUTPUT INSERTED.jsxh
           VALUES (@0, @1, @2, @3, @4, @5, @6, @7, @8, @9, 1)`,
          params,
        )) as Record<string, unknown>[];
        jsxh = String(inserted?.[0]?.jsxh ?? inserted?.[0]?.JSXH ?? '').trim();
      } else {
        jsxh = String(await this.nextJsxh(queryRunner));
        await queryRunner.query(
          `INSERT INTO dbo.h12_bljs (
             jsxh, zyid, bllx, blbh, blmc, czsj, czry, yxsj, sm, bz1, bz2, yxbz
           ) VALUES (@0, @1, @2, @3, @4, @5, @6, @7, @8, @9, @10, 1)`,
          [jsxh, ...params],
        );
      }

      await queryRunner.commitTransaction();
      return {
        jsxh,
        zyid,
        yxsj,
        yxbz: 1,
        message: '数据保存成功！',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async findPatient(zyid: string): Promise<{
    zyid: string;
    xm: string;
    bah: string;
    zybh: string;
  }> {
    const rows = (await this.dataSource.query(
      `SELECT TOP 1 zyid, XM AS xm, BAH AS bah, zybh
       FROM dbo.N04_21
       WHERE zyid = @0`,
      [zyid],
    )) as Record<string, unknown>[];
    const row = rows?.[0];
    if (!row) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案首页不存在`);
    }
    return {
      zyid: String(row.zyid ?? '').trim(),
      xm: String(row.xm ?? row.XM ?? '').trim(),
      bah: String(row.bah ?? row.BAH ?? '').trim(),
      zybh: String(row.zybh ?? '').trim(),
    };
  }

  /** SQL Server 2008 无 TRY_CONVERT，用纯数字串转 INT 取最大序号 */
  private static readonly NEXT_JSXH_SQL = `
    SELECT ISNULL(MAX(
      CASE
        WHEN jsxh IS NULL THEN NULL
        WHEN LTRIM(RTRIM(CAST(jsxh AS VARCHAR(30)))) = '' THEN NULL
        WHEN LTRIM(RTRIM(CAST(jsxh AS VARCHAR(30)))) LIKE '%[^0-9]%' THEN NULL
        ELSE CONVERT(INT, LTRIM(RTRIM(CAST(jsxh AS VARCHAR(30)))))
      END
    ), 0) + 1 AS nextXh
  `;

  private async peekNextJsxh(): Promise<number> {
    const rows = (await this.dataSource.query(
      `${N0421UnlockService.NEXT_JSXH_SQL} FROM dbo.h12_bljs`,
    )) as Record<string, unknown>[];
    return Number(rows?.[0]?.nextXh ?? rows?.[0]?.nextxh ?? 1) || 1;
  }

  private async nextJsxh(queryRunner: QueryRunner): Promise<number> {
    const rows = (await queryRunner.query(
      `${N0421UnlockService.NEXT_JSXH_SQL} FROM dbo.h12_bljs WITH (UPDLOCK, HOLDLOCK)`,
    )) as Record<string, unknown>[];
    return Number(rows?.[0]?.nextXh ?? rows?.[0]?.nextxh ?? 1) || 1;
  }

  private async isJsxhIdentity(queryRunner: QueryRunner): Promise<boolean> {
    const rows = (await queryRunner.query(
      `SELECT COLUMNPROPERTY(OBJECT_ID('dbo.h12_bljs'), 'jsxh', 'IsIdentity') AS is_identity`,
    )) as Record<string, unknown>[];
    return Number(rows?.[0]?.is_identity ?? rows?.[0]?.is_Identity ?? 0) === 1;
  }

  private parseDateTime(value: string, errorMessage: string): string {
    const parsed = dayjs(value);
    if (!value || !parsed.isValid()) {
      throw new BadRequestException(errorMessage);
    }
    return parsed.format('YYYY-MM-DD HH:mm:ss');
  }

  private buildUnlockListQuery(dto: UnlockListQueryDto): {
    pageNo: number;
    pageSize: number;
    fromSql: string;
    params: unknown[];
  } {
    const pageNo = Math.max(1, Math.floor(Number(dto.pageNo ?? 1)) || 1);
    const pageSize = Math.min(1000, Math.max(1, Math.floor(Number(dto.pageSize ?? 100)) || 100));
    const start = this.parseDayBound(dto.startDate, false);
    const end = this.parseDayBound(dto.endDate, true);
    if (dayjs(start).isAfter(dayjs(end))) {
      throw new BadRequestException('开始日期不能晚于结束日期');
    }

    const params: unknown[] = [];
    const addParam = (value: unknown) => {
      const holder = `@${params.length}`;
      params.push(value);
      return holder;
    };

    const where: string[] = [
      `h11_brxx.cysj >= ${addParam(start)}`,
      `h11_brxx.cysj <= ${addParam(end)}`,
    ];

    const brlxid = String(dto.brlxid ?? '').trim();
    if (brlxid) {
      where.push(`ISNULL(h11_brxx.brlxid, '') LIKE ${addParam(`%${brlxid}%`)}`);
    }

    const xm = String(dto.xm ?? '').trim();
    if (xm) {
      where.push(`h11_brxx.brxm LIKE ${addParam(`%${xm}%`)}`);
    }

    const zybh = String(dto.zybh ?? '').trim();
    if (zybh) {
      where.push(`ISNULL(h11_brxx.zybh, '') LIKE ${addParam(`%${zybh}%`)}`);
    }

    const ksid = !dto.ksid || dto.ksid.trim() === '0' ? '' : dto.ksid.trim();
    if (ksid) {
      where.push(`ISNULL(h11_brxx.cyksid, '') LIKE ${addParam(`%${ksid}%`)}`);
    }

    const dhhm = String(dto.dhhm ?? '').trim();
    if (dhhm) {
      where.push(`h11_brxx.lxdh = ${addParam(dhhm)}`);
    }

    const sfzh = String(dto.sfzh ?? '').trim();
    if (sfzh) {
      where.push(`h11_brxx.sfzh = ${addParam(sfzh)}`);
    }

    return {
      pageNo,
      pageSize,
      fromSql: `WHERE ${where.join(' AND ')}`,
      params,
    };
  }

  private parseDayBound(value: string, endOfDay: boolean): string {
    const parsed = dayjs(value);
    if (!value || !parsed.isValid()) {
      throw new BadRequestException('日期格式不正确');
    }
    return (endOfDay ? parsed.endOf('day') : parsed.startOf('day')).format('YYYY-MM-DD HH:mm:ss');
  }

  private readTotal(countRows: Record<string, unknown>[]): number {
    const countRow = countRows?.[0] ?? {};
    return Number(countRow.total ?? countRow.Total ?? 0);
  }

  private normalizeRow(
    row: Record<string, unknown>,
    datetimeFields: Set<string>,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const field = key.toLowerCase();
      if (datetimeFields.has(field)) {
        result[field] = value ? dayjs(value as string | Date).format('YYYY-MM-DD HH:mm:ss') : null;
      } else {
        result[field] = value;
      }
    }
    return result;
  }
}
