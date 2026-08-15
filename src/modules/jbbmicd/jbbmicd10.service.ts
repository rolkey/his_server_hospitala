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
    const pageSize = dto.pageSize || 60;
    const pageNo = dto.pageNo || 1;
    const lxList = dto.lx.split(',');
    const value = dto?.value?.trim();

    const queryBuilder = this.jbbmicd10Repo.createQueryBuilder('zd');
    queryBuilder.where('zd.yxbz = :yxbz', { yxbz: '1' })
      .andWhere('zd.lx IN (:...lxList)', { lxList });

    if (value) {
      // 1. 筛选条件保持不变
      queryBuilder.andWhere(
        `(zd.pybm LIKE :value OR zd.wbbm LIKE :value OR zd.bzbm LIKE :value OR zd.bzmc LIKE :bzmc OR zd.ybmc LIKE :bzmc)`,
        { value: `%${value}%`, bzmc: `%${value}%` }
      );

      // 2. 核心优化：使用 CASE WHEN 让精确匹配的记录排在最前面
      // 如果 bzmc 完全等于 value，返回 0（优先级最高）；否则返回 1
      queryBuilder.addOrderBy(
        `CASE WHEN zd.bzmc = :exactValue THEN 0 ELSE 1 END`,
        'ASC'
      );

      // 3. 二级排序：按拼音或常规字段排序
      queryBuilder.addOrderBy('zd.pybm', 'ASC');

      // 传入精确匹配的参数
      queryBuilder.setParameter('exactValue', value);
    }

    // 4. 正常分页，不再需要 baseBuilder 和 unshift
    queryBuilder.skip((pageNo - 1) * pageSize).take(pageSize);

    const [pageData, total] = await queryBuilder.getManyAndCount();

    return { pageData, total };
  }
}
