import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import DateFormater from '@/utils/DateFormater';
import { GyIdentityService } from '../gy_identity/gy-identity.service';

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
    private readonly gyIdentityService: GyIdentityService,
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
    const h12_yzzb_record = await this.getYzzb(patientInfo, zyid, yzlx);

    const yzxhNew = h12_yzzb_record.yzxh || 1;

    // 4. 计算病人年龄
    let brnl = patientInfo.brnl || '';
    if (patientInfo.etys > 0) {
      brnl = `${brnl}${patientInfo.nldw || ''}${patientInfo.etys}${patientInfo.nldw1 || ''}`;
    }

    // 5. 创建新医嘱记录
    const newRecord = new h12_yzxb();

    Object.assign(newRecord, {
      zyid,
      mxxh: await this.gyIdentityService.getMax('h12_yzxbn'),
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
      yzrq: DateFormater.formatDate(new Date().toString()),
      //   ksidEntity: await this.ksmcRepo.findOne({ where: { ksid: patientInfo.cyksid } }),
      //   zkksidEntity: await this.ksmcRepo.findOne({ where: { ksid: patientInfo.zkksid } }),
      srcs: 1,
      kyts: 1,
      kyfs: 1,
      yzzh: 0,
      tpbz: 0, //附加标志
      hdbz: 0,
    });

    return newRecord;
  }

  /**
   * 获取医嘱主表
   * @param zyid 住院ID
   * @param yzlx 医嘱类型
   * @returns 入院信息结果
   */
  async getYzzb(patientInfo: h11_brxx, zyid: string, yzlx: number): Promise<h12_yzzb> {
    // 1. 查询患者基本信息

    // 处理年龄信息
    const brnl = patientInfo.brnl || '';
    const nldw = patientInfo.nldw || '';
    const nldw1 = patientInfo.nldw1 || '';
    let ageStr = `${brnl}${nldw}`;

    if (patientInfo.etys > 0) {
      ageStr += `${patientInfo.etys}${nldw1}`;
    }

    // 2. 获取最大医嘱序号
    const h12_yzzb_record = await this.h12_yzzbRepo
      .createQueryBuilder('h12_yzzb')
      .select([
        'zyid',
        'zybh',
        'zycs',
        'yzlx',
        'bsid',
        'kbid',
        'yzxh',
        'brxm',
        'brnl',
        'etys',
        'ksid',
        'cwid',
        'jsbz',
        'tzbz',
        'yzrq',
      ])
      .where('h12_yzzb.zyid = :zyid', { zyid })
      .andWhere('h12_yzzb.yzlx = :yzlx', { yzlx })
      .andWhere('h12_yzzb.ksid = :ksid', { ksid: patientInfo.cyksid.toUpperCase() })
      .getRawOne();

    if (h12_yzzb_record) {
      return h12_yzzb_record;
    }

    // 3. 准备主表数据
    const zbData = {
      zyid,
      zybh: patientInfo.zybh,
      zycs: patientInfo.zycs,
      yzlx,
      bsid: patientInfo.xbid,
      kbid: patientInfo.zkksid,
      yzxh: 1,
      brxm: patientInfo.brxm,
      brnl: ageStr,
      etys: patientInfo.etys,
      ksid: patientInfo.cyksid.toUpperCase(), // 转为大写
      cwid: patientInfo.rycw,
      jsbz: 0,
      tzbz: 0,
      yzrq: DateFormater.formatDate(new Date().toString()), // 使用dayjs格式化日期
    };

    // 4. 保存主表数据 - 使用h12_yzzb表
    const zbRecord = this.h12_yzzbRepo.create(zbData);
    await this.h12_yzzbRepo.save(zbRecord);

    return zbRecord;
  }
}
