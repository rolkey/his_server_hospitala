import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ParamService } from '@/modules/h12_xmzd/service/param.service';
import { N0421 } from './n04_21.entity';
import { N0421Service } from './n04_21.service';
import { N0422 } from '../n04_22/n04_22.entity';
import { N04_23 } from '../n04-23/n04-23.entity';
import { N0424 } from '../n04_24/n04_24.entity';
import { N0425 } from '../n04_25/n04_25.entity';
import { PatientCaseWorkflowDto, WorkflowActionCode } from './dto/workflow.dto';

const HY_ALLOWED = new Set(['1', '2', '3', '4', '5', '9']);

/** 费用/婴儿/诊断/手术模块：归档(2)与提交(1)均写 1 */
function resolveModuleSjbz(action: WorkflowActionCode): number {
  if (action === 2) return 1;
  if (action === 0 || action === 9) return 0;
  return action;
}

function isBlank(value: unknown): boolean {
  return value == null || String(value).trim() === '';
}

function toNumberOrNaN(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value == null || value === '') return Number.NaN;
  return Number(value);
}

function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

@Injectable()
export class N0421WorkflowService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(N0421)
    private readonly n0421Repository: Repository<N0421>,
    @InjectRepository(N0422)
    private readonly n0422Repository: Repository<N0422>,
    private readonly n0421Service: N0421Service,
    private readonly paramService: ParamService,
  ) {}

  /**
   * 病案首页工作流（对齐 PB wf_gd / wf_qxgd）
   * 一次请求完成：业务数据保存 + 状态机 +（归档时）NQ 表同步，全部在同一事务内。
   */
  async runWorkflow(dto: PatientCaseWorkflowDto) {
    const zyid = String(dto.zyid || '').trim();
    const action = Number(dto.action) as WorkflowActionCode;

    if (!zyid) {
      throw new BadRequestException('住院ID不能为空');
    }
    if (![0, 1, 2, 9].includes(action)) {
      throw new BadRequestException('无效的操作码');
    }

    const existingBasic = await this.n0421Repository.findOne({ where: { zyid } });
    if (!existingBasic && !dto.basic) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案首页不存在`);
    }

    if (action === 2) {
      const sygd = await this.paramService.gfGetPara(50, 'sygd', '0', '允许首页医生归档');
      if (String(sygd).trim() !== '1') {
        throw new BadRequestException('系统未开启首页医生归档（sygd≠1）');
      }
    }

    if (action === 9 && Number(existingBasic?.sjbz) === 1) {
      throw new ConflictException('病案室该患者已存档，不能取消，请联系病案室！');
    }

    // 取消提交/取消归档：已办出院超过录入时限且无解锁记录时禁止（对齐 PB uf_vidify_sj）
    if (action === 0 || action === 9) {
      await this.assertWithinEntryWindow(zyid);
    }

    // 提交/归档/取消提交：基本信息校验（PB uf_gd 对 action=9 同样走 uf_vidify_gd）
    // 优先用请求体校验；未传则回退查库
    if (action === 1 || action === 2 || action === 9) {
      const basicForValidate = {
        ...(existingBasic || {}),
        ...(dto.basic || {}),
      } as N0421;
      this.validateBasicForArchive(basicForValidate);
    }

    // 诊断校验仅提交/归档需要（PB zdxx.uf_gd 对 0/9 直接重置 sjbz 不校验）
    if (action === 1 || action === 2) {
      if (dto.diagnosis !== undefined) {
        this.validateDiagnosisRows(dto.diagnosis);
      } else {
        await this.validateDiagnosisForArchive(zyid);
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();
      const moduleSjbz = resolveModuleSjbz(action);
      const manager = queryRunner.manager;

      // 先在事务内保存业务数据，再写状态（PB：wf_gd/wf_qxgd 均以 wf_save_patient 落库）
      if (dto.basic || dto.diagnosis || dto.surgery || dto.fee || dto.newborn) {
        await this.saveBusinessPayload(manager, zyid, dto);
      }

      const basic =
        (await manager.getRepository(N0421).findOne({ where: { zyid } })) ||
        existingBasic;
      if (!basic) {
        throw new NotFoundException(`住院ID ${zyid} 对应的病案首页不存在`);
      }

      await this.applyBasicWorkflow(manager.getRepository(N0421), basic, action, now);

      await manager
        .getRepository(N0422)
        .createQueryBuilder()
        .update(N0422)
        .set({ sjbz: moduleSjbz })
        .where('zyid = :zyid', { zyid })
        .execute();
      await manager
        .getRepository(N04_23)
        .createQueryBuilder()
        .update(N04_23)
        .set({ sjbz: moduleSjbz })
        .where('zyid = :zyid', { zyid })
        .execute();
      await manager
        .getRepository(N0424)
        .createQueryBuilder()
        .update(N0424)
        .set({ sjbz: moduleSjbz })
        .where('zyid = :zyid', { zyid })
        .execute();

      if (action !== 9) {
        await manager
          .getRepository(N0425)
          .createQueryBuilder()
          .update(N0425)
          .set({ sjbz: moduleSjbz })
          .where('zyid = :zyid', { zyid })
          .execute();
      }

      if (action === 2) {
        try {
          await this.syncArchiveTables(queryRunner, zyid);
        } catch (error) {
          const raw = error instanceof Error ? error.message : String(error);
          if (/truncated|String or binary data/i.test(raw)) {
            throw new BadRequestException(
              '归档生成失败：诊断/手术字段超出归档表长度，请检查诊断名称、编码等字段后重试',
            );
          }
          throw error;
        }
      }

      await queryRunner.commitTransaction();

      return {
        zyid,
        action,
        message: this.getSuccessMessage(action),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 对齐 PB vu_basy_jbxx.uf_vidify_sj：
   * 已办出院（h11_brxx.zyzt>2）的病历，出院后超过参数 sysj（小时）即锁定首页录入，
   * 除非 h12_bljs 存在未过期的“首页”解锁记录。
   * 取消提交/取消归档会重新放开编辑，故在此拦截，防止超时后绕过锁定。
   */
  private async assertWithinEntryWindow(zyid: string) {
    const rows: { cysj?: Date | string | null; zyzt?: number | null }[] =
      await this.dataSource.query(
        `SELECT cysj, zyzt FROM dbo.h11_brxx WHERE zyid = @0`,
        [zyid],
      );
    const brxx = rows?.[0];
    if (!brxx) return;

    const zyzt = Number(brxx.zyzt ?? 0);
    const cysj = brxx.cysj ? new Date(brxx.cysj) : null;
    if (zyzt <= 2 || !cysj || Number.isNaN(cysj.getTime())) return;

    const now = new Date();

    // 有效期内的解锁记录直接放行
    const unlockRows: { yxsj?: Date | string | null }[] = await this.dataSource.query(
      `SELECT MAX(yxsj) AS yxsj FROM dbo.h12_bljs WHERE zyid = @0 AND bllx = N'首页'`,
      [zyid],
    );
    const yxsj = unlockRows?.[0]?.yxsj ? new Date(unlockRows[0].yxsj) : null;
    if (yxsj && !Number.isNaN(yxsj.getTime()) && yxsj > now) return;

    const sysjHours = Number(
      await this.paramService.gfGetPara(50, 'sysj', '24', '出院时间限制首页修改'),
    );
    if (!Number.isFinite(sysjHours) || sysjHours <= 0) return;

    const deadline = new Date(cysj.getTime() + sysjHours * 3600 * 1000);
    if (now > deadline) {
      throw new BadRequestException(
        `该首页已超过规定时间录入，请相关人员解锁！出院日期：${formatDateTime(cysj)}，有效日期范围：${formatDateTime(deadline)}`,
      );
    }
  }

  /** 事务内保存各模块业务数据（不写工作流状态字段） */
  private async saveBusinessPayload(
    manager: EntityManager,
    zyid: string,
    dto: PatientCaseWorkflowDto,
  ) {
    if (dto.basic) {
      const normalized = this.n0421Service.normalizeSaveData({
        ...dto.basic,
        zyid,
      } as Partial<N0421>);
      // 状态字段由后续 applyBasicWorkflow 写入，这里剔除避免前端误传
      delete (normalized as any).sjbz;
      delete (normalized as any).tjbz;
      delete (normalized as any).shbz;
      delete (normalized as any).jdrq;
      delete (normalized as any).shrq;

      const repo = manager.getRepository(N0421);
      const exists = await repo.findOne({ where: { zyid } });
      if (exists) {
        await repo.update({ zyid }, normalized);
      } else {
        await repo.insert({ ...normalized, zyid });
      }
    }

    if (dto.diagnosis !== undefined) {
      const repo = manager.getRepository(N0422);
      await repo.delete({ zyid });
      const rows = (dto.diagnosis || []).map((row, index) => {
        const zdbm = String(row.zdbm || row.icd10 || '').trim();
        const zdmc = String(row.zdmc || row.zwmc || '').trim();
        return {
          ...row,
          zyid,
          zdxh: index,
          zdbm: zdbm || null,
          zdmc: zdmc || null,
          icd10: row.icd10 || zdbm || null,
          zwmc: row.zwmc || zdmc || null,
        } as Partial<N0422>;
      });
      if (rows.length) {
        await repo.insert(rows as any);
      }
    }

    if (dto.surgery !== undefined) {
      const repo = manager.getRepository(N04_23);
      await repo.delete({ zyid });
      const rows = (dto.surgery || []).map((row, index) => ({
        ...row,
        zyid,
        ssxh: index,
      })) as Partial<N04_23>[];
      if (rows.length) {
        await repo.insert(rows as any);
      }
    }

    if (dto.fee) {
      const repo = manager.getRepository(N0424);
      const payload = { ...dto.fee, zyid } as Partial<N0424>;
      delete (payload as any).sjbz;
      const exists = await repo.findOne({ where: { zyid } });
      if (exists) {
        await repo.update({ zyid }, payload);
      } else {
        await repo.insert(payload as any);
      }
    }

    if (dto.newborn) {
      const repo = manager.getRepository(N0425);
      const payload = { ...dto.newborn, zyid } as Partial<N0425>;
      delete (payload as any).sjbz;
      const exists = await repo.findOne({ where: { zyid } });
      if (exists) {
        await repo.update({ zyid }, payload);
      } else {
        await repo.insert(payload as any);
      }
    }
  }

  private async applyBasicWorkflow(
    repo: Repository<N0421>,
    basic: N0421,
    action: WorkflowActionCode,
    now: Date,
  ) {
    const zyid = basic.zyid;
    const patch: Partial<N0421> = {};

    if (action === 9) {
      patch.tjbz = 0;
    } else if (action === 0) {
      patch.sjbz = 0;
      patch.tjbz = 0;
      patch.shbz = 0;
      patch.jdrq = now;
    } else if (action === 2) {
      patch.sjbz = 1;
      patch.tjbz = 1;
      patch.jdrq = now;
      patch.shrq = now;
    } else if (action === 1) {
      patch.sjbz = 0;
      patch.tjbz = 1;
      patch.jdrq = now;
    }

    const oldJdrq = basic.jdrq ? new Date(basic.jdrq) : null;
    if (
      !oldJdrq ||
      Number.isNaN(oldJdrq.getTime()) ||
      oldJdrq.getTime() <= new Date('1900-01-01').getTime()
    ) {
      if (!patch.jdrq) {
        patch.jdrq = now;
      }
    }

    if (Object.keys(patch).length > 0) {
      await repo.update({ zyid }, patch);
    }
  }

  /** 读取目标表 varchar 列长度，避免 N04→NQ 复制时截断报错 */
  private async getVarcharLengths(
    queryRunner: { query: (sql: string, params?: unknown[]) => Promise<any[]> },
    tableName: string,
  ): Promise<Map<string, number>> {
    const rows = await queryRunner.query(
      `
      SELECT COLUMN_NAME AS name, CHARACTER_MAXIMUM_LENGTH AS maxLen
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'dbo'
        AND TABLE_NAME = @0
        AND DATA_TYPE IN ('varchar', 'nvarchar', 'char', 'nchar')
        AND CHARACTER_MAXIMUM_LENGTH IS NOT NULL
        AND CHARACTER_MAXIMUM_LENGTH > 0
      `,
      [tableName],
    );
    const map = new Map<string, number>();
    for (const row of rows || []) {
      const name = String(row.name || row.NAME || '').toLowerCase();
      const maxLen = Number(row.maxLen ?? row.MAXLEN ?? row.maxlen);
      if (name && Number.isFinite(maxLen) && maxLen > 0) {
        map.set(name, maxLen);
      }
    }
    return map;
  }

  private clipExpr(column: string, lengths: Map<string, number>, fallback = 200): string {
    const maxLen = lengths.get(column.toLowerCase()) ?? fallback;
    return `LEFT(CONVERT(NVARCHAR(MAX), ${column}), ${maxLen})`;
  }

  /** 对齐 PB：DELETE NQ + INSERT FROM N04（vali_flag='1'），字符串按 NQ 列宽截断 */
  private async syncArchiveTables(
    queryRunner: { query: (sql: string, params?: unknown[]) => Promise<unknown> },
    zyid: string,
  ) {
    await queryRunner.query(`DELETE FROM dbo.NQ04_22 WHERE zyid = @0`, [zyid]);
    await queryRunner.query(`DELETE FROM dbo.NQ04_23 WHERE zyid = @0`, [zyid]);

    const nq22Lens = await this.getVarcharLengths(queryRunner as any, 'NQ04_22');
    const nq23Lens = await this.getVarcharLengths(queryRunner as any, 'NQ04_23');

    const c22 = (col: string, fallback?: number) => this.clipExpr(col, nq22Lens, fallback);
    const c23 = (col: string, fallback?: number) => this.clipExpr(col, nq23Lens, fallback);

    await queryRunner.query(
      `
      INSERT INTO dbo.NQ04_22(
        zyid, zdxh, zdmc, zdbm, zdbq, zdlx, bzxx, bzxx1, sjbz, palg_no, ipt_patn_disediag,
        maindiag_flag, inhosp_diag_code, adm_dise_cond_code, adm_cond_code, high_diag_evid, bkup_deg_code,
        vali_flag, bzxx2, bzxx3, bzxx4, bzxx5, icd10, zwmc
      )
      SELECT
        ${c22('zyid', 12)}, zdxh, ${c22('zdmc', 60)}, ${c22('zdbm', 30)}, ${c22('zdbq', 10)}, ${c22('zdlx', 10)},
        ${c22('bzxx', 30)}, ${c22('bzxx1', 30)}, 0, ${c22('palg_no', 30)}, ${c22('ipt_patn_disediag', 30)},
        ${c22('maindiag_flag', 3)}, ${c22('inhosp_diag_code', 30)}, ${c22('adm_dise_cond_code', 30)},
        ${c22('adm_cond_code', 30)}, ${c22('high_diag_evid', 30)}, ${c22('bkup_deg_code', 30)},
        ${c22('vali_flag', 3)}, ${c22('bzxx2', 30)}, ${c22('bzxx3', 30)}, ${c22('bzxx4', 30)}, ${c22('bzxx5', 30)},
        ${c22('icd10', 30)}, ${c22('zwmc', 100)}
      FROM dbo.N04_22
      WHERE zyid = @0
        AND ISNULL(vali_flag, '1') = '1'
        AND NOT EXISTS (
          SELECT 1 FROM dbo.NQ04_22 nq
          WHERE nq.zyid = N04_22.zyid AND nq.zdxh = N04_22.zdxh
        )
      `,
      [zyid],
    );

    await queryRunner.query(
      `
      INSERT INTO dbo.NQ04_23(
        zyid, ssxh, ssjczbm, ssjczrq, shjb, ssjczmc, sz, yz, ez, qkdj, qkylb, mzfs, mzys, bzxx, bzxx1, sjbz,
        oprn_oper_part_code, oprn_con_time, anst_lv_code, oprn_optn_part_code, main_oprn_flag,
        anst_asa_lv_code, anst_medn_code, anst_medn_dos, unt, anst_begntime, anst_endtime,
        anst_copn_code, anst_copn_dscr, pacu_begntime, pacu_endtime, canc_oprn_flag, vali_flag,
        bzxx2, bzxx3, bzxx4, bzxx5, icd10, zwmc
      )
      SELECT
        ${c23('zyid', 12)}, ssxh, ${c23('ssjczbm', 30)}, ssjczrq, ${c23('shjb', 10)}, ${c23('ssjczmc', 60)},
        ${c23('sz', 10)}, ${c23('yz', 10)}, ${c23('ez', 10)}, ${c23('qkdj', 10)}, ${c23('qkylb', 10)},
        ${c23('mzfs', 10)}, ${c23('mzys', 10)}, ${c23('bzxx', 30)}, ${c23('bzxx1', 30)}, 0,
        ${c23('oprn_oper_part_code', 30)}, ${c23('oprn_con_time', 10)}, ${c23('anst_lv_code', 30)},
        ${c23('oprn_optn_part_code', 30)}, ${c23('main_oprn_flag', 30)},
        ${c23('anst_asa_lv_code', 30)}, ${c23('anst_medn_code', 50)}, ${c23('anst_medn_dos', 20)}, ${c23('unt', 10)},
        anst_begntime, anst_endtime,
        ${c23('anst_copn_code', 30)}, ${c23('anst_copn_dscr', 200)}, pacu_begntime, pacu_endtime,
        ${c23('canc_oprn_flag', 3)}, ${c23('vali_flag', 3)},
        ${c23('bzxx2', 30)}, ${c23('bzxx3', 30)}, ${c23('bzxx4', 30)}, ${c23('bzxx5', 30)},
        ${c23('icd10', 30)}, ${c23('zwmc', 100)}
      FROM dbo.N04_23
      WHERE zyid = @0
        AND ISNULL(vali_flag, '1') = '1'
        AND NOT EXISTS (
          SELECT 1 FROM dbo.NQ04_23 nq
          WHERE nq.zyid = N04_23.zyid AND nq.ssxh = N04_23.ssxh
        )
      `,
      [zyid],
    );
  }

  /** 对齐 PB vu_basy_jbxx.uf_vidify_gd */
  private validateBasicForArchive(basic: N0421) {
    const sjzy = basic.sjzy;
    const zycs = basic.zycs;
    const jbbm = basic.jbbm;
    const lyfs = basic.lyfs;
    const zkkb = basic.zkkb;
    const yzzyJgmc = basic.yzzy_jgmc;
    const xb = String(basic.xb ?? '').trim();
    const hy = String(basic.hy ?? '').trim();

    if (isBlank(sjzy) || toNumberOrNaN(sjzy) === 0) {
      throw new BadRequestException('住院天数不能为0，请核对!');
    }
    if (!Number.isFinite(toNumberOrNaN(sjzy))) {
      throw new BadRequestException('住院天数不是数字');
    }
    if (!Number.isFinite(toNumberOrNaN(zycs))) {
      throw new BadRequestException('住院次数不是数字');
    }
    if (toNumberOrNaN(zycs) < 0) {
      throw new BadRequestException('住院次数不是数字');
    }
    if (isBlank(jbbm)) {
      throw new BadRequestException('门诊西医诊断编码未录入！');
    }
    if (isBlank(lyfs)) {
      throw new BadRequestException('离院方式不能为空!');
    }
    if (isBlank(zkkb)) {
      throw new BadRequestException('转科科别不能为空!');
    }
    if (String(lyfs).trim() === '2' && isBlank(yzzyJgmc)) {
      throw new BadRequestException('离院方式为转院，转院名称不能为空!');
    }

    const rysj = basic.rysj ? new Date(basic.rysj) : null;
    const cysj = basic.cysj ? new Date(basic.cysj) : null;
    if (
      rysj &&
      cysj &&
      !Number.isNaN(rysj.getTime()) &&
      !Number.isNaN(cysj.getTime()) &&
      rysj > cysj
    ) {
      throw new BadRequestException('出院日期小于入院时间!');
    }
    if (xb !== '1' && xb !== '2') {
      throw new BadRequestException('性别不能为空或不详!');
    }
    if (!HY_ALLOWED.has(hy)) {
      throw new BadRequestException('婚姻编号不对，必须在范围1,2,3,4,5,9');
    }
  }

  private validateDiagnosisRows(list: Record<string, unknown>[]) {
    if (!list.length) {
      throw new BadRequestException('请输入诊断，再归档!');
    }
    for (const row of list) {
      const code = String(row.zdbm || row.icd10 || '').trim();
      if (!code) {
        throw new BadRequestException('请输入诊断，再归档!');
      }
    }
    const hasMain = list.some((row) => {
      const zdlx = String(row.zdlx ?? '').trim();
      return zdlx === '1' || zdlx === '2';
    });
    if (!hasMain) {
      throw new BadRequestException('请在诊断里面选择一个主要诊断，再归档!');
    }
  }

  /** 对齐 PB vu_basy_zdxx.uf_vidify_gd */
  private async validateDiagnosisForArchive(zyid: string) {
    const list = await this.n0422Repository.find({ where: { zyid } });
    this.validateDiagnosisRows(list as unknown as Record<string, unknown>[]);
  }

  private getSuccessMessage(action: WorkflowActionCode): string {
    switch (action) {
      case 1:
        return '提交成功';
      case 2:
        return '归档成功';
      case 9:
        return '已取消提交';
      case 0:
        return '已取消归档';
      default:
        return '操作成功';
    }
  }
}
