import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { CreateH13YzzxcsDto, H13YzzxcsResponseDto, UpdateH13YzzxcsDto } from './dto/h13-yzzxcs.dto';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { H13YzzxcsTfResponseDto } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.dto';
import { plainToInstance } from 'class-transformer';
import { getCompleteSqlWithParameters, getSqlWithParameters } from '@/utils/sql-utils';
import DateFormater from '@/utils/DateFormater';

@Injectable()
export class h13_yzzxcsService {
  //   private readonly logger = new Logger(h13_yzzxcsService.name);

  constructor(
    @InjectRepository(h13_yzzxcs)
    private readonly h13_yzzxcsRepository: Repository<h13_yzzxcs>,
    @InjectRepository(H13YzzxcsTf)
    private readonly h13YzzxcsTfRepository: Repository<H13YzzxcsTf>,
  ) {}

  async findAll(): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsRepository.find();
  }

  async findOne(conditions: any): Promise<h13_yzzxcs> {
    return this.h13_yzzxcsRepository.findOne({ where: conditions });
  }

  async create(createDto: CreateH13YzzxcsDto): Promise<h13_yzzxcs> {
    const record = this.h13_yzzxcsRepository.create(createDto);
    return this.h13_yzzxcsRepository.save(record);
  }

  async update(conditions: any, updateDto: UpdateH13YzzxcsDto): Promise<h13_yzzxcs> {
    await this.h13_yzzxcsRepository.update(conditions, updateDto);
    return this.h13_yzzxcsRepository.findOne({ where: conditions });
  }

  async delete(conditions: any): Promise<void> {
    await this.h13_yzzxcsRepository.delete(conditions);
  }

  async findByZyid(zyid: string): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsRepository.find({ where: { zyid } });
  }

  async findByYzxh(yzxh: number): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsRepository.find({ where: { yzxh } });
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

    // 使用QueryBuilder进行精确的日期比较
    const h13YzzxcsTfListQuery = this.h13YzzxcsTfRepository
      .createQueryBuilder('tf')
      .where('tf.zyid = :zyid', { zyid })
      .andWhere('tf.yzxh = :yzxh', { yzxh })
      .andWhere('tf.yzlx = :yzlx', { yzlx })
      .andWhere('tf.yzzh IN (:...yzzh)', { yzzh })
      .andWhere('tf.zxrq >= :zxrq', { zxrq: targetDate });
    // console.log('h13YzzxcsTfListQuery: ', getSqlWithParameters(h13YzzxcsTfListQuery));

    const h13YzzxcsListQuery = this.h13_yzzxcsRepository
      .createQueryBuilder('h13')
      .leftJoin('h13.h12_yzxb', 'h12_yzxb')
      .leftJoin('h12_yzxb.syplidEntity', 'h00_sypl')
      .leftJoin('h13.h00_fylb', 'h00_fylb')
      .select([
        'h13', // 选择 h13 的所有字段
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
      .orderBy('h13.maxid', 'ASC'); // 添加排序，ASC表示升序
    // console.log(
    //   'h13YzzxcsListQuery 1: --------------------------------------',
    //   '\n',
    //   getSqlWithParameters(h13YzzxcsListQuery),
    // );

    const [h13YzzxcsTfList, h13YzzxcsList] = await Promise.all([
      h13YzzxcsTfListQuery.getMany(),
      h13YzzxcsListQuery.getMany(),
    ]);

    const transformedData = h13YzzxcsList.map((h13) => {
      const returnData = new H13YzzxcsResponseDto();
      Object.assign(returnData, {
        ...h13,
        ...{
          xmmc: h13.h12_yzxb?.xmmc || '',
          fylbmc: h13.h00_fylb?.fylbmc || '',
          syplmc: h13.h12_yzxb?.syplidEntity?.syplmc || '',
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
      if (h13YzzxcsTf && h13YzzxcsTf.clbz === 0) {
        returnData.bzxcs -= h13YzzxcsTf.zxcs;
      }

      // 处理末日次数
      if (h13.zxrq === targetDate && mrcs !== 9) {
        // 计算退费数量
        console.log('mrcs', mrcs);
      } else {
        returnData.thsl = h13.zxcs;
      }

      //   const dateStr = h13.zxrq.toISOString().split('T')[0];
      //   const timeStr = currentTime.toTimeString().split(' ')[0];
      //   const newZxrq = new Date(`${dateStr}T${timeStr}`);

      const bzxcs = h13.zxcs - h13.bzxcs;
      returnData.sjtysl = bzxcs * h13.jfyl;
      return returnData;
    });

    // 添加更新操作，对应PB9中的第一个update语句
    // await this.h13_yzzxcsRepository
    //   .createQueryBuilder()
    //   .update()
    //   .set({
    //     bzxcs: () => 'zxcs',
    //     sjtysl: () => 'zxcs * jfyl',
    //     tysj: tzrq,
    //     tyrid: gstr_ainf.u_userid,
    //   })
    //   .where('zyid = :zyid', { zyid })
    //   .andWhere('yzxh = :yzxh', { yzxh })
    //   .andWhere('yzlx = :yzlx', { yzlx })
    //   .andWhere('yzzh IN (:...yzzh)', { yzzh })
    //   .andWhere('CONVERT(date, zxrq) > :zxrq', { zxrq: targetDate })
    //   .execute();

    return transformedData.map((item) => plainToInstance(H13YzzxcsResponseDto, item));
  }

  async generateTempDataForFutureDates(
    zyid: string,
    yzxh: number,
    yzlx: number,
    yzzh: number[],
    zxrq: string,
    gstr_ainf: { u_userid: string },
  ): Promise<H13YzzxcsResponseDto[]> {
    const tzrq = new Date(); // 对应PB9中的ldt_sj
    const targetDate = new Date(zxrq);
    targetDate.setHours(0, 0, 0, 0);

    // 使用QueryBuilder进行精确的日期比较
    const h13YzzxcsTfListQuery = this.h13YzzxcsTfRepository
      .createQueryBuilder('tf')
      .where('tf.zyid = :zyid', { zyid })
      .andWhere('tf.yzxh = :yzxh', { yzxh })
      .andWhere('tf.yzlx = :yzlx', { yzlx })
      .andWhere('tf.yzzh IN (:...yzzh)', { yzzh })
      .andWhere('CONVERT(date, tf.zxrq) >= :zxrq', { zxrq: targetDate });
    // console.log('h13YzzxcsTfListQuery: ', getSqlWithParameters(h13YzzxcsTfListQuery));

    const h13YzzxcsListQuery = this.h13_yzzxcsRepository
      .createQueryBuilder('h13')
      .leftJoin('h13.h12_yzxb', 'h12_yzxb')
      .leftJoin('h12_yzxb.syplidEntity', 'h00_sypl')
      .leftJoin('h13.h00_fylb', 'h00_fylb')
      .select([
        'h13', // 选择 h13 的所有字段
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
      .andWhere('CONVERT(date, h13.zxrq) >= :zxrq', { zxrq: targetDate })
      .orderBy('h13.zxrq', 'ASC'); // 添加排序，ASC表示升序
    // console.log(
    //   'h13YzzxcsListQuery 1: --------------------------------------',
    //   '\n',
    //   getSqlWithParameters(h13YzzxcsListQuery),
    // );

    const [h13YzzxcsTfList, h13YzzxcsList] = await Promise.all([
      h13YzzxcsTfListQuery.getMany(),
      h13YzzxcsListQuery.getMany(),
    ]);

    const newRecords = h13YzzxcsList.filter((h13) => {
      return !h13YzzxcsTfList.some(
        (tf) =>
          tf.zyid === h13.zyid &&
          tf.yzxh === h13.yzxh &&
          tf.yzlx === h13.yzlx &&
          yzzh.includes(tf.yzzh) &&
          tf.zxrq.toDateString() === h13.zxrq.toDateString(),
      );
    });

    const transformedData = newRecords.map((h13) => {
      //   const currentTime = new Date();
      //   const dateStr = h13.zxrq.toISOString().split('T')[0];
      //   const timeStr = currentTime.toTimeString().split(' ')[0];
      //   const newZxrq = new Date(`${dateStr}T${timeStr}`);

      const bzxcs = h13.zxcs - h13.bzxcs;
      const sjtysl = bzxcs * h13.jfyl;

      return {
        yzxh: h13.yzxh,
        mxxh: h13.mxxh,
        yzlx: h13.yzlx,
        zyid: h13.zyid,
        zxrq: h13.zxrq,
        ksid: h13.ksid,
        fydh: '',
        zybh: h13.zybh,
        jfyl: h13.jfyl,
        xmdj: h13.xmdj,
        sfbz: h13.sfbz,
        fylbid: h13.fylbid,
        jsdh: h13.jsdh,
        jsbz: h13.jsbz,
        zxcs2: h13.maxid,
        zxhs: gstr_ainf.u_userid,
        zxsj: h13.zxsj,
        zflx: h13.zflx,
        syffid: h13.syffid,
        bzxcs,
        tyrid: gstr_ainf.u_userid,
        tysj: tzrq,
        sqtysl: h13.sqtysl,
        sjtysl,
        syrid: h13.syrid,
        sysj: tzrq,
        kyts: h13.kyts,
        zfbl: h13.zfbl,
        fybz: h13.fybz,
        fysj: h13.fysj,
        fyrid: h13.fyrid,
        zxcs: h13.zxcs,
        zkksid: h13.zkksid,
        clbz: h13.clbz,
        dybz: 0,
        xnhbz: h13.xnhbz,
        jzje: h13.jzje,
        jzry: h13.jzry,
        ybfl: h13.ybfl,
        scph: h13.scph,
        cjid: h13.cjid,
        bz1: h13.bz1,
        zfje: h13.zfje,
        pfjg: h13.pfjg,
        xmid: h13.xmid,
        yjry: h13.yjry,
        yjrq: h13.yjrq,
        yzzh: h13.yzzh,
        czrq: tzrq,
        xmmc: h13.h12_yzxb?.xmmc || '',
        fylbmc: h13.h00_fylb?.fylbmc || '',
        syplmc: h13.h12_yzxb?.syplidEntity?.syplmc || '',
      };
    });

    return transformedData.map((item) => plainToInstance(H13YzzxcsResponseDto, item));
  }

  async generateTempDataForCurrentDate(
    zyid: string,
    yzxh: number,
    yzlx: number,
    yzzh: number[],
    zxrq: string,
    mrcs: number,
    gstr_ainf: { u_userid: string },
  ): Promise<H13YzzxcsResponseDto[]> {
    const tzrq = new Date();
    const targetDate = new Date(zxrq);
    targetDate.setHours(0, 0, 0, 0);

    const h13YzzxcsTfListQuery = this.h13YzzxcsTfRepository
      .createQueryBuilder('tf')
      .where('tf.zyid = :zyid', { zyid })
      .andWhere('tf.yzxh = :yzxh', { yzxh })
      .andWhere('tf.yzlx = :yzlx', { yzlx })
      .andWhere('tf.yzzh IN (:...yzzh)', { yzzh })
      .andWhere('CONVERT(date, tf.zxrq) >= :zxrq', { zxrq: targetDate });
    // console.log('h13YzzxcsTfListQuery: ', getSqlWithParameters(h13YzzxcsTfListQuery));

    const h13YzzxcsListQuery = this.h13_yzzxcsRepository
      .createQueryBuilder('h13')
      .leftJoin('h13.h12_yzxb', 'h12_yzxb')
      .leftJoin('h12_yzxb.syplidEntity', 'h00_sypl')
      .leftJoin('h13.h00_fylb', 'h00_fylb')
      .select([
        'h13', // 选择 h13 的所有字段
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
      .andWhere('CONVERT(date, h13.zxrq) >= :zxrq', { zxrq: targetDate })
      .orderBy('h13.zxrq', 'ASC'); // 添加排序，ASC表示升序
    // console.log(
    //   'h13YzzxcsListQuery 2: --------------------------------------',
    //   '\n',
    //   getSqlWithParameters(h13YzzxcsListQuery),
    // );

    const [h13YzzxcsTfList, h13YzzxcsList] = await Promise.all([
      h13YzzxcsTfListQuery.getMany(),
      h13YzzxcsListQuery.getMany(),
    ]);
    const newRecords = h13YzzxcsList.filter((h13) => {
      return !h13YzzxcsTfList.some(
        (tf) =>
          tf.zyid === h13.zyid &&
          tf.yzxh === h13.yzxh &&
          tf.yzlx === h13.yzlx &&
          yzzh.includes(tf.yzzh) &&
          tf.zxrq.toDateString() === h13.zxrq.toDateString(),
      );
    });

    const transformedData = newRecords.map((h13) => {
      const currentTime = new Date();
      //   const dateStr = h13.zxrq.toISOString().split('T')[0];
      //   const timeStr = currentTime.toTimeString().split(' ')[0];
      //   const newZxrq = new Date(`${dateStr}T${timeStr}`);

      //   const zxcs = -1 * (h13.zxcs - mrcs);
      //   const bzxcs = h13.fybz === 1 ? 0 : -1 * (h13.zxcs - mrcs - h13.bzxcs);
      //   const sjtysl = h13.fybz === 1 ? 0 : -1 * (h13.zxcs - mrcs - h13.bzxcs) * h13.jfyl;

      // 末日次数不能大于执行次数
      //   const zxcs = mrcs > h13.zxcs ? h13.zxcs : mrcs; //zxcs: 执行次数
      const bzxcs = mrcs >= h13.zxcs ? 0 : h13.zxcs - mrcs; // bzxcs: 需要退药的次数
      const sjtysl = bzxcs * h13.jfyl; // sjtysj: 实际退药数量

      return {
        yzxh: h13.yzxh,
        mxxh: h13.mxxh,
        yzlx: h13.yzlx,
        zyid: h13.zyid,
        zxrq: h13.zxrq,
        ksid: h13.ksid,
        fydh: '',
        zybh: h13.zybh,
        jfyl: h13.jfyl,
        xmdj: h13.xmdj,
        sfbz: h13.sfbz,
        fylbid: h13.fylbid,
        jsdh: h13.jsdh,
        jsbz: h13.jsbz,
        zxcs2: h13.maxid,
        zxhs: gstr_ainf.u_userid,
        zxsj: h13.zxsj,
        zflx: h13.zflx,
        syffid: h13.syffid,
        bzxcs,
        tyrid: gstr_ainf.u_userid,
        tysj: tzrq,
        sqtysl: h13.sqtysl,
        sjtysl,
        syrid: h13.syrid,
        sysj: tzrq,
        kyts: h13.kyts,
        zfbl: h13.zfbl,
        fybz: h13.fybz,
        fysj: h13.fysj,
        fyrid: h13.fyrid,
        zxcs: h13.zxcs,
        zkksid: h13.zkksid,
        clbz: h13.clbz,
        dybz: 0,
        xnhbz: h13.xnhbz,
        jzje: h13.jzje,
        jzry: h13.jzry,
        ybfl: h13.ybfl,
        scph: h13.scph,
        cjid: h13.cjid,
        bz1: h13.bz1,
        zfje: h13.zfje,
        pfjg: h13.pfjg,
        xmid: h13.xmid,
        yjry: h13.yjry,
        yjrq: h13.yjrq,
        yzzh: h13.yzzh,
        czrq: tzrq,
        xmmc: h13.h12_yzxb?.xmmc || '',
        fylbmc: h13.h00_fylb?.fylbmc || '',
        syplmc: h13.h12_yzxb?.syplidEntity?.syplmc || '',
      };
    });

    // 添加更新操作，对应PB9中的第二个update语句
    // await this.h13_yzzxcsRepository
    //   .createQueryBuilder()
    //   .update()
    //   .set({
    //     bzxcs: () => `zxcs - ${mrcs}`,
    //     sjtysl: () => `(zxcs - ${mrcs}) * jfyl`,
    //     tysj: tzrq,
    //     tyrid: gstr_ainf.u_userid,
    //   })
    //   .where('zyid = :zyid', { zyid })
    //   .andWhere('yzxh = :yzxh', { yzxh })
    //   .andWhere('yzlx = :yzlx', { yzlx })
    //   .andWhere('yzzh IN (:...yzzh)', { yzzh })
    //   .andWhere('CONVERT(date, zxrq) = :zxrq', { zxrq: targetDate })
    //   .execute();

    return transformedData.map((item) => plainToInstance(H13YzzxcsResponseDto, item));
  }

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
