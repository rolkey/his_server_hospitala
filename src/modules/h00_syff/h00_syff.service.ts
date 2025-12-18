import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { h00_syff } from './h00_syff.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';

@Injectable()
export class h00_syffService {
  constructor(
    @InjectRepository(h00_syff)
    private h00_syffRepo: Repository<h00_syff>,
  ) {}

  findAll() {
    return this.h00_syffRepo.find({});
  }

  async findOne(syffid: string) {
    return this.h00_syffRepo.findOne({ where: { syffid: syffid } });
  }

  async findAllFiltered(as_ksid: string) {
    // 使用 QueryBuilder 来构建复杂的带有子查询的条件 [7,8](@ref)
    const queryBuilder = this.h00_syffRepo
      .createQueryBuilder('h00_syff')
      .leftJoinAndSelect(
        'h00_syff.h00_xmzd',
        'h00_xmzd',
        'h00_syff.xmid = h00_xmzd.xmid and h00_xmzd.xmzl = 1',
      )
      //   .leftJoinAndSelect(
      //     H00_xmzd,
      //     'h00_xmzd',
      //     'h00_syff.xmid = h00_xmzd.xmid and h00_xmzd.xmzl = 1',
      //   )
      .select([
        'h00_syff.syffid',
        'h00_syff.syffmc',
        'h00_syff.szbm',
        'h00_syff.pybm',
        'h00_syff.wbbm',
        'h00_syff.qtbm',
        'h00_syff.xmid',
        'h00_syff.dyflid',
        'h00_syff.xmid1',
        'h00_xmzd.xmmc',
      ])
      .where('ISNULL(h00_syff.zybz, 1) = 1')
      .andWhere(
        `(ISNULL(h00_syff.xmid1, '1') = '1' OR
         (h00_syff.xmid1 = '2' AND h00_syff.syffid IN (
           SELECT h00_syffxm.syffid
           FROM h00_syffxm
           WHERE h00_syffxm.syffid = h00_syff.syffid
           AND h00_syffxm.ksid = :as_ksid
         )))`,
      )
      .setParameter('as_ksid', as_ksid)
      .orderBy('h00_syff.szbm'); // 添加排序条件，按 szbm 升序排序
    //   .addOrderBy('h00_syff.syffid'); // 可选：添加二级排序条件;

    return await queryBuilder.getMany();
  }
}
