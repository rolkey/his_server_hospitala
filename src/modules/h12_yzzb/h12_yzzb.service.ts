import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import DateFormater from '@/utils/DateFormater';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { h12_yzzbOpeDto } from './dto/h12_yzzbOpe.dto';

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

  async findAllByPatient(data: { zyid: string; yzlx: string }) {
    const queryBuilder = this.h12_yzzbRepo
      .createQueryBuilder('h12_yzzb')
      .leftJoinAndSelect('h12_yzzb.cwidEntity', 'cwidEntity')
      .where('h12_yzzb.zyid = :zyid and h12_yzzb.yzlx=:yzlx', {
        zyid: data.zyid,
        yzlx: data.yzlx ?? '',
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

    const h12_yzxbqb = this.h12_yzxbRepo
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
      tzbz: 0, // 停嘱
      zxbz: 0, // 执行
      tjbz: 0, // 提交标志
      ybbz: 1, // 医嘱标志
      sjbz: 0, // 上级标志
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

  /**
   * 验证并保存医嘱数据
   * @param h12_yzzbObj 主表数据
   * @param h12_yzxbList 细表数据数组
   * @param xxData 附加信息数据数组
   * @param h12_yzzbOpe 业务参数
   */
  async validateAndSaveOrders(
    h12_yzzbObj: Partial<h12_yzzb>,
    h12_yzxbList: Partial<h12_yzxb>[],
    xxData: any[] = [],
    h12_yzzbOpe: h12_yzzbOpeDto,
  ): Promise<{ success: boolean; message: string }> {
    // 1. 数据验证
    if (!h12_yzxbList || h12_yzxbList.length === 0) {
      throw new BadRequestException('请录入医嘱内容!');
    }

    // 处理最后一条为空的情况
    const lastOrder = h12_yzxbList[h12_yzxbList.length - 1];
    if (h12_yzxbList.length === 1 && (!lastOrder.xmmc || lastOrder.xmmc.trim() === '')) {
      return { success: true, message: '忽略空医嘱' };
    }

    // if (!lastOrder.xmmc || lastOrder.xmmc.trim() === '') {
    //   // 判断是否已执行
    //   if (lastOrder.zxbz === 1) {
    //     // 这里可以添加询问逻辑，前端处理确认
    //     // 假设用户选择删除
    //     await this.deleteExecutedOrder(
    //       lastOrder.yzxh,
    //       lastOrder.zyid,
    //       lastOrder.yzlx,
    //       lastOrder.mxxh,
    //     );
    //   }

    //   // 检查同组情况
    //   if (
    //     h12_yzxbList.length > 1 &&
    //     lastOrder.yzzh === h12_yzxbList[h12_yzxbList.length - 2].yzzh
    //   ) {
    //     lastOrder.yzzh = 0;
    //   }

    //   // 删除附加信息
    //   if (xxData && xxData.length > 0) {
    //     xxData = xxData.filter((item) => item.yzzh !== lastOrder.yzzh);
    //   }

    //   // 删除最后一条
    //   h12_yzxbList.pop();
    // }

    // 初始化变量
    const today = new Date().getFullYear().toString();
    const firstOrder = h12_yzxbList[0];
    const groupFlag = firstOrder.typbz || '';
    const groupId = firstOrder.yzzh || 0;
    const orderDate = firstOrder.yzrq || new Date();

    // 验证每条医嘱
    for (let i = 0; i < h12_yzxbList.length; i++) {
      const order = h12_yzxbList[i];

      // 特殊医嘱处理
      const specialOrders = ['     术 后 医 嘱', '     重 整 医 嘱', '     产 后 医 嘱'];
      if (specialOrders.includes(order.xmmc)) {
        if (!order.zxcs) {
          order.zxcs = i + 1;
          continue;
        }
      } else {
        // 验证项目内容
        if (!order.xmid || order.xmid.trim() === '') {
          throw new BadRequestException('请选择医嘱项目内容，不能手工录入!');
        }

        // 验证用量
        if ((!order.jfyl || order.jfyl === 0) && order.sfbz === 1) {
          throw new BadRequestException('请录入用量!');
        }

        // 验证频次
        if (!order.syplid || order.syplid.trim() === '') {
          throw new BadRequestException('请录入次数!');
        }

        // 特殊频次验证
        if (order.syplid === '一次' && (order.fylbid === '01' || order.fylbid === '03')) {
          throw new BadRequestException(`${order.xmmc}药品频次不能录入【一次】，请重新录入!`);
        }

        // 费用类别验证
        if (order.xmdj > 0 && (!order.fylbid || order.fylbid.trim() === '')) {
          throw new BadRequestException(`第${i + 1}行，${order.xmmc}药品费用类别为空，请重新录入!`);
        }
      }

      // 验证停止医嘱
      if (h12_yzzbObj.yzlx === 1 && order.tzrq && !order.jsys && !order.jssxys) {
        throw new BadRequestException('请录入停医生签名!');
      }

      // 验证日期
      if (order.tzrq && (order.jsys || order.jssxys)) {
        if (order.tzrq < order.yzrq) {
          throw new BadRequestException('请录入结束日期! 大于开始日期！');
        }

        // 长期医嘱日期验证
        if ((h12_yzzbObj.yzlx === 1 || h12_yzzbObj.yzlx === 5) && order.yzrq > order.tzrq) {
          throw new BadRequestException(
            `第${i + 1}行长期医嘱开始时间${order.yzrq}大于结束时间${order.tzrq}!`,
          );
        }

        // 标记停止
        if (h12_yzzbObj.yzlx === 1 && order.tzrq && (order.jsys || order.jssxys)) {
          order.tzbz = 1;
          await this.stopOrderDetails(order.yzzh, i);
        }

        if (h12_yzzbObj.yzlx === 5 && order.tzrq && order.jsys) {
          order.tzbz = 1;
          await this.stopOrderDetails(order.yzzh, i);
        }
      }

      // 病重告知处理
      if (order.xmid === 'A000000') {
        await this.updatePatientStatus(h12_yzzbObj.zyid, order.tzbz === 1 ? '3' : '1');
      }

      // 验证库存
      if ((order.tjbz === 0 || order.tzbz === 0) && (order.xmzl === 2 || order.xmzl === 3)) {
        const usageFrequency = await this.getUsageFrequency(order.syplid);
        const requiredQuantity = order.jfyl * usageFrequency * order.kyts;

        const stockAvailable = await this.checkStock(
          order.xmid,
          order.xmmc,
          order.xmgg,
          order.ksid,
          requiredQuantity,
          i,
        );

        if (!stockAvailable) {
          throw new BadRequestException('参数设置缺药不允许保存，请删除缺药库存，再保存！');
        }
      }
    }

    // 重新排序执行次数
    if (!h12_yzzbOpe.attachFlag) {
      for (let i = 0; i < h12_yzxbList.length; i++) {
        h12_yzxbList[i].zxcs = i + 1;
        if (xxData && xxData.length > 0) {
          xxData.forEach((item) => {
            item.zxcs = i + 1;
            item.ksys = h12_yzxbList[i].ksys;
          });
        }
      }
    }

    // 2. 保存数据
    try {
      await this.h12_yzzbRepo.save(h12_yzzbObj);
      await this.h12_yzxbRepo.save(h12_yzxbList);
      if (xxData && xxData.length > 0) {
        // 保存附加信息逻辑
      }

      return { success: true, message: '数据保存成功!' };
    } catch (error) {
      throw new BadRequestException('医嘱信息保存失败,请检查数据网络是否畅通!');
    }
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

  private async stopOrderDetails(yzzh: number, index: number): Promise<void> {
    // 实现停止医嘱明细的逻辑
  }

  private async updatePatientStatus(zyid: string, status: string): Promise<void> {
    await this.h11_brxxRepo.update({ zyid }, { rybqid: status });
  }

  private async getUsageFrequency(syplid: string): Promise<number> {
    const frequency = await this.h00_syplRepo.findOne({
      where: { syplid },
      select: ['mrcs'],
    });
    return frequency?.mrcs || 1;
  }

  private async checkStock(
    xmid: string,
    xmmc: string,
    xmgg: string,
    ksid: string,
    requiredQuantity: number,
    index: number,
  ): Promise<boolean> {
    // 实现库存检查逻辑
    return true; // 假设库存足够
  }
}
