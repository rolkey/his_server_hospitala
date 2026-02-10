import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In, DataSource, Between, Like, Equal, Not } from 'typeorm';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { CreateH13YzzxcsDto, H13YzzxcsResponseDto, UpdateH13YzzxcsDto } from './dto/h13-yzzxcs.dto';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { H13YzzxcsTfResponseDto } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.dto';
import { plainToInstance } from 'class-transformer';
import { getCompleteSqlWithParameters, getSqlWithParameters } from '@/utils/sql-utils';
import DateFormater from '@/utils/DateFormater';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';

@Injectable()
export class h13_yzzxcsService {
  //   private readonly logger = new Logger(h13_yzzxcsService.name);

  constructor(
    @InjectRepository(h13_yzzxcs)
    private readonly h13YzzxcsRepository: Repository<h13_yzzxcs>,
    @InjectRepository(h12_yzxb)
    private readonly h12yzxbRepository: Repository<h12_yzxb>,
    @InjectRepository(H13YzzxcsTf)
    private readonly h13YzzxcsTfRepository: Repository<H13YzzxcsTf>,

    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<h13_yzzxcs[]> {
    return this.h13YzzxcsRepository.find();
  }

  async findOne(conditions: any): Promise<h13_yzzxcs> {
    return this.h13YzzxcsRepository.findOne({ where: conditions });
  }

  async create(createDto: CreateH13YzzxcsDto): Promise<h13_yzzxcs> {
    const record = this.h13YzzxcsRepository.create(createDto);
    return this.h13YzzxcsRepository.save(record);
  }

  async update(conditions: any, updateDto: UpdateH13YzzxcsDto): Promise<h13_yzzxcs> {
    await this.h13YzzxcsRepository.update(conditions, updateDto);
    return this.h13YzzxcsRepository.findOne({ where: conditions });
  }

  async delete(conditions: any): Promise<void> {
    await this.h13YzzxcsRepository.delete(conditions);
  }

  async findByZyid(zyid: string): Promise<h13_yzzxcs[]> {
    return this.h13YzzxcsRepository.find({ where: { zyid } });
  }

  async findByYzxh(yzxh: number): Promise<h13_yzzxcs[]> {
    return this.h13YzzxcsRepository.find({ where: { yzxh } });
  }

  /**
   * 费用查询
   * @param data
   * @returns
   */
  async queryByYzzh(data: {
    zyid: string;
    yzzhs?: number[];
    rq?: Date[];
    xmmc?: string;
    yzlx?: number;
  }): Promise<h13_yzzxcs[]> {
    const { zyid, yzzhs } = data;
    const queryBuilder = this.h13YzzxcsRepository
      .createQueryBuilder('h13_yzzxcs')
      .leftJoinAndSelect('h13_yzzxcs.h00_fylb', 'h00_fylb')
      .leftJoin('h13_yzzxcs.xmidEntity', 'xmidEntity')
      .addSelect(['xmidEntity.xmid', 'xmidEntity.xmmc', 'xmidEntity.ggxh'])
      .leftJoin('h13_yzzxcs.h13YzzxcsTfList', 'h13YzzxcsTf')
      .addSelect(['h13YzzxcsTf.fydh', 'h13YzzxcsTf.clbz', 'h13YzzxcsTf.fybz'])
      .leftJoin('h13_yzzxcs.h31Lyjl', 'H31Lyjl')
      .addSelect([
        'H31Lyjl.djbh',
        'H31Lyjl.tjbz',
        'H31Lyjl.ckclbz',
        'H31Lyjl.ksid',
        'H31Lyjl.fhksid',
      ])
      .where({
        zyid,
      }); // 驳回医嘱不进行退费操作
    if (yzzhs && yzzhs.length > 0) {
      queryBuilder.andWhere('h13_yzzxcs.yzzh IN (:...yzzh)', { yzzh: yzzhs });
    }
    if (data.rq && data.rq.length > 0) {
      queryBuilder.andWhere('h13_yzzxcs.zxrq BETWEEN :start AND :end', {
        start: data.rq[0],
        end: data.rq[1],
      });
    }
    if (data.yzlx) {
      queryBuilder.andWhere('h13_yzzxcs.yzlx = :yzlx', { yzlx: data.yzlx });
    }
    // 从关联表 xmidEntity 中查询 xmmc
    if (data.xmmc) {
      queryBuilder.andWhere('xmidEntity.xmmc LIKE :xmmc', { xmmc: `%${data.xmmc}%` });
    }

    return await queryBuilder.getMany();
  }

  // 撤回退费：没有领药单
  async revokeRefund(data: { zyid: string; maxids: number[] }): Promise<void> {
    // 删除退费单
    await this.dataSource.transaction(async (manager) => {
      try {
        await manager.delete('h13_yzzxcs_tf', { zyid: data.zyid, zxcs2: In(data.maxids) });
        await manager.update(h13_yzzxcs, { zyid: data.zyid, maxid: In(data.maxids) }, { bzxcs: 0 });
      } catch (error) {
        console.error('执行错误：', error);
        throw error;
      }
    });
  }

  // 撤回退费领药单：有领药单没有发药，已经有领药单
  async revokeRefundMedicineReceipt(data: { zyid: string; maxids: number[] }): Promise<void> {
    // 撤回发药单号
    const h13YzzxcsTfList = await this.h13YzzxcsTfRepository.find({
      where: { zyid: data.zyid, zxcs2: In(data.maxids), clbz: 0 },
    });
    if (h13YzzxcsTfList.length === 0) return; // 没有退费单
    // 删除领药单与领药明细
    const fhdys = h13YzzxcsTfList.map((item) => item.fydh);
    await this.dataSource.transaction(async (manager) => {
      await Promise.all([
        manager.update(h13_yzzxcs, { zyid: data.zyid, fydh: In(fhdys) }, { clbz: 0, fydh: null }),
        manager.update(H13YzzxcsTf, { zyid: data.zyid, fydh: In(fhdys) }, { clbz: 0, fydh: null }),
        manager.delete('h31_lyjl', { zyid: data.zyid, djbh: In(fhdys) }),
        manager.delete('h31_lymx', { zyid: data.zyid, djbh: In(fhdys) }),
      ]);
    });
  }

  async generateTempDataNurse(data: {
    zyid: string;
    yzzhs: string;
  }): Promise<H13YzzxcsResponseDto[]> {
    const { zyid, yzzhs } = data;
    const yzzhArray = yzzhs.split(',').map(Number);

    // 按医嘱检查待停医嘱及医嘱时间
    const h13YzzxcsTfListQuery = this.h13YzzxcsTfRepository
      .createQueryBuilder('tf')
      //   .select(['tf', 'h.tzrq', 'h.mrcs', 'h.yzzh'])
      .leftJoinAndSelect('tf.h12_yzxbs', 'h')
      .where('tf.zyid = :zyid', { zyid })
      .andWhere('tf.yzxh = 1')
      .andWhere('tf.yzzh in (:...yzzh)', { yzzh: yzzhArray })
      .andWhere('tf.yzlx = 1')
      .andWhere('h.yzzt in (1, 5)')
      .andWhere('CAST("tf"."zxrq" AS DATE) >= CAST("h"."tzrq" AS DATE)');

    const h13YzzxcsListQuery = this.h13YzzxcsRepository
      .createQueryBuilder('fy')
      //   .select(['fy', 'h.tzrq', 'h.mrcs', 'h.yzzh', 'h.yzxh', 'h.mxxh', 'h.yzlx', 'h.zyid'])
      //   .select(['fy', 'h.tzrq', 'h.mrcs', 'h.yzzh'])
      .leftJoin('fy.h12_yzxb', 'h12_yzxb')
      .leftJoin('h12_yzxb.syplidEntity', 'h00_sypl')
      .leftJoin('fy.h00_fylb', 'h00_fylb')
      .addSelect([
        // 'h13', // 选择 h13 的所有字段
        'h12_yzxb.xmmc',
        'h12_yzxb.tzrq',
        'h12_yzxb.mrcs',
        'h00_sypl.syplmc',
        'h00_fylb.fylbmc',
      ])
      .where('fy.zyid = :zyid', { zyid })
      .andWhere('fy.yzzh in (:...yzzh)', { yzzh: yzzhArray })
      .andWhere('fy.yzxh = 1')
      .andWhere('fy.yzlx = 1')
      //   .andWhere({ h12_yzxb: { yzzt: Not(7) } })
      .andWhere('h12_yzxb.yzzt in (1, 5)')
      .andWhere('CAST("fy"."zxrq" AS DATE) >= CAST("h12_yzxb"."tzrq" AS DATE)')
      .orderBy('fy.zxrq', 'ASC')
      .addOrderBy('fy.yzzh', 'ASC')
      .addOrderBy('fy.mxxh', 'ASC'); // 添加排序，ASC表示升序

    const [h13YzzxcsTfList, h13YzzxcsList] = await Promise.all([
      h13YzzxcsTfListQuery.getMany(),
      h13YzzxcsListQuery.getMany(),
    ]);

    // 首先按yzzh进行分组
    const groupedByYzzh = h13YzzxcsList.reduce(
      (acc, item) => {
        const { yzzh } = item.h12_yzxb;
        if (!acc[yzzh]) {
          acc[yzzh] = [];
        }
        acc[yzzh].push(item);
        return acc;
      },
      {} as Record<string, typeof h13YzzxcsList>,
    );

    const h13Yzzxcss = [];
    // 对每个分组进行处理
    for (const yzzh in groupedByYzzh) {
      const group = groupedByYzzh[yzzh];
      // 取第一个项目的tzrq和mrcs（假设同一分组内的这些值是相同的）
      const { tzrq, mrcs } = group[0].h12_yzxb;

      const truncTzrq = new Date(tzrq);
      truncTzrq.setHours(0, 0, 0, 0); // 去掉时分秒

      const transformedData = this.getYzzxcsFees(group, h13YzzxcsTfList, truncTzrq, mrcs);
      h13Yzzxcss.push(...transformedData);
    }

    return h13Yzzxcss.filter((yzzxcs) => yzzxcs.sjtysl > 0);
  }

  /**
   *
   * @param zyid
   * @param yzxh
   * @param yzlx
   * @param yzzh
   * @param zxrq
   * @param mrcs 可能的值：0,1,2,9(9是全部)
   * @param gstr_ainf
   * @returns
   */
  async generateTempData(
    zyid: string,
    yzxh: number,
    yzlx: number,
    yzzh: number[],
    zxrq: string,
    mrcs: number,
    gstr_ainf: { u_userid: string },
  ): Promise<H13YzzxcsResponseDto[]> {
    const tzrq = new Date(); // 对应PB9中的ldt_sj
    const targetDate = new Date(zxrq);
    targetDate.setHours(0, 0, 0, 0);
    if (!mrcs && mrcs !== 0) {
      mrcs = 9; // 默认全部用完
    }

    // 使用QueryBuilder进行精确的日期比较
    const h13YzzxcsTfListQuery = this.h13YzzxcsTfRepository
      .createQueryBuilder('tf')
      .where('tf.zyid = :zyid', { zyid })
      .andWhere('tf.yzxh = :yzxh', { yzxh })
      .andWhere('tf.yzlx = :yzlx', { yzlx })
      .andWhere('tf.yzzh IN (:...yzzh)', { yzzh })
      .andWhere('tf.zxrq >= :zxrq', { zxrq: targetDate });

    const h13YzzxcsListQuery = this.h13YzzxcsRepository
      .createQueryBuilder('h13')
      .leftJoin('h13.h12_yzxb', 'h12_yzxb')
      .leftJoin('h12_yzxb.syplidEntity', 'h00_sypl')
      .leftJoin('h13.h00_fylb', 'h00_fylb')
      .addSelect([
        // 'h13', // 选择 h13 的所有字段
        'h12_yzxb.xmmc', // 只选择 h12_yzxb 的 xmmc 字段
        'h00_sypl.syplmc',
        'h00_fylb.fylbmc', // 只选择 h00_fylb 的 xmmc 字段
      ])
      .where('h13.zyid = :zyid', { zyid })
      .andWhere('h13.yzxh = :yzxh', { yzxh })
      .andWhere('h13.yzlx = :yzlx', { yzlx })
      .andWhere('h13.yzzh IN (:...yzzh)', { yzzh })
      //   .andWhere('h13.fybz = 1')
      //   .andWhere('h13.clbz = 1')
      .andWhere('h13.zxrq >= :zxrq', { zxrq: targetDate })
      .orderBy('h13.zxrq', 'ASC')
      .addOrderBy('h13.yzzh', 'ASC')
      .addOrderBy('h13.mxxh', 'ASC'); // 添加排序，ASC表示升序

    const [h13YzzxcsTfList, h13YzzxcsList] = await Promise.all([
      h13YzzxcsTfListQuery.getMany(),
      h13YzzxcsListQuery.getMany(),
    ]);

    return this.getYzzxcsFees(h13YzzxcsList, h13YzzxcsTfList, targetDate, mrcs);
    // const transformedData = this.getYzzxcsFees(h13YzzxcsList, h13YzzxcsTfList, targetDate, mrcs);

    // return transformedData.map((item) => plainToInstance(H13YzzxcsResponseDto, item));
  }

  private getYzzxcsFees(
    h13YzzxcsList: h13_yzzxcs[],
    h13YzzxcsTfList: H13YzzxcsTf[],
    targetDate: Date,
    mrcs: number,
  ): H13YzzxcsResponseDto[] {
    return h13YzzxcsList.map((h13) => {
      const returnData = new H13YzzxcsResponseDto();
      Object.assign(returnData, {
        ...h13,
        ...{
          xmmc: h13.h12_yzxb?.xmmc || '',
          fylbmc: h13.h00_fylb?.fylbmc || '',
          syplmc: h13.h12_yzxb?.syplidEntity?.syplmc || '',
          thsl: 0,
        },
      });

      // 检查已经生成的退费记录是否已经处理，如果没有处理，则调整不执行次数
      const h13YzzxcsTf = h13YzzxcsTfList.find(
        (tf) =>
          //   tf.zxrq === h13.zxrq &&
          //   tf.yzxh === h13.yzxh &&
          //   tf.yzlx === h13.yzlx &&
          tf.zxcs2 === h13.maxid,
      );

      // 不管是否处理，以护士退费为准
      if (h13YzzxcsTf) {
        returnData.ytcs -= h13YzzxcsTf.zxcs;
      } else returnData.ytcs = 0;

      // 处理末日次数
      const h13Date = new Date(h13.zxrq);
      h13Date.setHours(0, 0, 0, 0); // 去掉时分秒

      if (h13Date.getTime() === targetDate.getTime()) {
        // 计算退费数量
        if (returnData.ytcs === 0) {
          returnData.ylcs = mrcs === 9 ? returnData.zxcs : mrcs;
        }
      } else {
        returnData.ylcs = 0;
      }

      // 重新计算退费数量
      const tfsl = returnData.zxcs - returnData.ylcs;
      returnData.sjtysl = tfsl >= 0 ? tfsl * h13.jfyl : 0;
      return returnData;
    });
  }

  //   async generateTempDataForFutureDates(
  //     zyid: string,
  //     yzxh: number,
  //     yzlx: number,
  //     yzzh: number[],
  //     zxrq: string,
  //     gstr_ainf: { u_userid: string },
  //   ): Promise<H13YzzxcsResponseDto[]> {
  //     const tzrq = new Date(); // 对应PB9中的ldt_sj
  //     const targetDate = new Date(zxrq);
  //     targetDate.setHours(0, 0, 0, 0);

  //     // 使用QueryBuilder进行精确的日期比较
  //     const h13YzzxcsTfListQuery = this.h13YzzxcsTfRepository
  //       .createQueryBuilder('tf')
  //       .where('tf.zyid = :zyid', { zyid })
  //       .andWhere('tf.yzxh = :yzxh', { yzxh })
  //       .andWhere('tf.yzlx = :yzlx', { yzlx })
  //       .andWhere('tf.yzzh IN (:...yzzh)', { yzzh })
  //       .andWhere('CONVERT(date, tf.zxrq) >= :zxrq', { zxrq: targetDate });
  //     // console.log('h13YzzxcsTfListQuery: ', getSqlWithParameters(h13YzzxcsTfListQuery));

  //     const h13YzzxcsListQuery = this.h13YzzxcsRepository
  //       .createQueryBuilder('h13')
  //       .leftJoin('h13.h12_yzxb', 'h12_yzxb')
  //       .leftJoin('h12_yzxb.syplidEntity', 'h00_sypl')
  //       .leftJoin('h13.h00_fylb', 'h00_fylb')
  //       .select([
  //         'h13', // 选择 h13 的所有字段
  //         'h12_yzxb.xmmc', // 只选择 h12_yzxb 的 xmmc 字段
  //         'h00_sypl.syplmc',
  //         'h00_fylb.fylbmc', // 只选择 h00_fylb 的 xmmc 字段
  //       ])
  //       .where('h13.zyid = :zyid', { zyid })
  //       .andWhere('h13.yzxh = :yzxh', { yzxh })
  //       .andWhere('h13.yzlx = :yzlx', { yzlx })
  //       .andWhere('h13.yzzh IN (:...yzzh)', { yzzh })
  //       //   .andWhere('h13.fybz = 1')
  //       //   .andWhere('h13.clbz = 1')
  //       .andWhere('CONVERT(date, h13.zxrq) >= :zxrq', { zxrq: targetDate })
  //       .orderBy('h13.zxrq', 'ASC'); // 添加排序，ASC表示升序
  //     // console.log(
  //     //   'h13YzzxcsListQuery 1: --------------------------------------',
  //     //   '\n',
  //     //   getSqlWithParameters(h13YzzxcsListQuery),
  //     // );

  //     const [h13YzzxcsTfList, h13YzzxcsList] = await Promise.all([
  //       h13YzzxcsTfListQuery.getMany(),
  //       h13YzzxcsListQuery.getMany(),
  //     ]);

  //     const newRecords = h13YzzxcsList.filter((h13) => {
  //       return !h13YzzxcsTfList.some(
  //         (tf) =>
  //           tf.zyid === h13.zyid &&
  //           tf.yzxh === h13.yzxh &&
  //           tf.yzlx === h13.yzlx &&
  //           yzzh.includes(tf.yzzh) &&
  //           tf.zxrq.toDateString() === h13.zxrq.toDateString(),
  //       );
  //     });

  //     const transformedData = newRecords.map((h13) => {
  //       //   const currentTime = new Date();
  //       //   const dateStr = h13.zxrq.toISOString().split('T')[0];
  //       //   const timeStr = currentTime.toTimeString().split(' ')[0];
  //       //   const newZxrq = new Date(`${dateStr}T${timeStr}`);

  //       const bzxcs = h13.zxcs - h13.bzxcs;
  //       const sjtysl = bzxcs * h13.jfyl;

  //       return {
  //         yzxh: h13.yzxh,
  //         mxxh: h13.mxxh,
  //         yzlx: h13.yzlx,
  //         zyid: h13.zyid,
  //         zxrq: h13.zxrq,
  //         ksid: h13.ksid,
  //         fydh: '',
  //         zybh: h13.zybh,
  //         jfyl: h13.jfyl,
  //         xmdj: h13.xmdj,
  //         sfbz: h13.sfbz,
  //         fylbid: h13.fylbid,
  //         jsdh: h13.jsdh,
  //         jsbz: h13.jsbz,
  //         zxcs2: h13.maxid,
  //         zxhs: gstr_ainf.u_userid,
  //         zxsj: h13.zxsj,
  //         zflx: h13.zflx,
  //         syffid: h13.syffid,
  //         bzxcs,
  //         tyrid: gstr_ainf.u_userid,
  //         tysj: tzrq,
  //         sqtysl: h13.sqtysl,
  //         sjtysl,
  //         syrid: h13.syrid,
  //         sysj: tzrq,
  //         kyts: h13.kyts,
  //         zfbl: h13.zfbl,
  //         fybz: h13.fybz,
  //         fysj: h13.fysj,
  //         fyrid: h13.fyrid,
  //         zxcs: h13.zxcs,
  //         zkksid: h13.zkksid,
  //         clbz: h13.clbz,
  //         dybz: 0,
  //         xnhbz: h13.xnhbz,
  //         jzje: h13.jzje,
  //         jzry: h13.jzry,
  //         ybfl: h13.ybfl,
  //         scph: h13.scph,
  //         cjid: h13.cjid,
  //         bz1: h13.bz1,
  //         zfje: h13.zfje,
  //         pfjg: h13.pfjg,
  //         xmid: h13.xmid,
  //         yjry: h13.yjry,
  //         yjrq: h13.yjrq,
  //         yzzh: h13.yzzh,
  //         czrq: tzrq,
  //         xmmc: h13.h12_yzxb?.xmmc || '',
  //         fylbmc: h13.h00_fylb?.fylbmc || '',
  //         syplmc: h13.h12_yzxb?.syplidEntity?.syplmc || '',
  //       };
  //     });

  //     return transformedData.map((item) => plainToInstance(H13YzzxcsResponseDto, item));
  //   }

  //   async generateTempDataForCurrentDate(
  //     zyid: string,
  //     yzxh: number,
  //     yzlx: number,
  //     yzzh: number[],
  //     zxrq: string,
  //     mrcs: number,
  //     gstr_ainf: { u_userid: string },
  //   ): Promise<H13YzzxcsResponseDto[]> {
  //     const tzrq = new Date();
  //     const targetDate = new Date(zxrq);
  //     targetDate.setHours(0, 0, 0, 0);

  //     const h13YzzxcsTfListQuery = this.h13YzzxcsTfRepository
  //       .createQueryBuilder('tf')
  //       .where('tf.zyid = :zyid', { zyid })
  //       .andWhere('tf.yzxh = :yzxh', { yzxh })
  //       .andWhere('tf.yzlx = :yzlx', { yzlx })
  //       .andWhere('tf.yzzh IN (:...yzzh)', { yzzh })
  //       .andWhere('CONVERT(date, tf.zxrq) >= :zxrq', { zxrq: targetDate });
  //     // console.log('h13YzzxcsTfListQuery: ', getSqlWithParameters(h13YzzxcsTfListQuery));

  //     const h13YzzxcsListQuery = this.h13YzzxcsRepository
  //       .createQueryBuilder('h13')
  //       .leftJoin('h13.h12_yzxb', 'h12_yzxb')
  //       .leftJoin('h12_yzxb.syplidEntity', 'h00_sypl')
  //       .leftJoin('h13.h00_fylb', 'h00_fylb')
  //       .select([
  //         'h13', // 选择 h13 的所有字段
  //         'h12_yzxb.xmmc', // 只选择 h12_yzxb 的 xmmc 字段
  //         'h00_sypl.syplmc',
  //         'h00_fylb.fylbmc', // 只选择 h00_fylb 的 xmmc 字段
  //       ])
  //       .where('h13.zyid = :zyid', { zyid })
  //       .andWhere('h13.yzxh = :yzxh', { yzxh })
  //       .andWhere('h13.yzlx = :yzlx', { yzlx })
  //       .andWhere('h13.yzzh IN (:...yzzh)', { yzzh })
  //       //   .andWhere('h13.fybz = 1')
  //       //   .andWhere('h13.clbz = 1')
  //       .andWhere('CONVERT(date, h13.zxrq) >= :zxrq', { zxrq: targetDate })
  //       .orderBy('h13.zxrq', 'ASC'); // 添加排序，ASC表示升序
  //     // console.log(
  //     //   'h13YzzxcsListQuery 2: --------------------------------------',
  //     //   '\n',
  //     //   getSqlWithParameters(h13YzzxcsListQuery),
  //     // );

  //     const [h13YzzxcsTfList, h13YzzxcsList] = await Promise.all([
  //       h13YzzxcsTfListQuery.getMany(),
  //       h13YzzxcsListQuery.getMany(),
  //     ]);
  //     const newRecords = h13YzzxcsList.filter((h13) => {
  //       return !h13YzzxcsTfList.some(
  //         (tf) =>
  //           tf.zyid === h13.zyid &&
  //           tf.yzxh === h13.yzxh &&
  //           tf.yzlx === h13.yzlx &&
  //           yzzh.includes(tf.yzzh) &&
  //           tf.zxrq.toDateString() === h13.zxrq.toDateString(),
  //       );
  //     });

  //     const transformedData = newRecords.map((h13) => {
  //       const currentTime = new Date();
  //       //   const dateStr = h13.zxrq.toISOString().split('T')[0];
  //       //   const timeStr = currentTime.toTimeString().split(' ')[0];
  //       //   const newZxrq = new Date(`${dateStr}T${timeStr}`);

  //       //   const zxcs = -1 * (h13.zxcs - mrcs);
  //       //   const bzxcs = h13.fybz === 1 ? 0 : -1 * (h13.zxcs - mrcs - h13.bzxcs);
  //       //   const sjtysl = h13.fybz === 1 ? 0 : -1 * (h13.zxcs - mrcs - h13.bzxcs) * h13.jfyl;

  //       // 末日次数不能大于执行次数
  //       //   const zxcs = mrcs > h13.zxcs ? h13.zxcs : mrcs; //zxcs: 执行次数
  //       const bzxcs = mrcs >= h13.zxcs ? 0 : h13.zxcs - mrcs; // bzxcs: 需要退药的次数
  //       const sjtysl = bzxcs * h13.jfyl; // sjtysj: 实际退药数量

  //       return {
  //         yzxh: h13.yzxh,
  //         mxxh: h13.mxxh,
  //         yzlx: h13.yzlx,
  //         zyid: h13.zyid,
  //         zxrq: h13.zxrq,
  //         ksid: h13.ksid,
  //         fydh: '',
  //         zybh: h13.zybh,
  //         jfyl: h13.jfyl,
  //         xmdj: h13.xmdj,
  //         sfbz: h13.sfbz,
  //         fylbid: h13.fylbid,
  //         jsdh: h13.jsdh,
  //         jsbz: h13.jsbz,
  //         zxcs2: h13.maxid,
  //         zxhs: gstr_ainf.u_userid,
  //         zxsj: h13.zxsj,
  //         zflx: h13.zflx,
  //         syffid: h13.syffid,
  //         bzxcs,
  //         tyrid: gstr_ainf.u_userid,
  //         tysj: tzrq,
  //         sqtysl: h13.sqtysl,
  //         sjtysl,
  //         syrid: h13.syrid,
  //         sysj: tzrq,
  //         kyts: h13.kyts,
  //         zfbl: h13.zfbl,
  //         fybz: h13.fybz,
  //         fysj: h13.fysj,
  //         fyrid: h13.fyrid,
  //         zxcs: h13.zxcs,
  //         zkksid: h13.zkksid,
  //         clbz: h13.clbz,
  //         dybz: 0,
  //         xnhbz: h13.xnhbz,
  //         jzje: h13.jzje,
  //         jzry: h13.jzry,
  //         ybfl: h13.ybfl,
  //         scph: h13.scph,
  //         cjid: h13.cjid,
  //         bz1: h13.bz1,
  //         zfje: h13.zfje,
  //         pfjg: h13.pfjg,
  //         xmid: h13.xmid,
  //         yjry: h13.yjry,
  //         yjrq: h13.yjrq,
  //         yzzh: h13.yzzh,
  //         czrq: tzrq,
  //         xmmc: h13.h12_yzxb?.xmmc || '',
  //         fylbmc: h13.h00_fylb?.fylbmc || '',
  //         syplmc: h13.h12_yzxb?.syplidEntity?.syplmc || '',
  //       };
  //     });

  //     // 添加更新操作，对应PB9中的第二个update语句
  //     // await this.h13YzzxcsRepository
  //     //   .createQueryBuilder()
  //     //   .update()
  //     //   .set({
  //     //     bzxcs: () => `zxcs - ${mrcs}`,
  //     //     sjtysl: () => `(zxcs - ${mrcs}) * jfyl`,
  //     //     tysj: tzrq,
  //     //     tyrid: gstr_ainf.u_userid,
  //     //   })
  //     //   .where('zyid = :zyid', { zyid })
  //     //   .andWhere('yzxh = :yzxh', { yzxh })
  //     //   .andWhere('yzlx = :yzlx', { yzlx })
  //     //   .andWhere('yzzh IN (:...yzzh)', { yzzh })
  //     //   .andWhere('CONVERT(date, zxrq) = :zxrq', { zxrq: targetDate })
  //     //   .execute();

  //     return transformedData.map((item) => plainToInstance(H13YzzxcsResponseDto, item));
  //   }

  async wfStopFymx(
    zyid: string,
    yzxh: number,
    yzlx: number,
    yzzh: number[], // 改为数组类型
    zxrq: string,
    mrcs: number,
    userId: string,
    manager: EntityManager,
  ): Promise<void> {
    const ldt_sj = new Date();

    // 删除符合条件的记录 - 使用 manager
    await manager
      .createQueryBuilder()
      .delete()
      .from(h13_yzzxcs)
      .where('zyid = :zyid', { zyid })
      .andWhere('yzxh = :yzxh', { yzxh })
      .andWhere('yzlx = :yzlx', { yzlx })
      .andWhere('yzzh IN (:...yzzh)', { yzzh }) // 使用IN条件
      .andWhere('CONVERT(char(10), zxrq, 120) >= :zxrq', { zxrq: zxrq.substring(0, 10) })
      .andWhere('(fybz IS NULL OR fybz = 0)')
      .andWhere('(clbz IS NULL OR clbz = 0)')
      .execute();

    // 插入大于停医嘱日期的退费记录 - 使用 manager
    const queryBuilder1 = manager
      .createQueryBuilder(h13_yzzxcs, 'h13')
      .leftJoin('h13.h12_yzxb', 'h12')
      .select([
        'h13.yzxh',
        'h13.mxxh',
        'h13.yzlx',
        'h13.zyid',
        "CONVERT(datetime, CONVERT(char(10), h13.zxrq, 120) + ' ' + CONVERT(varchar, GETDATE(), 114)) as zxrq",
        'h13.ksid',
        "'' as fydh",
        'h13.zybh',
        'h13.jfyl',
        'h13.xmdj',
        'h13.sfbz',
        'h13.fylbid',
        'h13.jsdh',
        'h13.jsbz',
        'h13.maxid as zxcs2',
        ':userId as zxhs',
        'h13.zxsj',
        'h13.zflx',
        'h13.syffid',
        'CASE WHEN h13.fybz = 1 THEN 0 ELSE -1 * (h13.zxcs - h13.bzxcs) END as bzxcs',
        ':userId as tyrid',
        ':ldt_sj as tysj',
        'h13.sqtysl',
        'CASE WHEN h13.fybz = 1 THEN 0 ELSE -1 * (h13.zxcs - h13.bzxcs) * h13.jfyl END as sjtysl',
        'h13.syrid',
        ':ldt_sj as sysj',
        'h13.kyts',
        'h13.zfbl',
        '0 as fybz',
        'h13.fysj',
        'h13.fyrid',
        '-1 * h13.zxcs as zxcs',
        'h13.zkksid',
        '0 as clbz',
        '0 as dybz',
        'h13.xnhbz',
        'h13.jzje',
        'h13.jzry',
        'h13.ybfl',
        'h13.scph',
        'h13.cjid',
        'h13.bz1',
        'h13.zfje',
        'h13.pfjg',
        'h13.xmid',
        'h13.yjry',
        'h13.yjrq',
        'h13.YZZH',
        ':ldt_sj as czrq',
        'h12.xmmc',
      ])
      .where('h13.zyid = :zyid', { zyid })
      .andWhere('h13.yzxh = :yzxh', { yzxh })
      .andWhere('h13.yzlx = :yzlx', { yzlx })
      .andWhere('h13.YZZH IN (:...yzzh)', { yzzh }) // 使用IN条件
      .andWhere('CONVERT(char(10), h13.zxrq, 120) > :zxrq', { zxrq: zxrq.substring(0, 10) })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('*')
          .from(H13YzzxcsTf, 'tf')
          .where('tf.zyid = :zyid', { zyid })
          .andWhere('tf.yzxh = :yzxh', { yzxh })
          .andWhere('tf.yzlx = :yzlx', { yzlx })
          .andWhere('tf.YZZH IN (:...yzzh)', { yzzh }) // 使用IN条件
          .andWhere('CONVERT(char(10), tf.zxrq, 120) > :zxrq', { zxrq: zxrq.substring(0, 10) })
          .getQuery();
        return `NOT EXISTS (${subQuery})`;
      })
      .setParameters({ userId, ldt_sj, yzzh });

