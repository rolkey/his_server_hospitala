import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { Createh13_yzzxcsDto, Updateh13_yzzxcsDto } from './dto/h13_yzzxcs.dto';

@Injectable()
export class h13_yzzxcsService {
  constructor(
    @InjectRepository(h13_yzzxcs)
    private readonly h13_yzzxcsRepository: Repository<h13_yzzxcs>,
  ) {}

  async findAll(): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsRepository.find();
  }

  async findOne(conditions: any): Promise<h13_yzzxcs> {
    return this.h13_yzzxcsRepository.findOne({ where: conditions });
  }

  async create(createDto: Createh13_yzzxcsDto): Promise<h13_yzzxcs> {
    const record = this.h13_yzzxcsRepository.create(createDto);
    return this.h13_yzzxcsRepository.save(record);
  }

  async update(conditions: any, updateDto: Updateh13_yzzxcsDto): Promise<h13_yzzxcs> {
    await this.h13_yzzxcsRepository.update(conditions, updateDto);
    return this.h13_yzzxcsRepository.findOne({ where: conditions });
  }

  async delete(conditions: any): Promise<void> {
    await this.h13_yzzxcsRepository.delete(conditions);
  }

  async findByZyid(zyid: string): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsRepository.find({ where: { zyid } });
  }

  async findByYzxh(yzxh: number): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsRepository.find({ where: { yzxh } });
  }
}
