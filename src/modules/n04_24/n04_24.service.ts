import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { N0424 } from './n04_24.entity';
import { ReadFyxxDto } from './dto/n04_24.dto';

/** 费用详情查询字段，与 N04_24 按 zyid 查询 SQL 一致 */
const N0424_DETAIL_FIELDS: (keyof N0424)[] = [
  'zyid',
  'zfy',
  'zfje',
  'ylfwf',
  'bzlzf',
  'zyblzhzf',
  'zlczf',
  'hlf',
  'qtfy',
  'blzdf',
  'zdf',
  'yxxzdf',
  'lczdxmf',
  'fsszlxmf',
  'zlf',
  'sszlf',
  'mzf',
  'ssf',
  'kff',
  'zyl_zyzd',
  'zyzl',
  'zywz',
  'zygs',
  'zcyjf',
  'zytnzl',
  'zygczl',
  'zytszl',
  'zyqt',
  'zytstpjg',
  'bzss',
  'xyf',
  'kjywf',
  'zcyf',
  'zyzjf',
  'zcyf1',
  'xf',
  'bdblzpf',
  'qdblzpf',
  'nxyzlzpf',
  'xbyzlzpf',
  'jcyyclf',
  'yyclf',
  'ssycxclf',
  'qtf',
  'sjbz',
];

/** h50_readfy 存储过程返回的费用字段（不含 zfje，自付金额单独查询） */
const H50_READFY_FIELDS = [
  'zfy',
  'ylfwf',
  'bzlzf',
  'zyblzhzf',
  'zlczf',
  'hlf',
  'qtfy',
  'blzdf',
  'zdf',
  'yxxzdf',
  'lczdxmf',
  'fsszlxmf',
  'zlf',
  'sszlf',
  'mzf',
  'ssf',
  'kff',
  'zyl_zyzd',
  'zyzl',
  'zywz',
  'zygs',
  'zcyjf',
  'zytnzl',
  'zygczl',
  'zytszl',
  'zyqt',
  'zytstpjg',
  'bzss',
  'xyf',
  'kjywf',
  'zcyf',
  'zyzjf',
  'zcyf1',
  'xf',
  'bdblzpf',
  'qdblzpf',
  'nxyzlzpf',
  'xbyzlzpf',
  'jcyyclf',
  'yyclf',
  'ssycxclf',
  'qtf',
] as const;

type H50ReadfyResult = Record<(typeof H50_READFY_FIELDS)[number], number>;