    // 插入等于停医嘱日期的退费记录 - 使用 manager
    const queryBuilder2 = manager
      .createQueryBuilder(h13_yzzxcs, 'h13')
      .leftJoin('h13.h12_yzxb', 'h12')
      .select([
        'h13.yzxh',
        'h13.mxxh',
        'h13.yzlx',
        'h13.zyid',
        "CONVERT(datetime, CONVERT(char(10), h13.zxrq, 120) + ' ' + CONVERT(varchar, GETDATE(), 114)) as zxrq",
        'h13.ksid',
        "'' as fydh",
        'h13.zybh',
        'h13.jfyl',
        'h13.xmdj',
        'h13.sfbz',
        'h13.fylbid',
        'h13.jsdh',
        'h13.jsbz',
        'h13.maxid as zxcs2',
        ':userId as zxhs',
        'h13.zxsj',
        'h13.zflx',
        'h13.syffid',
        // 'CASE WHEN h13.fybz = 1 THEN 0 ELSE -1 * ((case when :mrcs > h13.zxcs then h13.zxcs else h13.zxcs - :mrcs end) - h13.bzxcs) END as bzxcs',
        'CASE\n' +
          '  WHEN h13.fybz = 1 THEN\n' +
          '   0\n' +
          '  ELSE\n' +
          '   -1 * ((case\n' +
          '     when :mrcs > h13.zxcs then\n' +
          '      h13.zxcs\n' +
          '     else\n' +
          '      h13.zxcs - :mrcs\n' +
          '   end) - h13.bzxcs)\n' +
          'END as bzxcs',
        ':userId as tyrid',
        ':ldt_sj as tysj',
        'h13.sqtysl',
        // 'CASE WHEN h13.fybz = 1 THEN 0 ELSE -1 * ((case when :mrcs > h13.zxcs then h13.zxcs else h13.zxcs - :mrcs end) - h13.bzxcs) * h13.jfyl END as sjtysl',
        'CASE\n' +
          '  WHEN h13.fybz = 1 THEN\n' +
          '   0\n' +
          '  ELSE\n' +
          '   -1 * ((case\n' +
          '     when :mrcs > h13.zxcs then\n' +
          '      h13.zxcs\n' +
          '     else\n' +
          '      h13.zxcs - :mrcs\n' +
          '   end) - h13.bzxcs) * h13.jfyl\n' +
          'END as sjtysl',
        'h13.syrid',
        ':ldt_sj as sysj',
        'h13.kyts',
        'h13.zfbl',
        '0 as fybz',
        'h13.fysj',
        'h13.fyrid',
        // '-1 * (case when :mrcs > h13.zxcs then h13.zxcs else h13.zxcs - :mrcs end) as zxcs',
        '-1 * (case\n' +
          '  when :mrcs > h13.zxcs then\n' +
          '   h13.zxcs\n' +
          '  else\n' +
          '   h13.zxcs - :mrcs\n' +
          'end) as zxcs',
        'h13.zkksid',
        '0 as clbz',
        '0 as dybz',
        'h13.xnhbz',
        'h13.jzje',
        'h13.jzry',
        'h13.ybfl',
        'h13.scph',
        'h13.cjid',
        'h13.bz1',
        'h13.zfje',
        'h13.pfjg',
        'h13.xmid',
        'h13.yjry',
        'h13.yjrq',
        'h13.YZZH',
        ':ldt_sj as czrq',
        'h12.xmmc',
      ])
      .where('h13.zyid = :zyid', { zyid })
      .andWhere('h13.yzxh = :yzxh', { yzxh })
      .andWhere('h13.yzlx = :yzlx', { yzlx })
      .andWhere('h13.YZZH IN (:...yzzh)', { yzzh }) // 使用IN条件
      .andWhere('CONVERT(char(10), h13.zxrq, 120) = :zxrq', { zxrq: zxrq.substring(0, 10) })
      .andWhere('h13.fybz = 1')
      .andWhere('h13.clbz = 1')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('*')
          .from(H13YzzxcsTf, 'tf')
          .where('tf.zyid = :zyid', { zyid })
          .andWhere('tf.yzxh = :yzxh', { yzxh })
          .andWhere('tf.yzlx = :yzlx', { yzlx })
          .andWhere('tf.YZZH IN (:...yzzh)', { yzzh }) // 使用IN条件
          .andWhere('CONVERT(char(10), tf.zxrq, 120) = :zxrq', { zxrq: zxrq.substring(0, 10) })
          .getQuery();
        return `NOT EXISTS (${subQuery})`;
      })
      .setParameters({ userId, ldt_sj, mrcs, yzzh });

    // console.log(
    //   'queryBuilder1: =========================================\n',
    //   getCompleteSqlWithParameters(queryBuilder1),
    // );
    // console.log(
    //   'queryBuilder2: =========================================\n',
    //   getCompleteSqlWithParameters(queryBuilder2),
    // );

    // 先获取要插入的数据
    const [recordsToInsert1, recordsToInsert2] = await Promise.all([
      queryBuilder1.getRawMany(),
      queryBuilder2.getRawMany(),
    ]);

    const newRecords = [...recordsToInsert1, ...recordsToInsert2].filter((item) => item.zxcs < 0);
    // console.log('退费数据: =========================================\n', newRecords);

    if (newRecords.length > 0) {
      // 把 [...recordsToInsert1, ...recordsToInsert2] 的数据导入 H13YzzxcsTf 实体中
      const metadata = manager.getRepository(H13YzzxcsTf).metadata;
      const columns = metadata.columns
        .filter((column) => !column.isGenerated) // 忽略自增列
        .map((column) => column.propertyName); // 获取字段名

      // 这部分代码会生成 insert(maxid)的错误程序
      //   const h13YzzxcsTfs: H13YzzxcsTf[] = [...recordsToInsert1, ...recordsToInsert2]
      //     .filter((item) => item.zxcs < 0)
      //     .map((item) => {
      //       const h13YzzxcsTf = new H13YzzxcsTf();

      //       // 遍历 H13YzzxcsTf 的属性
      //       columns.forEach((key) => {
      //         // 如果属性值是 undefined，则设置为 null
      //         if (item['h13_'.concat(key)]) {
      //           h13YzzxcsTf[key] = item['h13_'.concat(key)];
      //         }
      //         if (item[key]) {
      //           h13YzzxcsTf[key] = item[key];
      //         }
      //       });

      //       return h13YzzxcsTf;
      //     });

      //   // 使用 manager 必须同步执行，不能异步同时执行多个UPDATE语句
      //   await manager.createQueryBuilder().insert().into(H13YzzxcsTf).values(h13YzzxcsTfs).execute();

      // 构建插入 SQL 语句
      const values = newRecords
        .map(
          (record) =>
            `(${columns
              .map((column) => {
                const value = record[column] ?? record['h13_'.concat(column)];
                const realVal =
                  typeof value === 'object' && value ? DateFormater.formatDate1(value) : value;
                return realVal !== undefined && realVal !== null ? `'${realVal}'` : 'null'; // 处理 null 和 undefined
              })
              .join(', ')})`,
        )
        .join(', ');

      const sql = `INSERT INTO ${metadata.tableName} (${columns.join(', ')}) VALUES ${values};`;

      // 执行 SQL 语句
      await manager.query(sql);
    }

    // 更新大于停医嘱日期的记录 - 使用 manager
    await manager
      .createQueryBuilder()
      .update(h13_yzzxcs)
      .set({
        bzxcs: () => 'zxcs',
        sjtysl: () => 'zxcs * jfyl',
        tysj: ldt_sj,
        tyrid: userId,
      })
      .where('zyid = :zyid', { zyid })
      .andWhere('yzxh = :yzxh', { yzxh })
      .andWhere('yzlx = :yzlx', { yzlx })
      .andWhere('yzzh IN (:...yzzh)', { yzzh }) // 使用IN条件
      .andWhere('CONVERT(char(10), zxrq, 120) > :zxrq', { zxrq: zxrq.substring(0, 10) })
      .execute();

    // 更新等于停医嘱日期的记录 - 使用 manager
    await manager
      .createQueryBuilder()
      .update(h13_yzzxcs)
      .set({
        bzxcs: () => `zxcs - ${mrcs}`,
        sjtysl: () => `(zxcs - ${mrcs}) * jfyl`,
        tysj: ldt_sj,
        tyrid: userId,
      })
      .where('zyid = :zyid', { zyid })
      .andWhere('yzxh = :yzxh', { yzxh })
      .andWhere('yzlx = :yzlx', { yzlx })
      .andWhere('yzzh IN (:...yzzh)', { yzzh }) // 使用IN条件
      .andWhere('CONVERT(char(10), zxrq, 120) = :zxrq', { zxrq: zxrq.substring(0, 10) })
      .execute();
  }
}
