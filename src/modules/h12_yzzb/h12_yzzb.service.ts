import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import DateFormater from '@/utils/DateFormater';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';

@Injectable()
export class h12_yzzbService {
  constructor(
    @InjectRepository(h12_yzzb)
    private h12_yzzbRepo: Repository<h12_yzzb>,
    @InjectRepository(h13_yzzxcs)
    private h13_yzzxcsRepo: Repository<h13_yzzxcs>,
    @InjectRepository(h12_yzxb)
    private h12_yzxbRepo: Repository<h12_yzxb>,
    @InjectRepository(ksmc)
    private ksmcRepo: Repository<ksmc>,
    @InjectRepository(usrcat)
    private usrcatRepo: Repository<usrcat>,
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
    @InjectRepository(h00_sypl)
    private h00_syplRepo: Repository<h00_sypl>,
    private readonly gyIdentityService: GyIdentityService,
  ) {}

  async getPatientListForZyidAndReceipt(data: { zyidList: string[]; yzlxList: string[]; yzzt?: number; yzzxcs?: string; dyflid: string }) {
    // 1. 检查zyidlist是否为空
    if (!data.zyidList || data.zyidList.length === 0) {
      throw new BadRequestException('zyidList不能为空');
    }
    // 2. 检查dyflid是否为空
    if (!data.dyflid || data.dyflid.trim() === '') {
      throw new BadRequestException('dyflid不能为空');
    }

    // 过滤掉空的zyid
    const validZyidList = data.zyidList.filter(zyid => zyid && zyid.trim());
    if (validZyidList.length === 0) return [];

    // 1. 查询符合条件的yzzb列表（多个病人）
    // const queryBuilder = this.h12_yzzbRepo
    //   .createQueryBuilder('h12_yzzb')
    //   .leftJoinAndSelect('h12_yzzb.cwidEntity', 'cwidEntity')
    //   .where('h12_yzzb.zyid IN (:...zyidlist) and h12_yzzb.yzlx=:yzlx', {
    //     zyidlist: validZyidList,
    //     yzlx: data.yzlx ?? '',
    //   });
      const queryBuilder = this.h12_yzzbRepo
      .createQueryBuilder('h12_yzzb')
      .leftJoinAndSelect('h12_yzzb.cwidEntity', 'cwidEntity')
      .where('h12_yzzb.zyid IN (:...zyidlist)', {
        zyidlist: validZyidList
      });
      //如果yzlxlist不为空，添加yzlx过滤条件
      if (data.yzlxList && data.yzlxList.length > 0) {
        queryBuilder.andWhere('h12_yzzb.yzlx IN (:...yzlxList)', {
          yzlxList: data.yzlxList,
        });
      }

    // 2. 查询符合条件的yzxb列表（带dyflid过滤）
    const h12_yzxbqb = this.h12_yzxbRepo
      .createQueryBuilder('h12_yzxb')
      // 使用innerJoinAndSelect确保只返回syffid不为空的记录
      .innerJoinAndSelect('h12_yzxb.syffidEntity', 'syffidEntity')
      .leftJoinAndSelect('h12_yzxb.syplidEntity', 'syplidEntity')
      .leftJoinAndSelect('h12_yzxb.fylbidEntity', 'fylbidEntity')
      .where('h12_yzxb.zyid IN (:...zyidlist)', {
        zyidlist: validZyidList
      });
    
    // 当dyflid值不为5时，添加dyflid过滤条件
    if (data.dyflid !== '5') {
      // 添加dyflid过滤条件
      h12_yzxbqb.andWhere('syffidEntity.dyflid = :dyflid', {
        dyflid: data.dyflid,
      });
    }
    
    h12_yzxbqb.orderBy('h12_yzxb.yzrq', 'ASC')
      .addOrderBy('h12_yzxb.zxcs', 'ASC')
      .addOrderBy('h12_yzxb.mxxh', 'ASC')
      .addOrderBy('h12_yzxb.typbz', 'ASC');

      //如果yzlxList不为空，添加yzlx过滤条件
      if (data.yzlxList && data.yzlxList.length > 0) {
        h12_yzxbqb.andWhere('h12_yzxb.yzlx IN (:...yzlxList)', {
          yzlxList: data.yzlxList,
        });
      }

    if (data.yzzt == 1) {
      h12_yzxbqb.andWhere(' (h12_yzxb.yzzt=:yzzt or h12_yzxb.ysbz=0)  ', { yzzt: data.yzzt });
    }

    // 3. 查询yzzxcs列表
    const getYzzxcs = async () => {
      if (data.yzzxcs === '1') {
        const h13_yzzxcsqb = this.h13_yzzxcsRepo
          .createQueryBuilder('h13_yzzxcs')
          .leftJoinAndSelect('h13_yzzxcs.h00_fylb', 'h00_fylb')
          .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
          .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh'])
          .leftJoin('h13_yzzxcs.H31Lyjl', 'H31Lyjl')
          .addSelect([
            'H31Lyjl.djbh',
            'H31Lyjl.tjbz',
            'H31Lyjl.ckclbz',
            'H31Lyjl.ksid',
            'H31Lyjl.fhksid',
          ])
          .where('h13_yzzxcs.zyid IN (:...zyidlist)', {
            zyidlist: validZyidList
          })
          .orderBy('h13_yzzxcs.yzxh', 'ASC')
          .addOrderBy('h13_yzzxcs.mxxh', 'ASC');

          //如果yzlxList不为空，添加yzlx过滤条件
          if (data.yzlxList && data.yzlxList.length > 0) {
            h13_yzzxcsqb.andWhere('h13_yzzxcs.yzlx IN (:...yzlxList)', {
              yzlxList: data.yzlxList,
            });
          }

        return await h13_yzzxcsqb.getMany();
      }
      return [];
    };

    // 4. 并行执行所有查询
    const [yzzbList, h12_yzxbList, ksidList, usidList, h13_yzzxcsList] = await Promise.all([
      queryBuilder.getMany(),
      h12_yzxbqb.getMany(),
      this.ksmcRepo.find({ select: ['ksid', 'ksmc'] }),
      this.usrcatRepo.find({ select: ['usid', 'unam'] }),
      getYzzxcs(),
    ]);

    if (yzzbList.length === 0) return [];

    // 5. 构建字典
    const ksmcDict = Object.fromEntries(ksidList.map((item) => [item.ksid, item]));
    const usrcatDict = Object.fromEntries(usidList.map((item) => [item.usid, item]));

    // 6. 处理h13_yzzxcsList
    h13_yzzxcsList.forEach((item) => {
      item.ksidEntity = ksmcDict[item.ksid] || null;
      item.zkksidEntity = ksmcDict[item.zkksid] || null;
      item.syridEntity = usrcatDict[item.syrid] || null;
      item.fyridEntity = usrcatDict[item.fyrid] || null;
    });

    // 7. 按zyid分组处理yzxbList
    const yzxbByZyid: Record<string, h12_yzxb[]> = {};
    h12_yzxbList.forEach((item) => {
      if (!yzxbByZyid[item.zyid]) {
        yzxbByZyid[item.zyid] = [];
      }
      
      // 找到所有匹配的 h13_yzzxcs
      const matchedH13 = h13_yzzxcsList.filter(
        (h13) => h13.zyid === item.zyid && h13.yzxh === item.yzxh && h13.mxxh === item.mxxh,
      );
      item.h13_yzzxcsList = matchedH13;
      
      // 赋值所有关联的字典
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
      
      yzxbByZyid[item.zyid].push(item);
    });

    // 8. 组装最终结果
    const result = yzzbList.map(yzzb => {
      // 为每个yzzb分配对应的yzxb列表
      const patientYzxbList = yzxbByZyid[yzzb.zyid] || [];
      
      // 完善yzzb的关联信息
      yzzb.ksidEntity = ksmcDict[yzzb?.ksid] || null;
      yzzb.zkksidEntity = ksmcDict[yzzb?.zkksid] || null;
      yzzb.tzridEntity = usrcatDict[yzzb?.tzrid] || null;
      yzzb.h12_yzxbList = patientYzxbList;
      
      return yzzb;
    });

    return result;
  }



