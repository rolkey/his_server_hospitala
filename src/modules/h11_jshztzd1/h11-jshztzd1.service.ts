import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, EntityManager } from 'typeorm';
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
    const query = this.h11Jshztzd1Repository
      .createQueryBuilder('h11')
      .select([
        'h11.ksid',
        'h11.zybh',
        'h11.brxm',
        'h11.cycw',
        'h11.zyid',
        'h11.qfbz',
        'h11.hkdz',
        'h11.tjsj',
      ])
      .where('h11.ksid = :ksid', { ksid })
      .andWhere('ISNULL(h11.hdbz, 0) = 0');

    const secondQuery = this.h11Jshztzd1Repository
      .createQueryBuilder()
      .select([
        "'' as ksid",
        'h12.zybh',
        'h11.brxm',
        'h11.rycw as cycw',
        'h11.zyid',
        'h12.yzlx as qfbz',
        "'1' as hkdz",
        'h11.rysj as tjsj',
      ])
      .from(h12_yzxb, 'h12')
      .innerJoin('h11_brxx', 'h11', 'h12.zyid = h11.zyid')
      .where('h11.zyzt < 3')
      .andWhere('h11.cyksid = :ksid', { ksid })
      .andWhere('h12.ysbz = 1')
      .andWhere('h12.tjbz = 1')
      .andWhere("(h12.hdbz = 0 OR (h12.yzlx = 1 AND h12.tzbz = 1 AND ISNULL(h12.jshs, '') = ''))")
      .andWhere(
        'NOT EXISTS (SELECT 1 FROM h11_jshztzd1 WHERE h11_jshztzd1.zyid = h12.zyid AND h11_jshztzd1.qfbz = h12.yzlx AND h11_jshztzd1.hdbz = 0)',
      )
      .andWhere("h12.xmmc NOT IN ('     重 整 医 嘱', '     术 后 医 嘱', '     产 后 医 嘱')");

    const finalQuery = this.h11Jshztzd1Repository
      .createQueryBuilder()
      .select('*')
      .from(`(${query.getQuery()}) UNION ALL (${secondQuery.getQuery()})`, 'result')
      .setParameters({ ...query.getParameters(), ...secondQuery.getParameters() });

    return await finalQuery.getRawMany();
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
