import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h21_brxx } from './h21-brxx.entity';

@Injectable()
export class h21_brxxService {
  constructor(
    @InjectRepository(h21_brxx)
    private readonly h21BrxxRepo: Repository<h21_brxx>,
  ) {}

  /**
   * 根据门诊ID(mzid)查询病人信息
   */
  async findOneByMzid(mzid: string): Promise<h21_brxx | null> {
    if (!mzid) {
      return null;
    }

    return this.h21BrxxRepo.findOne({
      where: { mzid },
      relations: ['Jbbmicd10Entity', 'kfysidEntity', 'ksidEntity', 'fyidEntity'],
    });
  }
}
