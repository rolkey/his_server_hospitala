import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jbbmicd10 } from './jbbmicd10.entity';
import { Queryjbbmicd10Dto } from './dto';

@Injectable()
export class Jbbmicd10Service {
  constructor(
    @InjectRepository(Jbbmicd10)
    private jbbmicd10Repo: Repository<Jbbmicd10>,
  ) {}

  async findAll(dto: Queryjbbmicd10Dto) {
    const pageSize = dto.pageSize || 20;

    const pageNo = dto.pageNo || 1;

    const queryBuilder = this.jbbmicd10Repo.createQueryBuilder('zd');

    queryBuilder.where(`zd.yxbz='1'`);

    const lxValues = dto.lx
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (lxValues?.length) {
      queryBuilder.andWhere('zd.lx IN (:...lxValues)', { lxValues });
    }

    const value = dto.value?.trim().toUpperCase();
    if (value) {
      queryBuilder.andWhere(
        'zd.pybm LIKE :value OR zd.wbbm LIKE :value OR zd.icd11 LIKE :value OR zd.zwmc LIKE :value',
        { value: `%${value}%` },
      );
    }
    queryBuilder.skip((pageNo - 1) * pageSize).take(pageSize);
    const [pageData, total] = await queryBuilder.getManyAndCount();
    return { pageData, total };
  }
}
