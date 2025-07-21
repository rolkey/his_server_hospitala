import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h12_yzxb } from './h12_yzxb.entity';

@Injectable()
export class h12_yzzbService {
  constructor(
    @InjectRepository(h12_yzzb)
    private h12_yzzbRepo: Repository<h12_yzzb>,
    @InjectRepository(h13_yzzxcs)
    private h13_yzzxcsRepo: Repository<h13_yzzxcs>,
    @InjectRepository(h12_yzxb)
    private h12_yzxb: Repository<h12_yzxb>,
    @InjectRepository(ksmc)
    private ksmcRepo: Repository<ksmc>,
    @InjectRepository(usrcat)
    private usrcatRepo: Repository<usrcat>,
  ) {}

  async findAllByPatient(data: { zyid: string; yzlx: string }) {
    const queryBuilder = this.h12_yzzbRepo
      .createQueryBuilder('h12_yzzb')
      .leftJoinAndSelect('h12_yzzb.cwidEntity', 'cwidEntity')
      .where('h12_yzzb.zyid = :zyid and h12_yzzb.yzlx=:yzlx', {
        zyid: data.zyid,
        yzlx: data.yzlx || '',
      });

    const h13_yzzxcsqb = this.h13_yzzxcsRepo
      .createQueryBuilder('h13_yzzxcs')
      .leftJoinAndSelect('h13_yzzxcs.fylbidEntity', 'h13_fylbidEntity')
      .where('h13_yzzxcs.zyid = :zyid and h13_yzzxcs.yzlx=:yzlx', {
        zyid: data.zyid,
        yzlx: data.yzlx || '',
      })
      .orderBy('h13_yzzxcs.yzxh', 'ASC')
      .addOrderBy('h13_yzzxcs.mxxh', 'ASC');

    const h12_yzxbqb = this.h12_yzxb
      .createQueryBuilder('h12_yzxb')
      .leftJoinAndSelect('h12_yzxb.syffidEntity', 'syffidEntity')
      .leftJoinAndSelect('h12_yzxb.syplidEntity', 'syplidEntity')
      .leftJoinAndSelect('h12_yzxb.fylbidEntity', 'fylbidEntity')
      .where('h12_yzxb.zyid = :zyid and h12_yzxb.yzlx=:yzlx', {
        zyid: data.zyid,
        yzlx: data.yzlx || '',
      })
      .orderBy('h12_yzxb.yzxh', 'ASC')
      .addOrderBy('h12_yzxb.mxxh', 'ASC');

    const [yzzb, h13_yzzxcsList, h12_yzxbList, ksidList, usidList] = await Promise.all([
      queryBuilder.getOne(),
      h13_yzzxcsqb.getMany(),
      h12_yzxbqb.getMany(),
      this.ksmcRepo.find({ select: ['ksid', 'ksmc'] }),
      this.usrcatRepo.find({ select: ['usid', 'unam'] }),
    ]);

    // 构建字典
    const ksmcDict = Object.fromEntries(ksidList.map((item) => [item.ksid, item]));
    const usrcatDict = Object.fromEntries(usidList.map((item) => [item.usid, item]));
    h13_yzzxcsList.forEach((item) => {
      item.ksidEntity = ksmcDict[item.ksid] || null;
      item.zkksidEntity = ksmcDict[item.zkksid] || null;
      item.syridEntity = usrcatDict[item.syrid] || null;
      item.fyridEntity = usrcatDict[item.fyrid] || null;
    });
    h12_yzxbList.forEach((item) => {
      // 找到所有匹配的 h13_yzzxcs
      const matchedH13 = h13_yzzxcsList.filter(
        (h13) => h13.yzxh === item.yzxh && h13.mxxh === item.mxxh,
      );
      item.h13_yzzxcsList = matchedH13;
      // 赋值所有注释掉的 leftJoinAndSelect 关联的字典
      item.ksysEntity = usrcatDict[item.ksys] || null;
      item.kshsEntity = usrcatDict[item.kshs] || null;
      item.jsysEntity = usrcatDict[item.jsys] || null;
      item.lryidEntity = usrcatDict[item.lryid] || null;
      item.hdhsEntity = usrcatDict[item.hdhs] || null;
      item.zxhsEntity = usrcatDict[item.zxhs] || null;
      item.kssxysEntity = usrcatDict[item.kssxys] || null;
      item.kssxhsEntity = usrcatDict[item.kssxhs] || null;
      item.jssxysEntity = usrcatDict[item.jssxys] || null;
      item.jssxhsEntity = usrcatDict[item.jssxhs] || null;
      item.ksidEntity = ksmcDict[item.ksid] || null;
      item.jshsEntity = usrcatDict[item.jshs] || null;
    });
    yzzb.ksidEntity = ksmcDict[yzzb.ksid] || null;
    yzzb.zkksidEntity = ksmcDict[yzzb.zkksid] || null;
    yzzb.tzridEntity = usrcatDict[yzzb.tzrid] || null;
    yzzb.h12_yzxbList = h12_yzxbList;
    return yzzb;
  }
}
