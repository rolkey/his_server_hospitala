import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { csxz } from './csxz.entity';
import { CsxzQueryDto, QueryBaseCsxzDto } from './dto/csxz-query-dto';

@Injectable()
export class csxzService {
  constructor(
    @InjectRepository(csxz)
    private csxzRepo: Repository<csxz>,
  ) {}

  findAllSpecial() {
    return this.csxzRepo.find({ where: { yxbz: 1, lx: '特殊人群' } });
  }
  findAllChannel() {
    return this.csxzRepo.find({ where: { yxbz: 1, lx: '媒介渠道' } });
  }
  // findAllSkinTest() {
  //   return this.csxzRepo.find({ where: { yxbz: 1, lx: '皮试结果' } })
  // }
  findAllAdmissionRoute() {
    return [
      {
        name: '急诊',
        data: '1',
      },
      {
        name: '门诊',
        data: '2',
      },
      {
        name: '其他医疗机构转入',
        data: '3',
      },
      {
        name: '其他',
        data: '9',
      },
    ];
  }

  findAllPersonnelCategory() {
    return this.csxzRepo.find({ where: { yxbz: 1, lx: '病人所属' } });
  }

  async findAll(queryDto: QueryBaseCsxzDto) {
    const { pageSize = 10, pageNo = 1, lx, bz2, value } = queryDto;
    const where = { yxbz: 1, lx };
    if (bz2) where['bz2'] = bz2;
    if (value) where['name'] = Like('%' + value + '%');

    const [pageData, total] = await this.csxzRepo.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });

    return { total, pageData };
  }
}
