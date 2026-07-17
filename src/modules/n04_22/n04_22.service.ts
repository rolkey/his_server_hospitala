import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { N0422 } from './n04_22.entity';
import { PatientCaseLockService } from '../n04_21/patient-case-lock.service';

type IcdLookupRow = {
  bzmc?: string;
  ybbm?: string;
  ybmc?: string;
};

function pickFirstNonEmpty(...values: (string | null | undefined)[]): string {
  for (const value of values) {
    const trimmed = String(value ?? '').trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return '';
}

@Injectable()
export class N0422Service {
  constructor(
    @InjectRepository(N0422)
    private readonly n0422Repository: Repository<N0422>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly patientCaseLockService: PatientCaseLockService,
  ) {}

  // 创建记录 - Controller中 @Post() 使用
  async create(n0422: Partial<N0422>): Promise<N0422> {
    const newN0422 = this.n0422Repository.create(n0422);
    return await this.n0422Repository.save(newN0422);
  }

  // 根据条件查询 - Controller中 @Get() 使用
  async findByCondition(
    condition: Partial<N0422>,
    options?: { seedInitial?: boolean },
  ): Promise<N0422[]> {
    const rows = await this.n0422Repository.find({
      where: condition,
      order: { zdxh: 'ASC' },
    });

    if (
      options?.seedInitial &&
      rows.length === 0 &&
      condition.zyid &&
      this.isZyidOnlyQuery(condition)
    ) {
      return this.buildInitialDiagnosisFromBrxx(condition.zyid);
    }

    return rows;
  }

  /** 对齐 PB dw_yszd.retrieve：N04_22 无数据时从 h11_brxx 带出初始诊断（仅返回，不落库） */
  private async buildInitialDiagnosisFromBrxx(zyid: string): Promise<N0422[]> {
    const brxxRows: { cyzd?: string; cyzd4?: string; cyzd5?: string }[] =
      await this.dataSource.query(
        `
        SELECT
          ISNULL(cyzd, '') AS cyzd,
          ISNULL(cyzd4, '') AS cyzd4,
          ISNULL(cyzd5, '') AS cyzd5
        FROM dbo.h11_brxx
        WHERE zyid = @0
        `,
        [zyid],
      );

    const brxx = brxxRows?.[0];
    if (!brxx) {
      return [];
    }

    const result: Partial<N0422>[] = [];

    const appendRow = async (code: string | undefined | null, zdlx: string) => {
      const bzbm = String(code ?? '').trim();
      if (!bzbm) {
        return;
      }
      if (result.some((row) => String(row.icd10 ?? row.zdbm ?? '').trim() === bzbm)) {
        return;
      }

      const icd = await this.lookupIcdByBzbm(bzbm);
      // 对齐 PB：zwmc 取 bzmc，无则取 cyzd(bzbm)；zdbm/zdmc 仅取字典 ybbm/ybmc（ISNULL 回退 icd10/zwmc），无字典或无值则留空
      const zwmc = pickFirstNonEmpty(icd?.bzmc) || bzbm;
      const zdbm = icd?.ybbm ?? '';
      const zdmc = icd?.ybmc ?? '';

      result.push({
        zyid,
        zdxh: result.length,
        zdlx,
        zdbm: zdbm || null,
        zdmc: zdmc || null,
        icd10: bzbm,
        zwmc,
        zdbq: '1',
        adm_dise_cond_code: '3',
        bzxx1: '1',
        vali_flag: '1',
        ipt_patn_disediag: '12',
        high_diag_evid: '1',
        bkup_deg_code: '9',
      });
    };

    await appendRow(brxx.cyzd, '2');
    if (result.length === 1) {
      result[0].maindiag_flag = '1';
    }
    await appendRow(brxx.cyzd4, '4');
    await appendRow(brxx.cyzd5, '1');

    return result as N0422[];
  }

  private async lookupIcdByBzbm(bzbm: string): Promise<IcdLookupRow | null> {
    const rows: IcdLookupRow[] = await this.dataSource.query(
      `
      SELECT TOP 1
        ISNULL(bzmc, '') AS bzmc,
        ISNULL(ybbm, icd10) AS ybbm,
        ISNULL(ybmc, zwmc) AS ybmc
      FROM dbo.__jbbmicd10
      WHERE bzbm = @0
      `,
      [bzbm],
    );
    return rows?.[0] ?? null;
  }

  private isZyidOnlyQuery(condition: Partial<N0422>): boolean {
    return Object.entries(condition).every(([key, value]) => {
      if (key === 'zyid') {
        return value !== undefined && value !== null && String(value).trim() !== '';
      }
      return value === undefined || value === null || value === '';
    });
  }

  // 更新记录 - Controller中 @Put() 使用
  async update(n0422: Partial<N0422>): Promise<N0422> {
    const { zyid, zdxh, ...n0422Update } = n0422;
    await this.n0422Repository.update({ zyid, zdxh }, n0422Update);
    return await this.n0422Repository.findOne({
      where: { zyid, zdxh },
    });
  }

  // 删除记录 - Controller中 @Delete() 使用
  async remove(zyid: string, zdxh: number): Promise<void> {
    await this.n0422Repository.delete({ zyid, zdxh });
  }

  async save(zyid: string, n0422s: Partial<N0422>[]): Promise<void> {
    // 诊断行若显式带 sjbz，视为工作流写状态，放行；否则已归档则拒绝
    const hasSjbz =
      Array.isArray(n0422s) && n0422s.some((row) => row && row.sjbz !== undefined);
    await this.patientCaseLockService.assertNotArchived(zyid, {
      allowWorkflowWrite: hasSjbz,
    });
    await this.n0422Repository.delete({ zyid });
    for (const [index, n0422] of n0422s.entries()) {
      n0422.zyid = zyid;
      n0422.zdxh = index;
    }
    await this.n0422Repository.insert(n0422s);
  }
}