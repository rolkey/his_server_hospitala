import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { emr_jb01 } from './emr_jb01.entity';
import { emr_jb02 } from '../emr_jb02/emr_jb02.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

@Injectable()
export class emr_jb01Service {
  constructor(
    @InjectRepository(emr_jb01)
    private readonly emrJb01Repo: Repository<emr_jb01>,
    @InjectRepository(emr_jb02)
    private readonly emrJb02Repo: Repository<emr_jb02>,
    @InjectRepository(h11_brxx)
    private readonly h11BrxxRepo: Repository<h11_brxx>,
    private readonly dataSource: DataSource,
  ) {}

  findAll() {
    return this.emrJb01Repo.find({ order: { jbxh: 'DESC' } });
  }

  findOne(jbxh: string) {
    return this.emrJb01Repo.findOne({ where: { jbxh } });
  }

  /** 按科室、病区等条件查询（可选） */
  findByFilter(params: { ksdm?: string; bqdm?: number; jblb?: number }) {
    return this.emrJb01Repo.find({
      where: {
        ...(params.ksdm != null && params.ksdm !== '' ? { ksdm: params.ksdm } : {}),
        ...(params.bqdm != null ? { bqdm: params.bqdm } : {}),
        ...(params.jblb != null ? { jblb: params.jblb } : {}),
      },
      order: { jbxh: 'DESC' },
    });
  }

  async create(dto: Partial<emr_jb01>) {
    const { jbsj, jblb, ksdm, bqdm } = dto;

    // 1. 参数合法性校验
    if (!jbsj || new Date(jbsj).getFullYear() === 1900) {
      throw new BadRequestException('交班时间不合法');
    }
    if (!jblb || jblb < 1 || jblb > 3) {
      throw new BadRequestException('交班类别必须为 1~3');
    }
    if (!ksdm || ksdm.trim() === '') {
      throw new BadRequestException('请选择交班科室');
    }

    // 2. 根据交班类别计算本班时间范围
    const jbDate = new Date(jbsj);
    const ldt_Begin = new Date(jbDate);
    if (jblb === 1) {
      ldt_Begin.setHours(8, 0, 0, 0); // 白班 08:00
    } else if (jblb === 2) {
      ldt_Begin.setHours(18, 0, 0, 0); // 小夜班 18:00
    } else {
      ldt_Begin.setHours(0, 0, 0, 0);
    }
    const ldt_End = new Date(jbDate);
    ldt_End.setHours(23, 59, 59, 999);

    // 3. 数据库重复性校验
    const existing = await this.emrJb01Repo
      .createQueryBuilder('j')
      .where('j.jbsj > :begin AND j.jbsj <= :end', { begin: ldt_Begin, end: ldt_End })
      .andWhere('j.jblb = :jblb', { jblb })
      .andWhere('j.ksdm = :ksdm', { ksdm })
      .andWhere(bqdm != null ? 'j.bqdm = :bqdm' : '1=1', { bqdm })
      .getCount();

    if (existing > 0) {
      throw new ConflictException('所增加班次已经存在，如需修改请先检索出记录再做修改');
    }

    // 4. 生成新序号（取当前最大值 + 1）
    const maxResult = await this.emrJb01Repo
      .createQueryBuilder('j')
      .select('MAX(CAST(j.jbxh AS BIGINT))', 'maxJbxh')
      .getRawOne<{ maxJbxh: string | null }>();
    const nextJbxh = String(Number(maxResult?.maxJbxh ?? 0) + 1);

    // 5. 组装并保存新记录
    const entity = this.emrJb01Repo.create({
      ...dto,
      jbxh: nextJbxh,
      sxsj: new Date(),
    });
    // 返回所有病人
    const dateStart = new Date(jbsj);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(jbsj);
    dateEnd.setHours(23, 59, 59, 999);
    const patients = await this.h11BrxxRepo
      .createQueryBuilder('h')
      .select('h.zyid', 'ZYH')
      .addSelect('h.zybh', 'ZYHM')
      .addSelect('h.brxm', 'BRXM')
      .addSelect('h.rycw', 'BRCH')
      .addSelect('h.rybqid', 'ryqk')
      .addSelect('h.rysj', 'ryrq')
      .addSelect('h.csrq', 'CSNY')
      .addSelect('h.xbid', 'BRXB')
      .addSelect('1', 'SWBZ')
      .addSelect('h.ryzd', 'ryzd')
      .addSelect('h.zyzt', 'zyzt')
      .where(
        `(
          (h.rysj <= :dateEnd AND h.zyzt <= 2)
          OR (h.cysj >= :dateStart AND h.cysj <= :dateEnd AND h.zyzt >= 3)
          OR (h.zyzt <= 2)
        )`,
        { dateStart, dateEnd },
      )
      .andWhere('h.cyksid LIKE :ksdm', { ksdm })
      .getRawMany();

    return {
      entity,
      patients,
    };
  }

  async update(jbxh: string, dto: Partial<emr_jb01>) {
    await this.emrJb01Repo.update({ jbxh }, dto);
    return this.findOne(jbxh);
  }

