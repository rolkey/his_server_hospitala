import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import dayjs from 'dayjs';

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
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
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

  /**
   * 创建新医嘱记录
   * @param data { zyid: string, yzlx: number }
   * @returns 新增的医嘱记录对象
   */
  async createAdvice(data: { zyid: string; yzlx: number }): Promise<h12_yzxb> {
    const { zyid, yzlx } = data;

    // 1. 获取病人信息
    const patientInfo = await this.h11_brxxRepo.findOne({
      where: { zyid },
      select: [
        'zycs',
        'brxm',
        'brnl',
        'etys',
        'cyksid',
        'cybs',
        'rycw',
        'xbid',
        'nldw',
        'nldw1',
        'zybh',
        'zkksid',
      ],
    });

    if (!patientInfo) {
      throw new Error('没有该住院号的入院信息!');
    }

    // 2. 检查医嘱类型限制
    if (yzlx === 1 || yzlx === 2 || yzlx === 6) {
      const existingAdvice = await this.h12_yzzbRepo.findOne({
        where: { zyid, yzlx, tzbz: 0 },
      });

      if (existingAdvice) {
        throw new Error(
          yzlx === 1
            ? '长期医嘱没有停止，请先停止再开新医嘱!'
            : '临时医嘱没有停止，请先停止再开新医嘱!',
        );
      }
    }

    // 3. 获取新的医嘱序号
    const maxYzxh = await this.h12_yzzbRepo
      .createQueryBuilder('h12_yzzb')
      .select('MAX(h12_yzzb.yzxh)', 'max')
      .where('h12_yzzb.zyid = :zyid AND h12_yzzb.yzlx = :yzlx', { zyid, yzlx })
      .getRawOne();

    const yzxhNew = (maxYzxh.max || 0) + 1;

    // 4. 计算病人年龄
    let brnl = patientInfo.brnl || '';
    if (patientInfo.etys > 0) {
      brnl = `${brnl}${patientInfo.nldw || ''}${patientInfo.etys}${patientInfo.nldw1 || ''}`;
    }

    // 5. 创建新医嘱记录
    const newRecord = new h12_yzxb();

    Object.assign(newRecord, {
      zyid,
      zybh: patientInfo.zybh,
      zycs: patientInfo.zycs,
      yzlx,
      bsid: patientInfo.xbid,
      kbid: patientInfo.zkksid,
      yzxh: yzxhNew,
      brxm: patientInfo.brxm,
      brnl: brnl,
      etys: patientInfo.etys,
      ksid: patientInfo.cyksid,
      cwid: patientInfo.rycw,
      jsbz: 0,
      tzbz: 0,
      yzrq: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ksidEntity: await this.ksmcRepo.findOne({ where: { ksid: patientInfo.cyksid } }),
      zkksidEntity: await this.ksmcRepo.findOne({ where: { ksid: patientInfo.zkksid } }),
    });

    return newRecord;
  }
}
