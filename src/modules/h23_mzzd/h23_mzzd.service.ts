import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H23Mzzd } from './h23_mzzd.entity';

@Injectable()
export class H23MzzdService {
  constructor(
    @InjectRepository(H23Mzzd)
    private readonly h23MzzdRepository: Repository<H23Mzzd>,
  ) {}

  /**
   * 根据门诊ID(mzid)查询门诊诊断列表
   */
  async findByMzid(mzid: string): Promise<H23Mzzd[]> {
    if (!mzid) {
      return [];
    }
    return this.h23MzzdRepository
      .createQueryBuilder('h23_mzzd')
      .where('h23_mzzd.mzid = :mzid', { mzid })
      .orderBy('h23_mzzd.zdxh', 'ASC')
      .getMany();
  }
}
