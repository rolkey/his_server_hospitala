import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, EntityManager } from 'typeorm';
import { SmSssq } from './sm-sssq.entity';
import { CreateSmSssqDto, UpdateSmSssqDto, QuerySmSssqDto } from './dto/sm-sssq.dto';

@Injectable()
export class SmSssqService {
  constructor(
    @InjectRepository(SmSssq)
    private readonly smSssqRepository: Repository<SmSssq>,
  ) {}

  async create(createDto: CreateSmSssqDto): Promise<SmSssq> {
    const entity = this.smSssqRepository.create(createDto);
    return await this.smSssqRepository.save(entity);
  }

  async findAll(queryDto: QuerySmSssqDto): Promise<[SmSssq[], number]> {
    const { pageNo = 1, pageSize = 10, sortBy, sortOrder = 'ASC', ...rest } = queryDto;
    const where = {};

    // Build dynamic where conditions
    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined && rest[key] !== null) {
        if (typeof rest[key] === 'string') {
          where[key] = Like(`%${rest[key]}%`);
        } else if (rest[key] instanceof Date) {
          // Handle date range queries if needed
          where[key] = rest[key];
        } else {
          where[key] = rest[key];
        }
      }
    });

    const order = sortBy ? { [sortBy]: sortOrder } : undefined;

    return await this.smSssqRepository.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order,
    });
  }

  async findOne(sqdh: number): Promise<SmSssq> {
    return await this.smSssqRepository.findOne({
      where: { sqdh },
    });
  }

  async update(updateDto: UpdateSmSssqDto): Promise<SmSssq> {
    const { sqdh, ...updateData } = updateDto;
    await this.smSssqRepository.update({ sqdh }, updateData);
    return this.findOne(sqdh);
  }

  async remove(sqdh: number): Promise<void> {
    await this.smSssqRepository.delete({ sqdh });
  }
}
