import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H11Zypj } from './h11_zypj.entity';
import {
  CreateH11ZypjDto,
  UpdateH11ZypjDto,
  H11ZypjQueryDto,
  H11ZypjPrimaryDto,
} from './h11_zypj.dto';

@Injectable()
export class H11ZypjService {
  constructor(
    @InjectRepository(H11Zypj)
    private readonly h11ZypjRepository: Repository<H11Zypj>,
  ) {}

  async create(createH11ZypjDto: CreateH11ZypjDto): Promise<H11Zypj> {
    const entity = this.h11ZypjRepository.create(createH11ZypjDto);
    return await this.h11ZypjRepository.save(entity);
  }

  async findAll(queryDto: H11ZypjQueryDto): Promise<{ items: H11Zypj[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.h11ZypjRepository.createQueryBuilder('zypj');

    // 添加过滤条件
    if (filters.pjlxid) {
      queryBuilder.andWhere('zypj.pjlxid = :pjlxid', { pjlxid: filters.pjlxid });
    }
    if (filters.usid) {
      queryBuilder.andWhere('zypj.usid = :usid', { usid: filters.usid });
    }
    if (filters.fyid) {
      queryBuilder.andWhere('zypj.fyid = :fyid', { fyid: filters.fyid });
    }
    if (filters.pjlxmc) {
      queryBuilder.andWhere('zypj.pjlxmc LIKE :pjlxmc', { pjlxmc: `%${filters.pjlxmc}%` });
    }
    if (filters.kshm) {
      queryBuilder.andWhere('zypj.kshm = :kshm', { kshm: filters.kshm });
    }

    const [items, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { items, total };
  }

  async findOne(h11ZypjPrimaryDto: H11ZypjPrimaryDto): Promise<H11Zypj> {
    const { pjlxid, usid, fyid } = h11ZypjPrimaryDto;
    const found = await this.h11ZypjRepository.findOne({
      where: { pjlxid, usid, fyid },
    });

    if (!found) {
      throw new NotFoundException(`票据记录 pjlxid=${pjlxid}, usid=${usid}, fyid=${fyid} 不存在`);
    }

    return found;
  }

  async getCurrentNumber(h11ZypjPrimaryDto: H11ZypjPrimaryDto): Promise<{ dqhm: string }> {
    const { pjlxid, usid, fyid } = h11ZypjPrimaryDto;
    const found = await this.h11ZypjRepository.findOne({
      where: { pjlxid, usid, fyid },
    });

    if (!found) {
      throw new NotFoundException(`票据记录 pjlxid=${pjlxid}, usid=${usid}, fyid=${fyid} 不存在`);
    }

    // 转换为字符串并去除首尾空格
    const strNumber = String(found.dqhm).trim();
    // 前补0到20位长度
    const paddedString = '0'.repeat(20) + strNumber;

    return { dqhm: paddedString.slice(-found.pjcd) };
  }

  async update(
    pjlxid: string,
    usid: string,
    fyid: string,
    updateH11ZypjDto: UpdateH11ZypjDto,
  ): Promise<H11Zypj> {
    const result = await this.h11ZypjRepository.update({ pjlxid, usid, fyid }, updateH11ZypjDto);

    if (result.affected === 0) {
      throw new NotFoundException(`票据记录 pjlxid=${pjlxid}, usid=${usid}, fyid=${fyid} 不存在`);
    }

    const h11ZypjPrimaryDto: H11ZypjPrimaryDto = { pjlxid, usid, fyid };
    return this.findOne(h11ZypjPrimaryDto);
  }

  async remove(pjlxid: string, usid: string, fyid: string): Promise<void> {
    const result = await this.h11ZypjRepository.delete({ pjlxid, usid, fyid });

    if (result.affected === 0) {
      throw new NotFoundException(`票据记录 pjlxid=${pjlxid}, usid=${usid}, fyid=${fyid} 不存在`);
    }
  }

  async findByKshm(kshm: string): Promise<H11Zypj[]> {
    return this.h11ZypjRepository.find({ where: { kshm } });
  }

  async getStatistics(): Promise<{ totalTypes: number; totalRecords: number }> {
    const totalTypes = await this.h11ZypjRepository
      .createQueryBuilder('zypj')
      .select('COUNT(DISTINCT zypj.pjlxid)', 'count')
      .getRawOne();

    const totalRecords = await this.h11ZypjRepository.count();

    return {
      totalTypes: parseInt(totalTypes.count, 10),
      totalRecords,
    };
  }
}
