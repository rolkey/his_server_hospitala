import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H22Sfjl } from './h22_sfjl.entity';
import { CreateH22SfjlDto, UpdateH22SfjlDto, QueryH22SfjlDto } from './h22_sfjl.dto';

@Injectable()
export class H22SfjlService {
  constructor(
    @InjectRepository(H22Sfjl)
    private readonly repo: Repository<H22Sfjl>,
  ) {}

  // async create(dto: CreateH22SfjlDto) {
  //   const entity = this.repo.create(dto as any);
  //   return this.repo.save(entity);
  // }

  async findAll(queryDto: QueryH22SfjlDto) {
    const { pageNo = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const queryBuilder = this.repo.createQueryBuilder('sfjl');

    // 添加过滤条件
    if (filters.sfyid) {
      queryBuilder.andWhere('sfjl.usid = :sfyid', { sfyid: filters.sfyid });
    }
    if (filters.startDate) {
      queryBuilder.andWhere('sfjl.rq >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      queryBuilder.andWhere('sfjl.rq <= :endDate', {
        endDate: filters.endDate,
      });
    }

    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return { pageData, total };
  }

  async findOne(lsh: string) {
    return this.repo.findOne({ where: { lsh } });
  }

  // async update(lsh: string, dto: UpdateH22SfjlDto) {
  //   await this.repo.update({ lsh }, dto as any);
  //   return this.findOne(lsh);
  // }

  // async remove(lsh: string) {
  //   await this.repo.delete({ lsh });
  //   return { lsh, deleted: true };
  // }
}
