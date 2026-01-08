import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { N0422 } from './n04_22.entity';

@Injectable()
export class N0422Service {
  constructor(
    @InjectRepository(N0422)
    private readonly n0422Repository: Repository<N0422>,
  ) {}

  // 创建记录
  async create(n0422: Partial<N0422>): Promise<N0422> {
    const newN0422 = this.n0422Repository.create(n0422);
    return await this.n0422Repository.save(newN0422);
  }

  // 查询所有记录
  async findAll(): Promise<N0422[]> {
    return await this.n0422Repository.find();
  }

  // 根据主键查询
  async findOne(zyid: string, zdxh: number): Promise<N0422> {
    return await this.n0422Repository.findOne({
      where: { zyid, zdxh },
    });
  }

  // 更新记录
  async update(zyid: string, zdxh: number, n0422: Partial<N0422>): Promise<N0422> {
    await this.n0422Repository.update({ zyid, zdxh }, n0422);
    return await this.findOne(zyid, zdxh);
  }

  // 删除记录
  async remove(zyid: string, zdxh: number): Promise<void> {
    await this.n0422Repository.delete({ zyid, zdxh });
  }

  // 根据条件查询
  async findByCondition(condition: Partial<N0422>): Promise<N0422[]> {
    return await this.n0422Repository.find({
      where: condition,
    });
  }

  // 根据zyid查询所有相关诊断
  async findByZyid(zyid: string): Promise<N0422[]> {
    return await this.n0422Repository.find({
      where: { zyid },
      order: {
        zdxh: 'ASC',
      },
    });
  }

  // 根据诊断编码查询
  async findByZdbm(zdbm: string): Promise<N0422[]> {
    return await this.n0422Repository.find({
      where: { zdbm },
    });
  }

  // 根据ICD10编码查询
  async findByIcd10(icd10: string): Promise<N0422[]> {
    return await this.n0422Repository.find({
      where: { icd10 },
    });
  }

  // 获取主要诊断
  async getMainDiagnosis(zyid: string): Promise<N0422> {
    return await this.n0422Repository.findOne({
      where: {
        zyid,
        maindiagFlag: '1',
      },
    });
  }
}
