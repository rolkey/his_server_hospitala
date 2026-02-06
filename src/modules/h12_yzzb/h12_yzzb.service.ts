import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, In } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import DateFormater from '@/utils/DateFormater';
import { getSqlWithParameters } from '@/utils/sql-utils';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { h13_djdy } from '../h13_djdy/h13_djdy.entity';

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
  ) { }

  async getPatientListForZyidAndReceipt(data: {
    zyidList: string[];
    yzlxList: string[];
    yzzt?: number;
    yzzxcs?: string;
    dyflid: string;
    yzkssj?: Date;
    yzjssj?: Date;
    tzbz?: number;
    xmmc?: string;
    fylbid?: string;
    lx?: string;
    xsdkssj?: Date;
    xsdjssj?: Date;
    type: string;
    dybz?: number;
  }) {
    // 1. 检查zyidlist是否为空
    if (!data.zyidList || data.zyidList.length === 0) {
      throw new BadRequestException('zyidList不能为空');
    }
    // 过滤掉空的zyid
    const validZyidList = data.zyidList.filter((zyid) => zyid && zyid.trim());
    if (validZyidList.length === 0) return [];
    // 过略医嘱明细表  type = 1
    if (data.type === '1') {
      const h12_yzxbQuery = this.h12_yzxbRepo.createQueryBuilder('h12_yzxb')
        .innerJoinAndSelect('h12_yzxb.syffidEntity', 'syffidEntity')
        .leftJoinAndSelect('h12_yzxb.syplidEntity', 'syplidEntity')
        .leftJoinAndSelect('h12_yzxb.fylbidEntity', 'fylbidEntity')
        .leftJoinAndSelect('h12_yzxb.h11_brxxEntity', 'h11_brxxEntity')
        .where('h12_yzxb.zyid IN (:...zyidlist)', {
          zyidlist: validZyidList,
        });

      if (data.yzlxList && data.yzlxList.length > 0) {
        h12_yzxbQuery.andWhere('h12_yzxb.yzlx IN (:...yzlxList)', {
          yzlxList: data.yzlxList,
        });
      }
      // 添加tzbz（停嘱标志）过滤条件
      if (data.tzbz !== undefined && data.tzbz !== null) {
        h12_yzxbQuery.andWhere('h12_yzxb.tzbz = :tzbz', {
          tzbz: data.tzbz,
        });
      }

      // 添加xmmc（项目名称）过滤条件（包含匹配）
      if (data.xmmc && data.xmmc.trim() !== '') {
        h12_yzxbQuery.andWhere('h12_yzxb.xmmc LIKE :xmmc', {
          xmmc: `%${data.xmmc.trim()}%`,
        });
      }

      // 添加医嘱时间过滤条件
      if (data.yzkssj) {
        h12_yzxbQuery.andWhere('h12_yzxb.yzrq >= :yzkssj', {
          yzkssj: data.yzkssj,
        });
      }
      if (data.yzjssj) {
        h12_yzxbQuery.andWhere('h12_yzxb.yzrq <= :yzjssj', {
          yzjssj: data.yzjssj,
        });
      }
      // if (!isNaN(dyflidNum) && dyflidNum < 5) {
      //   // 添加dyflid过滤条件
      //   h12_yzxbQuery.andWhere('syffidEntity.dyflid = :dyflid', {
      //     dyflid: data.dyflid,
      //   });
      // }
      // 处理执行单
      if (data.type === '1') {
        // 添加fylbid过滤条件
        if (data.fylbid && data.fylbid.trim() !== '' && data.fylbid !== '0') {
          h12_yzxbQuery.andWhere('h12_yzxb.fylbid = :fylbid', {
            fylbid: data.fylbid.trim(),
          });
        }
        // 当lx不为空且不为0时，用lx去匹配过滤h12_yzxb的syffidEntity.dyflid  lx为用法
        if (data.lx && data.lx.trim() !== '' && data.lx !== '0') {
          //dyflid 打印分类
          h12_yzxbQuery.andWhere('syffidEntity.dyflid = :lx', {
            lx: data.lx.trim(),
          });
        }
        // 打印标志过滤：只保留在 h13_djdy 中已登记过的医嘱（pblx='1'，maxid = h12_yzxb.mxxh，zyid 一致）
        if (data.dybz) {
          h12_yzxbQuery.innerJoin(
            h13_djdy,
            'h13_djdy',
            'h13_djdy.pblx = :djdyPblx AND h13_djdy.maxid = h12_yzxb.mxxh AND h13_djdy.zyid = h12_yzxb.zyid',
            { djdyPblx: '1' },
          );
        }
        h12_yzxbQuery.orderBy('h12_yzxb.yzrq', 'ASC')
          .addOrderBy('h12_yzxb.zxcs', 'ASC')
          .addOrderBy('h12_yzxb.mxxh', 'ASC')

        const [h12_yzxbList, ksidList, usidList] = await Promise.all([
          h12_yzxbQuery.getMany(),
          this.ksmcRepo.find({ select: ['ksid', 'ksmc'] }),
          this.usrcatRepo.find({ select: ['usid', 'unam'] }),
          // getYzzxcs(),
        ]);
        const ksmcDict = Object.fromEntries(ksidList.map((item) => [item.ksid, item]));
        const usrcatDict = Object.fromEntries(usidList.map((item) => [item.usid, item]));

        h12_yzxbList.forEach((item) => {
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
        return h12_yzxbList;
      }
    } else {
      const h13_yzzxcsQuery = this.h13_yzzxcsRepo.createQueryBuilder('h13_yzzxcs')
        .innerJoinAndSelect('h13_yzzxcs.h12_yzxb', 'h12_yzxb')
        .leftJoin('h12_yzxb.h11_brxxEntity', 'h11_brxxEntity')
        .leftJoinAndSelect('h12_yzxb.syffidEntity', 'syffidEntity')
        .leftJoinAndSelect('h12_yzxb.syplidEntity', 'syplidEntity')
        .addSelect([
          'h11_brxxEntity.brxm',
          'h11_brxxEntity.rycw',
          // 按需增删 h11_brxx 的其它字段
        ])
        .where('h12_yzxb.zyid IN (:...zyidlist)', {
          zyidlist: validZyidList,
        });
      if (data.yzlxList && data.yzlxList.length > 0) {
        h13_yzzxcsQuery.andWhere('h12_yzxb.yzlx IN (:...yzlxList)', {
          yzlxList: data.yzlxList,
        });
      }

      // 添加tzbz（停嘱标志）过滤条件
      if (data.tzbz !== undefined && data.tzbz !== null) {
        h13_yzzxcsQuery.andWhere('h12_yzxb.tzbz = :tzbz', {
          tzbz: data.tzbz,
        });
      }

      // 添加xmmc（项目名称）过滤条件（包含匹配）
      if (data.xmmc && data.xmmc.trim() !== '') {
        h13_yzzxcsQuery.andWhere('h12_yzxb.xmmc LIKE :xmmc', {
          xmmc: `%${data.xmmc.trim()}%`,
        });
      }
      if (data.type == '2') {
        if (data.fylbid && data.fylbid.trim() !== '' && data.fylbid !== '0') {
          h13_yzzxcsQuery.andWhere('h12_yzxb.fylbid = :fylbid', {
            fylbid: data.fylbid.trim(),
          });
        }
        // 当lx不为空且不为0时，用lx去匹配过滤h12_yzxb的syffidEntity.dyflid  lx为用法
        if (data.lx && data.lx.trim() !== '' && data.lx !== '0') {
          //dyflid 打印分类
          h13_yzzxcsQuery.andWhere('syffidEntity.dyflid = :lx', {
            lx: data.lx.trim(),
          });
        }
        // 打印标志过滤：只保留在 h13_djdy 中已登记过的医嘱（pblx='1'，maxid = h12_yzxb.mxxh，zyid 一致）
        if (data.dybz) {
          h13_yzzxcsQuery.innerJoin(
            h13_djdy,
            'h13_djdy',
            'h13_djdy.pblx = :djdyPblx AND h13_djdy.maxid = h13_yzzxcs.maxid AND h13_djdy.zyid = h13_yzzxcs.zyid',
            { djdyPblx: '1' },
          );
        }

        if (data.xsdkssj) {
          h13_yzzxcsQuery.andWhere('h13_yzzxcs.zxrq >= :xsdkssj', {
            xsdkssj: data.xsdkssj,
          });
        }

        // 添加xsdjssj时间过滤
        if (data.xsdjssj) {
          h13_yzzxcsQuery.andWhere('h13_yzzxcs.zxrq <= :xsdjssj', {
            xsdjssj: data.xsdjssj,
          });
        }
        h13_yzzxcsQuery.orderBy('h13_yzzxcs.zxrq', 'ASC')
          .addOrderBy('h13_yzzxcs.maxid', 'ASC')
      }


      const [h13_yzzxcsList, ksidList, usidList] = await Promise.all([
        h13_yzzxcsQuery.getMany(),
        this.ksmcRepo.find({ select: ['ksid', 'ksmc'] }),
        this.usrcatRepo.find({ select: ['usid', 'unam'] }),
        // getYzzxcs(),
      ]);
      const ksmcDict = Object.fromEntries(ksidList.map((item) => [item.ksid, item]));
      const usrcatDict = Object.fromEntries(usidList.map((item) => [item.usid, item]));

      (h13_yzzxcsList as any).forEach((item) => {
        item.ksysEntity = usrcatDict[item.h12_yzxb.ksys] || null;
        item.kshsEntity = usrcatDict[item.h12_yzxb.kshs] || null;
        item.jsysEntity = usrcatDict[item.h12_yzxb.jsys] || null;
        item.lryidEntity = usrcatDict[item.h12_yzxb.lryid] || null;
        item.hdhsEntity = usrcatDict[item.h12_yzxb.hdhs] || null;
        item.zxhsEntity = usrcatDict[item.h12_yzxb.zxhs] || null;
        item.kssxysEntity = usrcatDict[item.h12_yzxb.kssxys] || null;
        item.kssxhsEntity = usrcatDict[item.h12_yzxb.kssxhs] || null;
        item.jssxysEntity = usrcatDict[item.h12_yzxb.jssxys] || null;
        item.jssxhsEntity = usrcatDict[item.h12_yzxb.jssxhs] || null;
        item.ksidEntity = ksmcDict[item.h12_yzxb.ksid] || null;
        item.jshsEntity = usrcatDict[item.h12_yzxb.jshs] || null;
      });
      return h13_yzzxcsList;
    }
  }

  async findAllByPatient(data: { zyid: string; yzlx: string; yzzt?: string; yzzxcs?: string }) {
    const h12YzzbQuery = this.h12_yzzbRepo
      .createQueryBuilder('h12_yzzb')
      .leftJoinAndSelect('h12_yzzb.cwidEntity', 'cwidEntity')
      .where('h12_yzzb.zyid = :zyid and h12_yzzb.yzlx=:yzlx', {
        zyid: data.zyid,
        yzlx: data.yzlx ?? '',
      });

    const h12YzxbQuery = this.h12_yzxbRepo
      .createQueryBuilder('h12_yzxb')
      .leftJoinAndSelect('h12_yzxb.syffidEntity', 'syffidEntity')
      .leftJoinAndSelect('h12_yzxb.syplidEntity', 'syplidEntity')
      .leftJoinAndSelect('h12_yzxb.fylbidEntity', 'fylbidEntity')
      .where('h12_yzxb.zyid = :zyid and h12_yzxb.yzlx = :yzlx', {
        zyid: data.zyid,
        yzlx: data.yzlx || '',
      })
      .orderBy('h12_yzxb.yzrq', 'ASC')
      .addOrderBy('h12_yzxb.zxcs', 'ASC')
      .addOrderBy('h12_yzxb.mxxh', 'ASC')
      .addOrderBy('h12_yzxb.typbz', 'ASC');

    if (data.yzzt) {
      h12YzxbQuery.andWhere('h12_yzxb.yzzt IN (:...yzzt)', { yzzt: data.yzzt.split(',') });
    }

    const [yzzb, h12_yzxbList, ksidList, usidList] = await Promise.all([
      h12YzzbQuery.getOne(),
      h12YzxbQuery.getMany(),
      this.ksmcRepo.find({ select: ['ksid', 'ksmc'] }),
      this.usrcatRepo.find({ select: ['usid', 'unam'] }),
    ]);
    if (!yzzb) return null;

    // 构建字典
    const ksmcDict = Object.fromEntries(ksidList.map((item) => [item.ksid, item]));
    const usrcatDict = Object.fromEntries(usidList.map((item) => [item.usid, item]));
    h12_yzxbList.forEach((item) => {
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