const H50_READFY_SQL = `
DECLARE
  @ZFY DECIMAL(12,2) = 0, @ZFJE DECIMAL(12,2) = 0,
  @YLFWF DECIMAL(12,2) = 0, @BZLZF DECIMAL(12,2) = 0,
  @ZYBLZHZF DECIMAL(12,2) = 0, @ZLCZF DECIMAL(12,2) = 0,
  @HLF DECIMAL(12,2) = 0, @QTFY DECIMAL(12,2) = 0,
  @BLZDF DECIMAL(12,2) = 0, @ZDF DECIMAL(12,2) = 0,
  @YXXZDF DECIMAL(12,2) = 0, @LCZDXMF DECIMAL(12,2) = 0,
  @FSSZLXMF DECIMAL(12,2) = 0, @ZLF DECIMAL(12,2) = 0,
  @SSZLF DECIMAL(12,2) = 0, @MZF DECIMAL(12,2) = 0,
  @SSF DECIMAL(12,2) = 0, @KFF DECIMAL(12,2) = 0,
  @ZYL_ZYZD DECIMAL(12,2) = 0, @ZYZL DECIMAL(12,2) = 0,
  @ZYWZ DECIMAL(12,2) = 0, @ZYGS DECIMAL(12,2) = 0,
  @ZCYJF DECIMAL(12,2) = 0, @ZYTNZL DECIMAL(12,2) = 0,
  @ZYGCZL DECIMAL(12,2) = 0, @ZYTSZL DECIMAL(12,2) = 0,
  @ZYQT DECIMAL(12,2) = 0, @ZYTSTPJG DECIMAL(12,2) = 0,
  @BZSS DECIMAL(12,2) = 0, @XYF DECIMAL(12,2) = 0,
  @KJYWF DECIMAL(12,2) = 0, @ZCYF DECIMAL(12,2) = 0,
  @ZYZJF DECIMAL(12,2) = 0, @ZCYF1 DECIMAL(12,2) = 0,
  @XF DECIMAL(12,2) = 0, @BDBLZPF DECIMAL(12,2) = 0,
  @QDBLZPF DECIMAL(12,2) = 0, @NXYZLZPF DECIMAL(12,2) = 0,
  @XBYZLZPF DECIMAL(12,2) = 0, @JCYYCLF DECIMAL(12,2) = 0,
  @YYCLF DECIMAL(12,2) = 0, @SSYCXCLF DECIMAL(12,2) = 0,
  @qtf DECIMAL(12,2) = 0;

EXEC h50_readfy
  @zyid = @0,
  @date1 = @1,
  @date2 = @2,
  @ksid = '',
  @ZFY = @ZFY OUTPUT,
  @ZFJE = @ZFJE OUTPUT,
  @YLFWF = @YLFWF OUTPUT,
  @BZLZF = @BZLZF OUTPUT,
  @ZYBLZHZF = @ZYBLZHZF OUTPUT,
  @ZLCZF = @ZLCZF OUTPUT,
  @HLF = @HLF OUTPUT,
  @QTFY = @QTFY OUTPUT,
  @BLZDF = @BLZDF OUTPUT,
  @ZDF = @ZDF OUTPUT,
  @YXXZDF = @YXXZDF OUTPUT,
  @LCZDXMF = @LCZDXMF OUTPUT,
  @FSSZLXMF = @FSSZLXMF OUTPUT,
  @ZLF = @ZLF OUTPUT,
  @SSZLF = @SSZLF OUTPUT,
  @MZF = @MZF OUTPUT,
  @SSF = @SSF OUTPUT,
  @KFF = @KFF OUTPUT,
  @ZYL_ZYZD = @ZYL_ZYZD OUTPUT,
  @ZYZL = @ZYZL OUTPUT,
  @ZYWZ = @ZYWZ OUTPUT,
  @ZYGS = @ZYGS OUTPUT,
  @ZCYJF = @ZCYJF OUTPUT,
  @ZYTNZL = @ZYTNZL OUTPUT,
  @ZYGCZL = @ZYGCZL OUTPUT,
  @ZYTSZL = @ZYTSZL OUTPUT,
  @ZYQT = @ZYQT OUTPUT,
  @ZYTSTPJG = @ZYTSTPJG OUTPUT,
  @BZSS = @BZSS OUTPUT,
  @XYF = @XYF OUTPUT,
  @KJYWF = @KJYWF OUTPUT,
  @ZCYF = @ZCYF OUTPUT,
  @ZYZJF = @ZYZJF OUTPUT,
  @ZCYF1 = @ZCYF1 OUTPUT,
  @XF = @XF OUTPUT,
  @BDBLZPF = @BDBLZPF OUTPUT,
  @QDBLZPF = @QDBLZPF OUTPUT,
  @NXYZLZPF = @NXYZLZPF OUTPUT,
  @XBYZLZPF = @XBYZLZPF OUTPUT,
  @JCYYCLF = @JCYYCLF OUTPUT,
  @YYCLF = @YYCLF OUTPUT,
  @SSYCXCLF = @SSYCXCLF OUTPUT,
  @qtf = @qtf OUTPUT;

SELECT
  @ZFY AS zfy, @YLFWF AS ylfwf, @BZLZF AS bzlzf, @ZYBLZHZF AS zyblzhzf,
  @ZLCZF AS zlczf, @HLF AS hlf, @QTFY AS qtfy, @BLZDF AS blzdf, @ZDF AS zdf,
  @YXXZDF AS yxxzdf, @LCZDXMF AS lczdxmf, @FSSZLXMF AS fsszlxmf, @ZLF AS zlf,
  @SSZLF AS sszlf, @MZF AS mzf, @SSF AS ssf, @KFF AS kff,
  @ZYL_ZYZD AS zyl_zyzd, @ZYZL AS zyzl, @ZYWZ AS zywz, @ZYGS AS zygs,
  @ZCYJF AS zcyjf, @ZYTNZL AS zytnzl, @ZYGCZL AS zygczl, @ZYTSZL AS zytszl,
  @ZYQT AS zyqt, @ZYTSTPJG AS zytstpjg, @BZSS AS bzss, @XYF AS xyf,
  @KJYWF AS kjywf, @ZCYF AS zcyf, @ZYZJF AS zyzjf, @ZCYF1 AS zcyf1, @XF AS xf,
  @BDBLZPF AS bdblzpf, @QDBLZPF AS qdblzpf, @NXYZLZPF AS nxyzlzpf,
  @XBYZLZPF AS xbyzlzpf, @JCYYCLF AS jcyyclf, @YYCLF AS yyclf,
  @SSYCXCLF AS ssycxclf, @qtf AS qtf;
`;

