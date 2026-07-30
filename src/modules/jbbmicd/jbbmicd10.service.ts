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
  ) { }
  async findAll(dto: Queryjbbmicd10Dto) {
    const pageSize = dto.pageSize || 50;

    const pageNo = dto.pageNo || 1;

    const lxList = dto.lx.split(',');

    const queryBuilder = this.jbbmicd10Repo.createQueryBuilder('zd');

    queryBuilder.where(`zd.yxbz='1'`)

    queryBuilder.andWhere(`zd.lx in (:...lxList)`, { lxList })

    const value = dto?.value?.trim();
    if (value) {
      queryBuilder.andWhere(
        ' (zd.pybm LIKE :value OR zd.wbbm LIKE :value OR zd.bzbm LIKE :value OR zd.bzmc LIKE :bzmc OR zd.ybmc LIKE :bzmc) ',
        { value: `%${value}%`, bzmc: `${value}%` },
      )
    }

    queryBuilder.skip((pageNo - 1) * pageSize).take(pageSize);

    const baseBuilder = this.jbbmicd10Repo.createQueryBuilder('zd')

    const [[pageData, total], jbbmicd] = await Promise.all([
      queryBuilder.getManyAndCount(),
      baseBuilder.where(`zd.yxbz='1'`)
        .andWhere(`zd.lx in (:...lxList)`, { lxList })
        .andWhere(
          ' (zd.pybm=:value OR zd.wbbm =:value OR zd.bzbm =:value OR zd.bzmc=:value) ',
          { value: `${value}` },
        ).getMany()
    ])

    if (jbbmicd) pageData.unshift(...jbbmicd)

    return { pageData, total };
  }
}
