import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H15Ssjxxb } from './h15-ssjxxb.entity';

@Injectable()
export class H15SsjxxbService {
  constructor(
    @InjectRepository(H15Ssjxxb)
    private readonly h15SsjxxbRepository: Repository<H15Ssjxxb>,
  ) {}

  /**
   * 不分页查询列表
   */
  async findAll(): Promise<H15Ssjxxb[]> {
    return this.h15SsjxxbRepository.find({
      order: { ssjid: 'ASC' },
    });
  }
}
