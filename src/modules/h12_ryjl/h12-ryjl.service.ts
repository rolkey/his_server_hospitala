import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { H12Ryjl } from './h12_ryjl.entity';
import { CreateH12RyjlDto, UpdateH12RyjlDto, QueryH12RyjlDto } from './h12_ryjl.dto';

@Injectable()
export class H12RyjlService {
  constructor(
    @InjectRepository(H12Ryjl)
    private readonly h12RyjlRepository: Repository<H12Ryjl>,
  ) {}

  // 创建记录
  async create(createDto: CreateH12RyjlDto): Promise<H12Ryjl> {
    const entity = this.h12RyjlRepository.create(createDto);
    return await this.h12RyjlRepository.save(entity);
  }

  // 分页查询
  async findAll(queryDto: QueryH12RyjlDto): Promise<[H12Ryjl[], number]> {
    const {
      pageNo = 1,
      pageSize = 10,
      startDate,
      endDate,
      sortBy = 'lrsj',
      sortOrder = 'DESC',
      ...where
    } = queryDto;

    return await this.h12RyjlRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });
  }

  // 根据复合主键查询单条记录
  async findOne(zyid: string, lx: string): Promise<H12Ryjl> {
    return await this.h12RyjlRepository.findOne({ where: { zyid, lx } });
  }

  // 更新记录
  async update(zyid: string, lx: string, updateDto: UpdateH12RyjlDto): Promise<H12Ryjl> {
    await this.h12RyjlRepository.update({ zyid, lx }, updateDto);
    return await this.findOne(zyid, lx);
  }

  // 删除单条记录
  async remove(zyid: string, lx: string): Promise<void> {
    await this.h12RyjlRepository.delete({ zyid, lx });
  }

  // 批量删除
  async removeBatch(ids: Array<{ zyid: string; lx: string }>): Promise<void> {
    await this.h12RyjlRepository.delete(ids);
  }
}