  async remove(jbxh: string) {
    const res = await this.emrJb01Repo.delete({ jbxh });
    return res.affected ?? 0;
  }

  async search(params: { date: string; ksdm: string }) {
    // 1. 根据日期和科室查找交接班主记录，不存在则直接返回空
    const { date, ksdm } = params;

    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    // 1. 根据日期和科室查找交接班主记录，不存在则直接返回空
    const jb01 = await this.emrJb01Repo
      .createQueryBuilder('jb01')
      .where('jb01.ksdm = :ksdm', { ksdm })
      .andWhere('jb01.jbsj >= :dateStart AND jb01.jbsj <= :dateEnd', {
        dateStart,
        dateEnd,
      })
      .getOne();

    if (!jb01) {
      return {
        patients: [],
        entity: null,
        details: [],
      };
    }
    const jbxh = jb01.jbxh;
    const ksdmLike = `%${ksdm}%`;

    // 2. 查询病人列表，排除已存在于 EMR_JB02 中的病人（已被纳入本次交班）
    const patients = await this.h11BrxxRepo
      .createQueryBuilder('h')
      .select('h.zyid', 'ZYH')
      .addSelect('h.zybh', 'ZYHM')
      .addSelect('h.brxm', 'BRXM')
      .addSelect('h.rycw', 'BRCH')
      .addSelect('h.rybqid', 'ryqk')
      .addSelect('h.rysj', 'ryrq')
      .addSelect('h.csrq', 'CSNY')
      .addSelect('h.xbid', 'BRXB')
      .addSelect('1', 'SWBZ')
      .addSelect('h.ryzd', 'ryzd')
      .addSelect('h.zyzt', 'zyzt')
      .where(
        `(
          (h.rysj <= :dateEnd AND h.zyzt <= 2)
          OR (h.cysj >= :dateStart AND h.cysj <= :dateEnd AND h.zyzt >= 3)
          OR (h.zyzt <= 2)
        )`,
        { dateStart, dateEnd },
      )
      .andWhere('h.cyksid LIKE :ksdmLike', { ksdmLike })
      .andWhere('h.zyid NOT IN (SELECT j.zyh FROM EMR_JB02 j WHERE j.jbxh = :jbxh)', { jbxh })
      .getRawMany();
    const details = await this.emrJb02Repo
      .createQueryBuilder('jb02')
      .where('jb02.jbxh = :jbxh', { jbxh })
      .getRawMany();
    return {
      patients,
      entity: jb01,
      details,
    };
  }

  /**
   * 历史查询：EMR_JB02 JOIN EMR_JB01
   * - zt=1：按住院号模糊查询（ZYH like）
   * - zt=2：按交班时间范围查询（JBSJ between）
   */
  async history(params: { zt: 1 | 2; zyh?: string; startDate?: string; endDate?: string }) {
    const { zt, zyh, startDate, endDate } = params;

    const qb = this.emrJb02Repo
      .createQueryBuilder('jb02')
      .innerJoin(emr_jb01, 'jb01', 'jb02.jbxh = jb01.jbxh')
      .select([
        'jb02.jlxh   AS JLXH',
        'jb02.jbxh   AS JBXH',
        'jb02.zyh    AS ZYH',
        'jb02.brch   AS BRCH',
        'jb02.brlx   AS BRLX',
        'jb02.jbqk   AS JBQK',
        'jb02.qkms   AS QKMS',
        'jb02.brzd   AS BRZD',
        'jb02.brxm   AS BRXM',
        'jb02.brxb   AS BRXB',
        'jb02.csny   AS CSNY',
        'jb02.jbjl   AS JBJL',
        'jb02.jbjl1  AS JBJL1',
        'jb02.jbjl2  AS JBJL2',
        'jb02.jbry1  AS JBRY1',
        'jb02.jbry2  AS JBRY2',
        'jb02.shbz1  AS SHBZ1',
        'jb02.shbz2  AS SHBZ2',
        'jb02.shbz3  AS SHBZ3',
        'jb02.shsj1  AS SHSJ1',
        'jb02.shsj2  AS SHSJ2',
        'jb02.shsj3  AS SHSJ3',
        'jb02.brzt1  AS BRZT1',
        'jb02.brzt2  AS BRZT2',
        'jb02.brzt3  AS BRZT3',
        'jb02.bz1    AS BZ1',
        'jb02.bz2    AS BZ2',
        'jb02.bz3    AS BZ3',
        'jb01.shbz   AS SHBZ',
        'jb01.czry   AS CZRY',
        'jb01.czry1  AS CZRY1',
      ]);

    if (zt === 1) {
      if (!zyh) throw new BadRequestException('住院号不能为空');
      qb.where('jb02.zyh LIKE :zyh', { zyh: `%${zyh}%` });
    } else {
      if (!startDate || !endDate) throw new BadRequestException('查询日期范围不能为空');
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      qb.where('jb01.jbsj >= :start AND jb01.jbsj <= :end', { start, end });
    }

    return qb.getRawMany();
  }

