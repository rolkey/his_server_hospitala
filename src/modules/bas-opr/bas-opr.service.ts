import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { BasOpr } from './bas-opr.entity';
import { CreateBasOprDto, QueryBasOprDto, UpdateBasOprDto } from './dto/bas-opr.dto';

@Injectable()
export class BasOprService {
  constructor(
    @InjectRepository(BasOpr)
    private readonly basOprRepository: Repository<BasOpr>,
  ) {}

  async create(createDto: CreateBasOprDto): Promise<BasOpr> {
    const newOpr = this.basOprRepository.create(createDto);
    return await this.basOprRepository.save(newOpr);
  }

  async findAll(queryDto: QueryBasOprDto): Promise<{ total: number; data: BasOpr[] }> {
    const { pageSize = 10, pageNo = 1, ...conditions } = queryDto;
    const where = {};

    // 构建查询条件
    Object.keys(conditions).forEach((key) => {
      if (conditions[key]) {
        if (typeof conditions[key] === 'string') {
          where[key] = Like(`%${conditions[key]}%`);
        } else {
          where[key] = conditions[key];
        }
      }
    });

    const [data, total] = await this.basOprRepository.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });

    return { total, data };
  }

  async findOne(oprId: number): Promise<BasOpr> {
    return await this.basOprRepository.findOne({ where: { oprId } });
  }

  async update(oprId: number, updateDto: UpdateBasOprDto): Promise<BasOpr> {
    await this.basOprRepository.update(oprId, updateDto);
    return await this.findOne(oprId);
  }

  async remove(oprId: number): Promise<void> {
    await this.basOprRepository.delete(oprId);
  }
}
