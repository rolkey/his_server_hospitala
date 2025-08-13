import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { ksmc } from './ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';

@Injectable()
export class ksmcService {
  constructor(
    @InjectRepository(ksmc)
    private ksmcRepo: Repository<ksmc>,
  ) {}

  async findHisDept(queryDto: { usid?: string; usrcats?: boolean; zc?: string }) {
    const queryBuilder = this.ksmcRepo
      .createQueryBuilder('ksmc')
      .leftJoinAndSelect('ksmc.fyxxEntity', 'fyxxEntity')
      .where(
        `CONVERT(CHAR(2),ksmc.ksid ) = '01' and exists(select 1 from __ksry ksry where ksry.ksid = ksmc.ksid and ksry.syid='12'  AND ksry.usid =:usid)`,
        { usid: queryDto.usid || '9999' },
      );
    // 根据 usrcats 的值决定是否查询用户分类信息
    if (queryDto.usrcats) {
      queryBuilder
        .leftJoinAndSelect('ksmc.usrcats', 'usrcat')
        .leftJoinAndSelect(
          'usrcat.zcidEntity',
          'zcidEntity',
          `${queryDto.zc ? `CONVERT(CHAR(2),zcidEntity.zcid ) = :zc` : ''}`,
          { zc: queryDto.zc },
        )
        .select([
          'ksmc.ksid',
          'ksmc.ksmc',
          'usrcat.usid',
          'usrcat.unam',
          'zcidEntity.zcid',
          'zcidEntity.zcmc',
          'fyxxEntity.fyid',
          'fyxxEntity.fymc',
        ]);
    } else {
      queryBuilder.select(['ksmc.ksid', 'ksmc.ksmc', 'fyxxEntity.fyid', 'fyxxEntity.fymc']);
    }

    const data = await queryBuilder.getMany();

    if (queryDto.zc) {
      return data.map((item) => ({
        ...item,
        usrcats: item?.usrcats?.filter((usrcat) => usrcat.zcidEntity) || [],
      }));
    } else {
      return data;
    }
  }

  findAll() {
    return this.ksmcRepo
      .createQueryBuilder('ksmc')
      .leftJoinAndSelect('ksmc.fyxxEntity', 'fyxxEntity')
      .select([
        'ksmc.ksid',
        'ksmc.ksmc',
        'ksmc.pybm',
        'ksmc.wbbm',
        'fyxxEntity.fyid',
        'fyxxEntity.fymc',
      ])
      .getMany();
  }

  findWard() {
    return this.ksmcRepo
      .createQueryBuilder('ksmc')
      .where('ksmc.ksflid = :ksflid', { ksflid: '01' })
      .andWhere("isnull(ksmc.ksfl,'0') in ('0','1')")
      .andWhere('isnull(ksmc.sjbz,1) = 1')
      .getMany();
  }

  findHospitalizedDept() {
    return this.ksmcRepo
      .createQueryBuilder('ksmc')
      .where('ksmc.ksflid = :ksflid', { ksflid: '01' })
      .andWhere("isnull(ksmc.ksfl,'0') in ('0','2')")
      .andWhere('isnull(ksmc.sjbz,1) = 1')
      .getMany();
  }
}
