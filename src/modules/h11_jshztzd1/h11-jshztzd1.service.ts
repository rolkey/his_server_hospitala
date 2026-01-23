import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, EntityManager, DataSource } from 'typeorm';
import { H11Jshztzd1 } from './h11-jshztzd1.entity';
import {
  CreateH11Jshztzd1Dto,
  UpdateH11Jshztzd1Dto,
  QueryH11Jshztzd1Dto,
} from './h11-jshztzd1.dto';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';

@Injectable()
export class H11Jshztzd1Service {
  constructor(
    @InjectRepository(h12_yzxb)
    private readonly h12_yzxxbRepository: Repository<h12_yzxb>,

    @InjectRepository(H11Jshztzd1)
    private readonly h11Jshztzd1Repository: Repository<H11Jshztzd1>,

    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateH11Jshztzd1Dto): Promise<H11Jshztzd1> {
    const entity = this.h11Jshztzd1Repository.create(createDto);
    return await this.h11Jshztzd1Repository.save(entity);
  }

  async findAll(queryDto: QueryH11Jshztzd1Dto): Promise<[H11Jshztzd1[], number]> {
    const { pageNo = 1, pageSize = 10, ...rest } = queryDto;
    const where = {};

    // Build dynamic where conditions
    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined && rest[key] !== null) {
        if (typeof rest[key] === 'string') {
          where[key] = Like(`%${rest[key]}%`);
        } else {
          where[key] = rest[key];
        }
      }
    });

    return await this.h11Jshztzd1Repository.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });
  }

  async findOne(zyid: string, ksid: string, qfbz: number): Promise<H11Jshztzd1> {
    return await this.h11Jshztzd1Repository.findOne({
      where: { zyid, ksid, qfbz },
    });
  }

  async queryMessages(ksid: string): Promise<any[]> {
    // 使用 queryRunner 执行原生 SQL
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      const sql = `
      SELECT h11_jshztzd1.ksid,
             h11_jshztzd1.zybh,
             h11_jshztzd1.brxm,
             h11_jshztzd1.cycw,
             h11_jshztzd1.zyid,
             h11_jshztzd1.qfbz,
             h11_jshztzd1.hkdz,
             h11_jshztzd1.tjsj
        FROM h11_jshztzd1
       WHERE (h11_jshztzd1.ksid = @0)
         AND isnull(h11_jshztzd1.hdbz, 0) = 0
      union all
      select distinct '',
                      h12_yzxb.zybh,
                      h11_brxx.brxm,
                      h11_brxx.rycw,
                      h11_brxx.zyid,
                      h12_yzxb.yzlx,
                      '1',
                      h11_brxx.rysj
        from h12_yzxb,
             h11_brxx
       where h12_yzxb.zyid = h11_brxx.zyid
         and h11_brxx.zyzt < 3
         and h11_brxx.cyksid = @1
         and h12_yzxb.ysbz = 1
         and h12_yzxb.tjbz = 1
         and ((h12_yzxb.hdbz = 0) or
             (h12_yzxb.yzlx = 1 and h12_yzxb.tzbz = 1 and isnull(h12_yzxb.jshs, '') = ''))
         and not exists (select *
                from h11_jshztzd1
               where h11_jshztzd1.zyid = h12_yzxb.zyid
                 and h11_jshztzd1.qfbz = h12_yzxb.yzlx
                 and h11_jshztzd1.hdbz = 0)
         and (h12_yzxb.xmmc <> '     重 整 医 嘱' and h12_yzxb.xmmc <> '     术 后 医 嘱' and
             h12_yzxb.xmmc <> '     产 后 医 嘱')
    `;

      return await queryRunner.query(sql, [ksid, ksid]);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    zyid: string,
    ksid: string,
    qfbz: number,
    updateDto: UpdateH11Jshztzd1Dto,
  ): Promise<H11Jshztzd1> {
    await this.h11Jshztzd1Repository.update({ zyid, ksid, qfbz }, updateDto);
    return this.findOne(zyid, ksid, qfbz);
  }

  async remove(zyid: string, ksid: string, qfbz: number): Promise<void> {
    await this.h11Jshztzd1Repository.delete({ zyid, ksid, qfbz });
  }

  async updateOrCreateRecord(
    params: {
      zyid: string;
      gstr_ainf: { u_ksid: string; u_userid: string };
      yzlx: number;
      ldt_sj: Date;
      cycw: string;
      zybh: string;
      brxm: string;
      qfbz: number;
    },
    manager?: EntityManager,
  ): Promise<void> {
    const { zyid, gstr_ainf, yzlx, ldt_sj, cycw, zybh, brxm, qfbz } = params;

    // 保存旧系统护士站提示临时表
    const h11Jshztzd1Repository = manager?.getRepository(H11Jshztzd1) || this.h11Jshztzd1Repository;
    // 检查记录是否存在
    const count = await h11Jshztzd1Repository.count({
      where: {
        zyid: zyid,
        ksid: gstr_ainf.u_ksid,
        qfbz: yzlx === 0 ? undefined : yzlx,
      },
    });

    if (count > 0) {
      // 更新现有记录
      await h11Jshztzd1Repository.update(
        {
          zyid,
          ksid: gstr_ainf.u_ksid,
          qfbz: yzlx === 0 ? undefined : yzlx,
        },
        {
          tjsj: ldt_sj,
          hdbz: 0,
          tjry: gstr_ainf.u_userid,
          cycw,
        },
      );
    } else {
      // 创建新记录
      const newRecord = h11Jshztzd1Repository.create({
        zyid,
        ksid: gstr_ainf.u_ksid,
        qfbz: yzlx,
        zybh,
        brxm,
        cycw,
        hkdz: String(qfbz),
        tjsj: ldt_sj,
        tjbz: 1,
        tjry: gstr_ainf.u_userid,
      });
      await h11Jshztzd1Repository.save(newRecord);
    }
  }
}
