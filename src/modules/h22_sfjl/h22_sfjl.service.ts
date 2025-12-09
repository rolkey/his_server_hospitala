import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { H22Sfjl } from './h22_sfjl.entity';
import {
  CreateH22SfjlDto,
  UpdateH22SfjlDto,
  QueryH22SfjlDto,
  QueryCheckoutDateDto,
} from './h22_sfjl.dto';
import { ParamService } from '../h12_xmzd/service/param.service';
import { log } from 'console';
import * as dayjs from 'dayjs';

@Injectable()
export class H22SfjlService {
  constructor(
    @InjectRepository(H22Sfjl)
    private readonly repo: Repository<H22Sfjl>,
    private readonly paramService: ParamService,
    private dataSource: DataSource,
  ) {}

  // async create(dto: CreateH22SfjlDto) {
  //   const entity = this.repo.create(dto as any);
  //   return this.repo.save(entity);
  // }

  async findAll(queryDto: QueryH22SfjlDto) {
    const { pageNo = 1, pageSize = 10, ...filters } = queryDto;
    const skip = (pageNo - 1) * pageSize;

    const queryBuilder = this.repo.createQueryBuilder('sfjl');

    // 添加过滤条件
    if (filters.sfyid) {
      queryBuilder.andWhere('sfjl.usid = :sfyid', { sfyid: filters.sfyid });
    }
    if (filters.startDate) {
      queryBuilder.andWhere('sfjl.rq >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      queryBuilder.andWhere('sfjl.rq <= :endDate', {
        endDate: filters.endDate,
      });
    }

    const [pageData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

    return { pageData, total };
  }

  async findOne(lsh: string) {
    return this.repo.findOne({ where: { lsh } });
  }

  async findCheckoutDate(dto: QueryCheckoutDateDto) {
    const userId = dto.sfyid;
    const bz = dto.bz;

    const sfjzbz = await this.paramService.gfGetParaNew(
      22,
      'sfjzbz',
      '0',
      '门诊住院收费结账标志(0合并,1分开)',
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let start_by = null;
    let start_by1 = null;
    try {
      if (sfjzbz == '0') {
        const h22_sfjl = await queryRunner.query(
          `SELECT Top 1 jsbz FROM h22_sfjl Where usid = @0 Order By rq Desc`,
          [userId],
        );
        const jsbz = h22_sfjl[0].jsbz || 0;
        if (jsbz == 0) {
          const h22Item = await queryRunner.query(
            `SELECT Min(sfrq) as sfrq FROM h22_fpzb Where sfrid = @0`,
            [userId],
          );
          const h11Item = await queryRunner.query(
            `SELECT Min(sfrq) as sfrq FROM h11_fpzb Where sfrid = @0`,
            [userId],
          );
          start_by = h22Item[0].sfrq;
          start_by1 = h11Item[0].sfrq;
          if (!start_by && !start_by1) {
            start_by = new Date();
            start_by.setHours(0, 0, 0, 0);
          } else if (!start_by && start_by1) {
            start_by = start_by1;
          } else if (start_by && start_by1) {
            if (start_by > start_by1) {
              start_by = start_by1;
            }
          }
          start_by.setHours(0, 0, 0, 0);
        } else if (jsbz == 1) {
          const startItem = await queryRunner.query(
            `SELECT Max(s_date) start FROM h22_sfjl  Where usid = @0`,
            [userId],
          );
          start_by = startItem[0].start;
        } else {
          const startItem = await queryRunner.query(
            `SELECT Max(e_date) start FROM h22_sfjl  Where usid = @0`,
            [userId],
          );
          start_by = startItem[0].start;
        }
      } else {
        if (bz == '1') {
          const jzbzItem = await queryRunner.query(
            `SELECT Top 1 jsbz FROM h22_sfjl  Where usid = @0 and isnull(jslx,0) in (0,1) Order By rq Desc`,
            [userId],
          );
          const jsbz = jzbzItem[0].jsbz || 0;
          if (!jsbz || jsbz == 0) {
            const startItem = await queryRunner.query(
              `SELECT Min(sfrq) as sfrq FROM h22_fpzb Where sfrid = @0`,
              [userId],
            );
            start_by = startItem[0].sfrq;
            start_by.setHours(0, 0, 0, 0);
          } else {
            const startItem = await queryRunner.query(
              `SELECT Max(e_date) as sfrq FROM h22_sfjl Where usid = @0 and isnull(jslx,0) in (0,1)`,
              [userId],
            );
            start_by = startItem[0].sfrq;
          }
        } else {
          const jzbzItem = await queryRunner.query(
            `SELECT Top 1 jsbz FROM h22_sfjl  Where usid = @0 and isnull(jslx,0) in (0,2) Order By rq Desc `,
            [userId],
          );
          const jsbz = jzbzItem[0].jsbz || 0;
          if (!jsbz || jsbz == 0) {
            const startItem = await queryRunner.query(
              `SELECT Min(sfsj) sfsj FROM h11_fpzb Where sfyid = @0`,
              [userId],
            );
            start_by1 = startItem[0].sfsj;
            start_by1.setHours(0, 0, 0, 0);
            start_by = start_by1;
            const start1Item = await queryRunner.query(
              `select min(sfsj) sfsj from h11_yjk where sfyid=@0`,
              [userId],
            );
            start_by1 = startItem[0].sfsj;
            if (!start_by || start_by > start_by1) {
              start_by = start_by1;
            }
          } else {
            const startItem = await queryRunner.query(
              `SELECT Max(e_date) as sfsj FROM h22_sfjl  Where usid = @0 and isnull(jslx,0) in (0,2)`,
              [userId],
            );
            start_by = startItem[0].sfsj;
          }
        }
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return { startDate: dayjs(start_by).format('YYYY-MM-DD HH:mm:ss') };
  }

  // async update(lsh: string, dto: UpdateH22SfjlDto) {
  //   await this.repo.update({ lsh }, dto as any);
  //   return this.findOne(lsh);
  // }

  // async remove(lsh: string) {
  //   await this.repo.delete({ lsh });
  //   return { lsh, deleted: true };
  // }
}
