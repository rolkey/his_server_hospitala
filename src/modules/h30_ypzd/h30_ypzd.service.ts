// src/modules/h30_ypzd/h30_ypzd.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H30_ypzd } from './h30_ypzd.entity';
import { CreateH30_ypzdDto, UpdateH30_ypzdDto, QueryH30_ypzdDto } from './h30_ypzd.dto';

@Injectable()
export class H30_ypzdService {
  constructor(
    @InjectRepository(H30_ypzd)
    private readonly h30YpzdRepository: Repository<H30_ypzd>,
  ) {}

  async create(createDto: CreateH30_ypzdDto): Promise<H30_ypzd> {
    const entity = this.h30YpzdRepository.create(createDto);
    return await this.h30YpzdRepository.save(entity);
  }

  async findAll(query: QueryH30_ypzdDto): Promise<[H30_ypzd[], number]> {
    const { pageNo = 1, pageSize = 10, ...where } = query;
    return await this.h30YpzdRepository.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });
  }

  async findOne(ypid: string): Promise<H30_ypzd | null> {
    return await this.h30YpzdRepository.findOne({ where: { ypid } });
  }

  async update(ypid: string, updateDto: UpdateH30_ypzdDto): Promise<void> {
    await this.h30YpzdRepository.update(ypid, updateDto);
  }

  async remove(ypid: string): Promise<void> {
    await this.h30YpzdRepository.delete(ypid);
  }
}
