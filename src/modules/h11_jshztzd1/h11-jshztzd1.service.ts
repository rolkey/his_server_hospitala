import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { H11Jshztzd1 } from './h11-jshztzd1.entity';
import {
  CreateH11Jshztzd1Dto,
  UpdateH11Jshztzd1Dto,
  QueryH11Jshztzd1Dto,
} from './h11-jshztzd1.dto';

@Injectable()
export class H11Jshztzd1Service {
  constructor(
    @InjectRepository(H11Jshztzd1)
    private readonly h11Jshztzd1Repository: Repository<H11Jshztzd1>,
  ) {}

  async create(createDto: CreateH11Jshztzd1Dto): Promise<H11Jshztzd1> {
    const entity = this.h11Jshztzd1Repository.create(createDto);
    return await this.h11Jshztzd1Repository.save(entity);
  }

  async findAll(queryDto: QueryH11Jshztzd1Dto): Promise<[H11Jshztzd1[], number]> {
    const { pageNo = 1, pageSize = 10, ...rest } = queryDto;
    const where = {};

    // Build dynamic where conditions
    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined && rest[key] !== null) {
        if (typeof rest[key] === 'string') {
          where[key] = Like(`%${rest[key]}%`);
        } else {
          where[key] = rest[key];
        }
      }
    });

    return await this.h11Jshztzd1Repository.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });
  }

  async findOne(zyid: string, ksid: string, qfbz: number): Promise<H11Jshztzd1> {
    return await this.h11Jshztzd1Repository.findOne({
      where: { zyid, ksid, qfbz },
    });
  }

  async update(
    zyid: string,
    ksid: string,
    qfbz: number,
    updateDto: UpdateH11Jshztzd1Dto,
  ): Promise<H11Jshztzd1> {
    await this.h11Jshztzd1Repository.update({ zyid, ksid, qfbz }, updateDto);
    return this.findOne(zyid, ksid, qfbz);
  }

  async remove(zyid: string, ksid: string, qfbz: number): Promise<void> {
    await this.h11Jshztzd1Repository.delete({ zyid, ksid, qfbz });
  }
}
