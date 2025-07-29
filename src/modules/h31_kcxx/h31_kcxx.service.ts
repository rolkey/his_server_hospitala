import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import { H31_kcxx } from './h31_kcxx.entity';
import { H30_ypzd } from '../h30_ypzd/h30_ypzd.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';
import { CreateH31_kcxxDto } from './dto/create-h31_kcxx.dto';
import { UpdateH31_kcxxDto } from './dto/update-h31_kcxx.dto';
import { QueryKcjgDto, KcxxResponseDto } from './dto/h31-kcxx.dto';

@Injectable()
export class H31_kcxxService {
  constructor(
    @InjectRepository(H31_kcxx)
    private readonly h31_kcxxRepository: Repository<H31_kcxx>,
    @InjectRepository(H00_xmzd)
    private readonly h00_xmzdRepository: Repository<H00_xmzd>,
    @InjectRepository(H30_ypzd)
    private readonly h30_ypzdRepository: Repository<H30_ypzd>,
  ) {}

  // 创建新记录
  async create(createDto: CreateH31_kcxxDto): Promise<H31_kcxx> {
    const newRecord = this.h31_kcxxRepository.create(createDto);
    return await this.h31_kcxxRepository.save(newRecord);
  }

  // 查询所有记录
  async findAll(): Promise<H31_kcxx[]> {
    return await this.h31_kcxxRepository.find();
  }

  // 根据主键查询单个记录
  async findOne(ksid: string, ypid: string): Promise<H31_kcxx | null> {
    return await this.h31_kcxxRepository.findOne({
      where: { ksid, ypid },
    });
  }

  // 更新记录
  async update(ksid: string, ypid: string, updateDto: UpdateH31_kcxxDto): Promise<H31_kcxx | null> {
    await this.h31_kcxxRepository.update({ ksid, ypid }, updateDto);
    return this.findOne(ksid, ypid);
  }

  // 删除记录
  async remove(ksid: string, ypid: string): Promise<void> {
    await this.h31_kcxxRepository.delete({ ksid, ypid });
  }

  // 根据条件查询
  async findByCondition(h31_kcxx: Partial<H31_kcxx>): Promise<H31_kcxx[]> {
    return await this.h31_kcxxRepository.find({
      where: {
        ksid: h31_kcxx.ksid,
        ypid: h31_kcxx.ypid,
      },
    });
  }

  // 批量插入
  async batchInsert(records: CreateH31_kcxxDto[]): Promise<H31_kcxx[]> {
    const entities = records.map((record) => this.h31_kcxxRepository.create(record));
    return await this.h31_kcxxRepository.save(entities);
  }

  // 获取库存数量大于指定值的记录
  async findByKcslGreaterThan(value: number): Promise<H31_kcxx[]> {
    return await this.h31_kcxxRepository
      .createQueryBuilder('h31_kcxx')
      .where('h31_kcxx.kcsl > :value', { value })
      .getMany();
  }

  // 获取过期药品（生产日期早于指定日期）
  async findExpired(beforeDate: Date): Promise<H31_kcxx[]> {
    return await this.h31_kcxxRepository
      .createQueryBuilder('h31_kcxx')
      .where('h31_kcxx.scrq < :beforeDate', { beforeDate })
      .getMany();
  }

  // 校验库存
  async validateInventory(ksid: string, ypid: string, quantity: number): Promise<boolean> {
    const record = await this.findOne(ksid, ypid);
    if (!record) return false;
    const { xsl, mzdfsl, dfsl, ssdfsl } = record;
    return xsl - (mzdfsl || 0) - (dfsl || 0) - (ssdfsl || 0) >= quantity;
  }

  private toResponseDto(entity: H31_kcxx): KcxxResponseDto {
    return {
      ksid: entity.ksid,
      ypid: entity.ypid,
      ypgg: entity.ypgg,
      cjid: entity.cjid,
      scph: entity.scph,
      lsjg: entity.lsjg,
      pfjg: entity.pfjg,
      gsid: entity.gsid,
      kcsl: entity.kcsl,
      sxrq: entity.sxrq,
      pzwh: entity.pzwh,
      scpc: entity.scpc,
      xsl: entity.xsl,
      zsm: entity.zsm,
    };
  }

  async queryKcjg(query: QueryKcjgDto) {
    const { lx, ypid, ypmc, xmzl, ksid1, ksid2, ksid3, ksid4, ksid5 } = query;
    console.error('query', query);

    if (Number(xmzl) === 1) {
      // 项目查询逻辑
      const xmzd = await this.h00_xmzdRepository.findOne({ where: { xmid: ypid } });
      if (!xmzd) {
        throw new Error('未查到项目字典数据');
      }

      return {
        lsjg: xmzd.sfdj, // TODO: 四舍五入
        pfjg: xmzd.pfjg,
        kcdw: xmzd.kcdw,
        sfdw: xmzd.jldw,
        ypgg: xmzd.ggxh,
        fyfs: xmzd.fyfs,
        ybfl: xmzd.zflx,
        zzbz: String(xmzd.sfbz),
        fylbid: xmzd.fylbid,
      };
    } else {
      // 药品查询逻辑
      const ypzd = await this.h30_ypzdRepository.findOne({ where: { ypid } });
      if (!ypzd) {
        throw new Error('未查到药品字典数据');
      }

      // TODO: ue_read_ksid_mz逻辑未明
      const ksids = [ksid1, ksid2, ksid3, ksid4, ksid5].filter(Boolean);
      const kcxx = await this.h31_kcxxRepository.findOne({
        where: { ypid, ksid: In(ksids), yxbz: 1, kcsl: MoreThan(0) },
        order: { scph: 'ASC' },
      });

      if (!kcxx) {
        throw new Error('药品库存不足');
      }

      return {
        lsjg: Number(ypzd.yjjl) / ypzd.ysxs,
        pfjg: Number(ypzd.sjjl) / ypzd.ysxs,
        scph: kcxx.scph,
        cjid: kcxx.cjid,
        gsid: kcxx.gsid,
        kcdw: ypzd.yjjl,
        sfdw: ypzd.sjjl,
        ypgg: ypzd.ypgg,
        fyfs: ypzd.syplid,
        ybfl: ypzd.abcfl.toString(),
        zzbz: ypzd.zzbz,
        cfqj: ypzd.cfqj,
        zysx: ypzd.zysx,
        psbz: ypzd.jsl1.toString(),
        syffid: ypzd.syffid,
        zxks: kcxx.ksid,
        kcsl: kcxx.kcsl,
        success: true,
      };
    }
  }
}