function toDecimal(value: unknown): number {
  if (value == null || value === '') return 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function parseH50ReadfyRow(row: Record<string, unknown>): H50ReadfyResult {
  const result = {} as H50ReadfyResult;
  for (const field of H50_READFY_FIELDS) {
    result[field] = toDecimal(row[field]);
  }
  return result;
}

@Injectable()
export class N0424Service {
  constructor(
    @InjectRepository(N0424)
    private readonly n0424Repository: Repository<N0424>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(data: Partial<N0424>): Promise<N0424> {
    const entity = this.n0424Repository.create(data);
    return await this.n0424Repository.save(entity);
  }

  async findByCondition(condition: Partial<N0424>): Promise<N0424[]> {
    return await this.n0424Repository.find({ where: condition });
  }

  async findByZyid(zyid: string): Promise<Partial<N0424>> {
    const selectFields = N0424_DETAIL_FIELDS.map((field) => `n04_24.${field}`);
    const record = await this.n0424Repository
      .createQueryBuilder('n04_24')
      .select(selectFields)
      .where('n04_24.zyid = :zyid', { zyid })
      .getOne();

    if (!record) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案费用不存在`);
    }

    return record;
  }

  async findOne(zyid: string): Promise<Partial<N0424>> {
    return this.findByZyid(zyid);
  }

  async update(zyid: string, data: Partial<N0424>): Promise<Partial<N0424>> {
    const { zyid: _, ...updateData } = data;
    const result = await this.n0424Repository.update({ zyid }, updateData);
    if (result.affected === 0) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案费用不存在`);
    }
    return this.findOne(zyid);
  }

  async save(data: Partial<N0424>): Promise<Partial<N0424> | N0424> {
    const { zyid } = data;
    if (!zyid) {
      throw new NotFoundException('住院ID不能为空');
    }
    const existing = await this.n0424Repository.findOne({ where: { zyid } });
    if (existing) {
      await this.n0424Repository.update({ zyid }, data);
      return this.findOne(zyid);
    }
    return this.create(data);
  }

  async remove(zyid: string): Promise<void> {
    const result = await this.n0424Repository.delete({ zyid });
    if (result.affected === 0) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案费用不存在`);
    }
  }

  /**
   * 读取费用（对应 PB wf_get_fyxx）
   * 1. 调用 h50_readfy 汇总各费用分类
   * 2. 从 G10_DJxx 取个人现金支付作为自付金额
   * 3. 写入 N04_24
   */
  async readFyxx(dto: ReadFyxxDto): Promise<Partial<N0424>> {
    const { zyid, force = false } = dto;
    const existing = await this.n0424Repository.findOne({ where: { zyid } });
    const existingZfy = toDecimal(existing?.zfy);

    if (existingZfy > 0 && !force) {
      throw new ConflictException('已有费用数据，请确认是否重新读取（force=true）');
    }

    const { date1, date2 } = await this.resolveFeeDateRange(zyid, dto.date1, dto.date2);
    const feeData = await this.callH50Readfy(zyid, date1, date2);
    const zfje = await this.resolveZfje(zyid, feeData.zfy);

    if (feeData.ylfwf > feeData.zfy) {
      feeData.ylfwf = feeData.zfy;
    }

    const saveData: Partial<N0424> = {
      zyid,
      ...feeData,
      zfje,
    };

    return this.save(saveData);
  }

  private async resolveFeeDateRange(
    zyid: string,
    date1?: string,
    date2?: string,
  ): Promise<{ date1: Date; date2: Date }> {
    if (date1 && date2) {
      return { date1: new Date(date1), date2: new Date(date2) };
    }

    const rows = await this.dataSource.query(
      `SELECT rysj, cysj FROM h11_brxx WHERE zyid = @0`,
      [zyid],
    );
    if (!rows?.length) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病人信息不存在`);
    }

    const rysj = rows[0].rysj ? new Date(rows[0].rysj) : new Date();
    const cysj = rows[0].cysj ? new Date(rows[0].cysj) : new Date();

    return {
      date1: date1 ? new Date(date1) : rysj,
      date2: date2 ? new Date(date2) : cysj,
    };
  }

  private async callH50Readfy(zyid: string, date1: Date, date2: Date): Promise<H50ReadfyResult> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const rows = await queryRunner.query(H50_READFY_SQL, [zyid, date1, date2]);
      await queryRunner.commitTransaction();

      if (!rows?.length) {
        throw new InternalServerErrorException('读取费用失败：存储过程未返回数据');
      }

      return parseH50ReadfyRow(rows[0]);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const message = error instanceof Error ? error.message : '读取费用失败';
      throw new InternalServerErrorException(`读取费用失败：${message}`);
    } finally {
      await queryRunner.release();
    }
  }

  /** 自付金额：优先取 G10_DJxx.psn_cash_pay（jsbz=4），否则等于总费用 */
  private async resolveZfje(zyid: string, zfy: number): Promise<number> {
    const rows = await this.dataSource.query(
      `SELECT TOP 1 psn_cash_pay AS zfje
       FROM g10_djxx
       WHERE lsh = @0 AND jsbz = 4`,
      [zyid],
    );

    if (!rows?.length) {
      return zfy;
    }

    const raw = rows[0].zfje;
    let zfje = raw == null ? zfy : toDecimal(raw);
    if (zfje > zfy) {
      zfje = zfy;
    }
    return zfje;
  }
}
