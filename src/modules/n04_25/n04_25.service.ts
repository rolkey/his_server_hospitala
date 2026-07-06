import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { N0425 } from './n04_25.entity';

/** 婴儿信息查询字段，与 N04_25 按 zyid 查询 SQL 一致 */
const N0425_DETAIL_FIELDS: (keyof N0425)[] = [
  'zyid',
  'csrq',
  'xb',
  'fmfs',
  'yzqk',
  'fmjg',
  'xx',
  'fath',
  'math',
  'zdbm',
  'zdmc',
  'zdbm1',
  'zdmc1',
  'bzxx',
  'bzxx1',
  'bzxx2',
  'hx',
  'zg',
  'sjbz',
];

@Injectable()
export class N0425Service {
  constructor(
    @InjectRepository(N0425)
    private readonly n0425Repository: Repository<N0425>,
  ) {}

  async create(data: Partial<N0425>): Promise<N0425> {
    const entity = this.n0425Repository.create(data);
    return await this.n0425Repository.save(entity);
  }

  async findByCondition(condition: Partial<N0425>): Promise<N0425[]> {
    return await this.n0425Repository.find({ where: condition });
  }

  async findByZyid(zyid: string): Promise<Partial<N0425>> {
    const selectFields = N0425_DETAIL_FIELDS.map((field) => `n04_25.${field}`);
    const record = await this.n0425Repository
      .createQueryBuilder('n04_25')
      .select(selectFields)
      .where('n04_25.zyid = :zyid', { zyid })
      .getOne();

    if (!record) {
      throw new NotFoundException(`住院ID ${zyid} 对应的婴儿信息不存在`);
    }

    return record;
  }

  async findOne(zyid: string): Promise<Partial<N0425>> {
    return this.findByZyid(zyid);
  }

  async update(zyid: string, data: Partial<N0425>): Promise<Partial<N0425>> {
    const { zyid: _, ...updateData } = data;
    const result = await this.n0425Repository.update({ zyid }, updateData);
    if (result.affected === 0) {
      throw new NotFoundException(`住院ID ${zyid} 对应的婴儿信息不存在`);
    }
    return this.findOne(zyid);
  }

  async save(data: Partial<N0425>): Promise<Partial<N0425> | N0425> {
    const { zyid } = data;
    if (!zyid) {
      throw new NotFoundException('住院ID不能为空');
    }
    const existing = await this.n0425Repository.findOne({ where: { zyid } });
    if (existing) {
      await this.n0425Repository.update({ zyid }, data);
      return this.findOne(zyid);
    }
    return this.create(data);
  }

  async remove(zyid: string): Promise<void> {
    const result = await this.n0425Repository.delete({ zyid });
    if (result.affected === 0) {
      throw new NotFoundException(`住院ID ${zyid} 对应的婴儿信息不存在`);
    }
  }
}