  /**
   * 按 jbxh 查询右边记录：主表头 + 全部明细
   */
  async findDetail(jbxh: string) {
    const header = await this.emrJb01Repo.findOne({ where: { jbxh } });
    if (!header) return { header: null, details: [] };

    const details = await this.emrJb02Repo
      .createQueryBuilder('jb02')
      .where('jb02.jbxh = :jbxh', { jbxh })
      .orderBy('jb02.bz1', 'ASC')
      .getMany();

    return { header, details };
  }

  /**
   * 保存交班记录（主表 + 明细表）
   * - jb01: 主记录，必须包含 jbxh（已存在则更新，否则插入）
   * - jb02: 明细列表，没有 jlxh 的行自动生成新序号
   */
  async save(dto: { jb01: Partial<emr_jb01>; jb02?: Partial<emr_jb02>[] }) {
    const { jb01, jb02 = [] } = dto;

    if (!jb01?.jbxh) {
      throw new BadRequestException('jbxh 不能为空');
    }

    const jbxh = String(jb01.jbxh);

    await this.dataSource.transaction(async (manager) => {
      // 1. 更新/保存交班01主记录
      await manager.save(emr_jb01, { ...jb01, jbxh });

      // 2. 批量保存明细
      if (jb02.length > 0) {
        // 获取当前 JLXH 最大值，用于为没有 jlxh 的行生成新序号
        const maxResult = await manager
          .createQueryBuilder(emr_jb02, 'j')
          .select('MAX(CAST(j.jlxh AS BIGINT))', 'maxJlxh')
          .getRawOne<{ maxJlxh: string | null }>();
        let nextJlxh = Number(maxResult?.maxJlxh ?? 0) + 1;

        const detailEntities: Partial<emr_jb02>[] = jb02.map((row, index) => ({
          ...row,
          jlxh: row.jlxh ? String(row.jlxh) : String(nextJlxh++),
          jbxh,
          bz1: String(index + 1).padStart(2, '0'),
        }));

        await manager.save(emr_jb02, detailEntities as emr_jb02[]);
      }
    });

    return this.emrJb01Repo.findOne({ where: { jbxh } });
  }

  /** 校验记录存在且未审核，返回记录 */
  private async assertCanSign(jbxh: string) {
    const record = await this.emrJb01Repo.findOne({ where: { jbxh } });
    if (!record) throw new BadRequestException('交班记录不存在');
    if (record.shbz === 1) throw new ConflictException('所选择的记录已审核，不能被操作！');
    return record;
  }

  /** 将主/副签名人拼合为最终签名串 */
  private buildSignature(main: string, sub?: string): string {
    if (!main || main.trim() === '') throw new BadRequestException('签名人不能为空');
    return sub && sub.trim() !== '' ? `${main}/${sub}` : main;
  }

  /**
   * 白班签名：写入 czry（操作人员）和 jbhs（交班护士）
   * - 已审核记录不允许签名
   * - 副签名人存在时拼接为 "主/副" 格式
   */
  async sign(jbxh: string, dto: { czry: string; czry1?: string }) {
    await this.assertCanSign(jbxh);
    const signature = this.buildSignature(dto.czry, dto.czry1);
    await this.emrJb01Repo.update({ jbxh }, { jbhs: signature, czry: signature });
    return this.emrJb01Repo.findOne({ where: { jbxh } });
  }

  /**
   * 夜班签名：仅写入 czry1（夜班操作人员）
   * - 已审核记录不允许签名
   * - 副签名人存在时拼接为 "主/副" 格式
   */
  async signNight(jbxh: string, dto: { czry1: string; czry1sub?: string }) {
    await this.assertCanSign(jbxh);
    const signature = this.buildSignature(dto.czry1, dto.czry1sub);
    await this.emrJb01Repo.update({ jbxh }, { czry1: signature });
    return this.emrJb01Repo.findOne({ where: { jbxh } });
  }

  /**
   * 审核：将 shbz 置为 1，记录审核人（bz1）
   * - 已审核的记录不允许重复审核
   */
  async approve(jbxh: string, userid: string) {
    const record = await this.emrJb01Repo.findOne({ where: { jbxh } });
    if (!record) {
      throw new BadRequestException('交班记录不存在');
    }
    if (record.shbz === 1) {
      throw new ConflictException('所选择的记录已审核，不能被操作！');
    }

    await this.emrJb01Repo.update({ jbxh }, { shbz: 1, bz1: userid });
    return this.emrJb01Repo.findOne({ where: { jbxh } });
  }

  /**
   * 取消审核：将 shbz 置为 0
   */
  async cancelApprove(jbxh: string) {
    const record = await this.emrJb01Repo.findOne({ where: { jbxh } });
    if (!record) {
      throw new BadRequestException('交班记录不存在');
    }

    await this.emrJb01Repo.update({ jbxh }, { shbz: 0 });
    return this.emrJb01Repo.findOne({ where: { jbxh } });
  }
}
