import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H31_kcxx } from './h31_kcxx.entity';
import { CreateH31_kcxxDto } from './dto/create-h31_kcxx.dto';
import { UpdateH31_kcxxDto } from './dto/update-h31_kcxx.dto';

@Injectable()
export class H31_kcxxService {
  constructor(
    @InjectRepository(H31_kcxx)
    private readonly h31KcxxRepository: Repository<H31_kcxx>,
  ) {}

  // 创建新记录
  async create(createDto: CreateH31_kcxxDto): Promise<H31_kcxx> {
    const newRecord = this.h31KcxxRepository.create(createDto);
    return await this.h31KcxxRepository.save(newRecord);
  }

  // 查询所有记录
  async findAll(): Promise<H31_kcxx[]> {
    return await this.h31KcxxRepository.find();
  }

  // 根据主键查询单个记录
  async findOne(ksid: string, ypid: string): Promise<H31_kcxx | null> {
    return await this.h31KcxxRepository.findOne({
      where: { ksid, ypid },
    });
  }

  // 更新记录
  async update(ksid: string, ypid: string, updateDto: UpdateH31_kcxxDto): Promise<H31_kcxx | null> {
    await this.h31KcxxRepository.update({ ksid, ypid }, updateDto);
    return this.findOne(ksid, ypid);
  }

  // 删除记录
  async remove(ksid: string, ypid: string): Promise<void> {
    await this.h31KcxxRepository.delete({ ksid, ypid });
  }

  // 根据条件查询
  async findByCondition(h31_kcxx: Partial<H31_kcxx>): Promise<H31_kcxx[]> {
    return await this.h31KcxxRepository.find({
      where: {
        ksid: h31_kcxx.ksid,
        ypid: h31_kcxx.ypid,
      },
    });
  }

  // 批量插入
  async batchInsert(records: CreateH31_kcxxDto[]): Promise<H31_kcxx[]> {
    const entities = records.map((record) => this.h31KcxxRepository.create(record));
    return await this.h31KcxxRepository.save(entities);
  }

  // 获取库存数量大于指定值的记录
  async findByKcslGreaterThan(value: number): Promise<H31_kcxx[]> {
    return await this.h31KcxxRepository
      .createQueryBuilder('h31_kcxx')
      .where('h31_kcxx.kcsl > :value', { value })
      .getMany();
  }

  // 获取过期药品（生产日期早于指定日期）
  async findExpired(beforeDate: Date): Promise<H31_kcxx[]> {
    return await this.h31KcxxRepository
      .createQueryBuilder('h31_kcxx')
      .where('h31_kcxx.scrq < :beforeDate', { beforeDate })
      .getMany();
  }
}
