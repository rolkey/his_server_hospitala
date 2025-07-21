import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { csxz } from './csxz.entity';

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
}