  async findAllByPatient(data: { zyid: string; yzlx: string; yzzt?: number; yzzxcs?: string }) {
    const queryBuilder = this.h12_yzzbRepo
      .createQueryBuilder('h12_yzzb')
      .leftJoinAndSelect('h12_yzzb.cwidEntity', 'cwidEntity')
      .where('h12_yzzb.zyid = :zyid and h12_yzzb.yzlx=:yzlx', {
        zyid: data.zyid,
        yzlx: data.yzlx ?? '',
      });

    const h12_yzxbqb = this.h12_yzxbRepo
      .createQueryBuilder('h12_yzxb')
      .leftJoinAndSelect('h12_yzxb.syffidEntity', 'syffidEntity')
      .leftJoinAndSelect('h12_yzxb.syplidEntity', 'syplidEntity')
      .leftJoinAndSelect('h12_yzxb.fylbidEntity', 'fylbidEntity')
      .where('h12_yzxb.zyid = :zyid and h12_yzxb.yzlx=:yzlx', {
        zyid: data.zyid,
        yzlx: data.yzlx || '',
      })
      .orderBy('h12_yzxb.yzrq', 'ASC')
      .addOrderBy('h12_yzxb.zxcs', 'ASC')
      .addOrderBy('h12_yzxb.mxxh', 'ASC')
      .addOrderBy('h12_yzxb.typbz', 'ASC');

    if (data.yzzt == 1) {
      h12_yzxbqb.andWhere(' (h12_yzxb.yzzt=:yzzt or h12_yzxb.ysbz=0)  ', { yzzt: data.yzzt });
    }
    const getYzzxcs = async () => {
      if (data.yzzxcs === '1') {
        const h13_yzzxcsqb = this.h13_yzzxcsRepo
          .createQueryBuilder('h13_yzzxcs')
          .leftJoinAndSelect('h13_yzzxcs.h00_fylb', 'h00_fylb')
          .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
          .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh'])
          .leftJoin('h13_yzzxcs.H31Lyjl', 'H31Lyjl')
          .addSelect([
            'H31Lyjl.djbh',
            'H31Lyjl.tjbz',
            'H31Lyjl.ckclbz',
            'H31Lyjl.ksid',
            'H31Lyjl.fhksid',
          ])
          .where('h13_yzzxcs.zyid = :zyid and h13_yzzxcs.yzlx=:yzlx', {
            zyid: data.zyid,
            yzlx: data.yzlx || '',
          })
          .orderBy('h13_yzzxcs.yzxh', 'ASC')
          .addOrderBy('h13_yzzxcs.mxxh', 'ASC');
        return await h13_yzzxcsqb.getMany();
      }
      return [];
    };

    const [yzzb, h12_yzxbList, ksidList, usidList, h13_yzzxcsList] = await Promise.all([
      queryBuilder.getOne(),
      h12_yzxbqb.getMany(),
      this.ksmcRepo.find({ select: ['ksid', 'ksmc'] }),
      this.usrcatRepo.find({ select: ['usid', 'unam'] }),
      getYzzxcs(),
    ]);
    if (!yzzb) return null;

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
    yzzb.ksidEntity = ksmcDict[yzzb?.ksid] || null;
    yzzb.zkksidEntity = ksmcDict[yzzb?.zkksid] || null;
    yzzb.tzridEntity = usrcatDict[yzzb?.tzrid] || null;
    yzzb.h12_yzxbList = h12_yzxbList;
    return yzzb;
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
    const h12_yzzbObj = {
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
    const zbRecord = this.h12_yzzbRepo.create(h12_yzzbObj);
    await this.h12_yzzbRepo.save(zbRecord);

    return zbRecord;
  }

  // 辅助方法
  private async deleteExecutedOrder(
    yzxh: number,
    zyid: string,
    yzlx: number,
    mxxh: number,
  ): Promise<void> {
    await this.h13_yzzxcsRepo.delete({
      yzxh,
      zyid,
      yzlx,
      mxxh,
    });
  }
}
