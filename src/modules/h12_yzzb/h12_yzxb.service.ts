import { H31_kcxx } from './../h31_kcxx/h31_kcxx.entity';
import { Injectable, BadRequestException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
// import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
// import DateFormater from '@/utils/DateFormater';
import { H12_yzxbOpeDto } from './dto/h12_yzxbOpe.dto';
import { UpdateH12_yzxbDto } from './dto/h12_yzxb.dto';
import { h12_yzzbService } from './h12_yzzb.service';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
// import { ModuleRef } from '@nestjs/core';
import { ConfigReaderService } from '@/modules/h12_xmzd/service/config-reader.service';
import { Gstr_ainfDto } from '@/modules/h12_xmzd/dto/gstr_ainf.dto';
import { G_ksidDto } from '@/modules/h12_xmzd/dto/g_ksid.dto';
// import { Gs_cxszDto } from '@/modules/h12_xmzd/dto/gs_cxsz.dto';
// import { promises } from 'dns';
import { SunsoftService } from '@/modules/sunsoft/sunsoft.service';
import { H31_kcxxService } from '@/modules/h31_kcxx/h31_kcxx.service';
import { KcjgYpidRequestDto, Kcjgxx } from '@/modules/h31_kcxx/dto/kcjg-ypid.dto';
import { mergeObjects } from '@/utils/params';
import { H00TcxbService } from '../h00_tcxb/service/h00_tcxb.service';
import { H12_yzxbDto } from './dto/h12_yzxb.dto';
import { H12_yzzbOpeDto } from './dto/h12_yzzbOpe.dto';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class h12_yzxbService {
  // TODO: 使用Redis缓存参数
  private readonly MAX_RECURSION_DEPTH = 3;
  private yzrq: Date = new Date();
  private gstr_ainf: Gstr_ainfDto;
  private g_ksid: G_ksidDto;
  //   private gs_cxsz: Gs_cxszDto;
  private yzlx: number;
  private zyid: string;
  private userId: string;
  private systemId: string;
  private departmentId: string;

  constructor(
    // @InjectRepository(h12_yzzb)
    // private h12_yzzbRepo: Repository<h12_yzzb>,
    @InjectRepository(h12_yzxb)
    private h12_yzxbRepo: Repository<h12_yzxb>,
    @InjectRepository(h00_sypl)
    private h00_syplRepo: Repository<h00_sypl>,
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
    private readonly gyIdentityService: GyIdentityService,
    private readonly h12YzzbService: h12_yzzbService,
    private readonly configReaderService: ConfigReaderService,
    private readonly sunsoftService: SunsoftService,
    private readonly h31_kcxxService: H31_kcxxService,
    private readonly h00TcxbService: H00TcxbService,
    private dataSource: DataSource,
  ) {}

  // 取组套
  async addPackageToAdvice(h12_yzxbs: H12_yzxbOpeDto) {
    // 变量初始化
    this.yzlx = h12_yzxbs.yzlx;
    this.zyid = h12_yzxbs.zyid;
    this.userId = h12_yzxbs.userId;
    this.systemId = h12_yzxbs.systemId;
    this.departmentId = h12_yzxbs.ksid;
    this.g_ksid = await this.configReaderService.getKsids(this.departmentId);
    this.gstr_ainf = await this.configReaderService.readGstrAinf({
      userId: h12_yzxbs.userId,
      systemId: h12_yzxbs.systemId,
    });

    const adviceList = [];
    try {
      // 1. 初始化变量
      const controlData = {
        selectedCount: 0,
        currentRow: 0,
        packageGroupId: 0,
        recursionDepth: 0,
      };

      // 2. 处理选中的项目
      for (let i = 0; i < h12_yzxbs.h12_mbxbs.length; i++) {
        const item = h12_yzxbs.h12_mbxbs[i];

        // 判断是否是组套项目
        let isPackage = item.tcbz === 1;
        if (
          item.xmid.includes('T') ||
          (isPackage && (item.fylbid === '02' || item.fylbid === '90'))
        ) {
          isPackage = true;
        } else {
          isPackage = false;
        }

        // 3. 处理选中的项目

        // 创建医嘱项
        const { newAdvice, mergedItem } = await this._createAdviceItem({
          adviceList,
          isPackage,
          item,
          index: i,
          ...controlData,
        });

        const mbid =
          item.fylbid === '02' || item.fylbid === '90' ? mergedItem.mbid : mergedItem.xmid;
        // 处理套餐项目
        if (isPackage) {
          const pachageAdvice = await this.handlePackageItems({
            advice: newAdvice,
            // item: mergedItem,
            mbid,
            recursionDepth: controlData.recursionDepth + 1,
          });
          adviceList.push(...pachageAdvice);
        }
      }
      return adviceList;
    } catch (error) {
      console.error('添加组套失败:', error);
      throw error;
    }
  }

  /**
   * 创建医嘱项
   * @private
   */
  async _createAdviceItem({
    adviceList,
    currentRow,
    isPackage,
    item,
    index,
    selectedCount,
    packageGroupId,
    recursionDepth,
  }): Promise<{ newAdvice: h12_yzxb; mergedItem: any }> {
    // 如果是组套第一行，设置组套信息

    // 创建医嘱项
    const newAdvice = await this.h12YzzbService.createAdvice({ zyid: this.zyid, yzlx: this.yzlx });
    adviceList.push(newAdvice);

    // 设置医嘱基本信息
    await this._setAdviceBaseInfo(newAdvice, {
      isPackage,
    });

    // 获取项目详情
    const mergedItem = await this._getItemDetail(item);

    // 设置项目信息
    await this._setItemInfo(newAdvice, mergedItem);

    // 处理特殊项目
    await this._handleSpecialItems(newAdvice, mergedItem);

    return { newAdvice, mergedItem };
  }

  /**
   * 设置医嘱基本信息
   * @private
   */
  async _setAdviceBaseInfo(advice: h12_yzxb, { isPackage }) {
    advice.tcbz = isPackage ? 1 : 0;
    advice.sjbz = 1;
    advice.sfbz = isPackage ? 0 : 1;
    advice.jsbz = 0;
    advice.zxbz = 0;
    advice.tzbz = 0;
    advice.tjbz = 0;
    // advice.szbz = 1;
    advice.lryid = this.userId;
    advice.hdbz = this.systemId === '13' ? 1 : 0;

    // 设置医生/护士信息
    if (this.systemId === '12') {
      if (this.gstr_ainf.u_zcid === '0106') {
        advice.ksys = '';
        advice.kssxys = this.userId;
      } else {
        advice.ksys = this.userId;
      }
      advice.ysbz = 1;
    } else {
      if (this.gstr_ainf.u_zcid === '0206') {
        advice.kssxhs = this.userId;
      } else {
        advice.kshs = this.userId;
      }
      advice.ksys = this.userId;
      advice.ysbz = 0;
    }

    advice.yzrq = this.yzrq;
    // advice.isNew = true;
  }

  /**
   * 通过字典列表取库存的办法，服务间远程调用
   * @param item
   * @returns
   */
  private async _getKcjg(item: any): Promise<{ data: any }> {
    const query = {
      ...item,
      pageNo: 1,
      pageSize: 10,
    };
    const { pageData } = await this.sunsoftService.forwardRequest('h31_kcxx', 'findAll', null, {
      method: 'get',
      query,
    });
    if (pageData.length === 0) {
      throw new BadRequestException(
        `字典中没有项目：${item.ypid} -- ${item.ypmc} ${JSON.stringify(query)}`,
      );
    }
    return pageData;
  }

  private async _getKcjgA(request: KcjgYpidRequestDto): Promise<Kcjgxx> {
    const kcjgYpidResponseDto = await this.h31_kcxxService.ueReadKcjgYpid(request);
    if (kcjgYpidResponseDto.success) {
      return kcjgYpidResponseDto.data;
    } else {
      throw new BadRequestException(kcjgYpidResponseDto.message);
    }
  }

  /**
   * 获取项目详情
   * @private
   */
  async _getItemDetail(item: any) {
    const kcjgxx = await this._getKcjgA({
      lx: 1, // 是否跟item.mblx模板类型有关？
      ypid: item.xmid,
      ypmc: item.xmmc,
      xmzl: item.xmzl,
      ksid1: this.g_ksid.xyksid,
      ksid2: this.g_ksid.cyksid,
      ksid3: this.g_ksid.zyksid,
      ksid4: this.g_ksid.clksid,
      ksid5: this.g_ksid.qtksid,
    });

    return mergeObjects(
      {
        ksid: item.zxks || this.departmentId,
      },
      kcjgxx,
      item,
    );
  }

  /**
   * 设置项目信息
   * @private
   */
  async _setItemInfo(advice: h12_yzxb, item: any) {
    // If dw_xb_new.GetItemString(i - 1 ,"typbz") <> '' And left(dw_xb_new.GetItemString(i - 1 ,"typbz"),1) = ls_typbz And ls_typbz <> '' Then
    if (!item.typbz) {
      advice.yzzh = await this.gyIdentityService.getMax('h12_yzzh');
    }
    advice.xmzl = item.xmzl;
    advice.xmid = item.xmid;
    advice.ypid = item.xmid;
    advice.xmmc = item.xmmc;
    advice.xmdw = item.xmdw;
    advice.xmdj = item.sfdj;
    advice.xmgg = item.xmgg;
    advice.syffid = item.syffid || '';
    advice.syffidEntity = item.syffidEntity;
    advice.syplid = item.syplid || 'QD';
    advice.syplidEntity = item.syplidEntity;
    advice.pfjg = item.pfjg;
    advice.jldw = item.jldw;
    advice.bzxx = item.bzxx;
    advice.typbz = item.typbz || '';
    advice.jssj = item.ybfl?.trim();
    advice.cjid = item.cjid;
    advice.ksid = item.ksid;
    advice.scph = item.scph;
    advice.jfyl = item.jfyl;
    advice.sjyl = item.sjyl;
    advice.sjyl1 = item.sjyl1;
    advice.fylbid = item.fylbid?.trim() || '35';
    advice.fybz = item.fybz;
    advice.zflx = item.fyfl;
    advice.gjybbm = item.gjybbm;
    advice.gjybmc = item.gjybmc;
    advice.ltbz = item.ltbz;
  }

  /**
   * 处理特殊项目
   * @private
   */
  async _handleSpecialItems(advice: h12_yzxb, item: any) {
    // 处理皮试提示
    if (item.psbz === 1) {
      if (confirm(`该药品名称：[${item.xmmc}]，是否皮试?`)) {
        // advice.dw_grade = 1;
        advice.bzxx = 'AST( )';
      }
    }

    // 处理抗生素权限
    if (item.cfqj === '2' && this.gstr_ainf.u_zcid > '0103') {
      alert(`该药品名称是抗生素药：[${item.xmmc}]，请主治医师以上盖冒?`);
      advice.ksys = '';
      advice.kssxys = this.userId;
    } else if (item.cfqj === '3' && this.gstr_ainf.u_zcid > '0102') {
      alert(`该药品名称是抗生素药：[${item.xmmc}]，请副主任医师以上盖冒?`);
      advice.ksys = '';
      advice.kssxys = this.userId;
    }
  }

  /**
   * 处理套餐项目
   * @private
   */
  async handlePackageItems({ advice, mbid, recursionDepth }) {
    if (recursionDepth >= this.MAX_RECURSION_DEPTH) {
      throw new Error('组套嵌套层级超过最大限制');
    }

    if (!this.g_ksid) {
      this.g_ksid = await this.configReaderService.getKsids(advice.ksid);
    }

    // 获取套餐项目
    const packageItems = await this.h00TcxbService.getCombinedData(mbid);

    // 创建子医嘱项
    const packageAdvices = [];

    for (const pkgItem of packageItems) {
      const childAdvice = new UpdateH12_yzxbDto();
      packageAdvices.push(childAdvice);

      // 设置子医嘱基本信息
      await this._setChildAdviceBaseInfo(childAdvice, advice);

      // 获取子项目详情
      const childItem = await this._getItemDetail(pkgItem);

      // 设置子项目信息
      this._setChildItemInfo(childAdvice, childItem);
    }

    return packageAdvices;
  }

  /**
   * 设置子医嘱基本信息
   * @private
   */
  async _setChildAdviceBaseInfo(childAdvice: UpdateH12_yzxbDto, parentAdvice: UpdateH12_yzxbDto) {
    childAdvice.zyid = parentAdvice.zyid;
    childAdvice.zybh = parentAdvice.zybh;
    childAdvice.zycs = parentAdvice.zycs;
    childAdvice.yzlx = parentAdvice.yzlx;
    childAdvice.yzxh = parentAdvice.yzxh;
    childAdvice.mxxh = await this.gyIdentityService.getMax('h12_yzxbn');
    childAdvice.tcbz = 1;
    childAdvice.sjbz = 1;
    childAdvice.sfbz = parentAdvice.sfbz;
    childAdvice.jsbz = 0;
    childAdvice.zxbz = 0;
    childAdvice.tzbz = 0;
    childAdvice.tjbz = 0;
    childAdvice.hdbz = parentAdvice.hdbz;
    childAdvice.lryid = this.userId;
    childAdvice.yzzh = parentAdvice.yzzh;
    childAdvice.ysbz = 0; // 套餐子项按附加项目来看

    // 复制医生/护士信息
    childAdvice.ksys = parentAdvice.ksys;
    childAdvice.kssxys = parentAdvice.kssxys;
    childAdvice.kshs = parentAdvice.kshs;
    childAdvice.kssxhs = parentAdvice.kssxhs;

    childAdvice.yzrq = parentAdvice.yzrq;

    childAdvice.isNew = true;
  }

  /**
   * 设置套餐子项信息
   * @private
   */
  _setChildItemInfo(childAdvice: UpdateH12_yzxbDto, childItem: any) {
    childAdvice.xmzl = childItem.xmzl;
    childAdvice.xmid = childItem.xmid;
    childAdvice.xmmc = childItem.xmmc;
    childAdvice.xmdw = childItem.xmdw;
    childAdvice.xmdj = childItem.jldj;
    childAdvice.xmgg = childItem.xmgg;
    childAdvice.pfjg = childItem.pfjg;
    childAdvice.cjid = childItem.cjid;
    childAdvice.ksid = childItem.ksid;
    childAdvice.scph = childItem.scph;
    childAdvice.jfyl = childItem.jlsl;
    childAdvice.sjyl = childItem.jlsl;
    childAdvice.fylbid = childItem.fylbid;
    childAdvice.sfbz = childItem.sfbz;
    childAdvice.fybz = childItem.fybz;
    childAdvice.zflx = childItem.fyfl;
    childAdvice.syplid = childItem.syplid || 'QD';
    childAdvice.srcs = Math.min(childItem.scdh || 24, childItem.mrcs || 1);
    childAdvice.jssj = childItem.ybfl;
    childAdvice.gjybbm = childItem.gjybbm;
    childAdvice.gjybmc = childItem.gjybmc;
    childAdvice.ltbz = childItem.ltbz;
    childAdvice.sjyl1 = childItem.sjyl1;
    childAdvice.jldw = childItem.jldw;
    childAdvice.typbz = childItem.typbz;
    childAdvice.kyts = childItem.kyts;
    childAdvice.kyfs = childItem.kyfs;
  }

  /**
   * 验证并保存医嘱数据
   * @param h12_yzzbObj 主表数据
   * @param h12_yzxbList 细表数据数组
   * @param xxData 附加信息数据数组
   * @param h12_yzzbOpe 业务参数
   */
  async saveAdvice(h12_yzzbOpe: H12_yzzbOpeDto) {
    const h12_yzxbList = h12_yzzbOpe.h12_yzxbs;

    // const h12_yzzb_record = this.h12_yzzbRepo.find({
    //   where: { zyid: h12_yzzbOpe.zyid, yzlx: h12_yzzbOpe.yzlx ?? 0 },
    // });
    // 1. 数据验证
    if (!h12_yzxbList || h12_yzxbList.length === 0) {
      throw new BadRequestException('请录入医嘱内容!');
    }

    // TODO: 转到前端处理
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

    // 处理删除记录
    for (let i = 0; i < h12_yzzbOpe.deleteList.length; i++) {
      const { zyid, yzlx, yzxh, mxxh } = h12_yzzbOpe.deleteList[i];
      await this.remove(zyid, yzlx, yzxh, mxxh);
    }

    // 初始化变量
    const today = new Date().getFullYear().toString();
    const firstOrder = h12_yzxbList[0];
    const groupFlag = firstOrder.typbz || '';
    const groupId = firstOrder.yzzh || 0;
    const orderDate = firstOrder.yzrq || new Date();

    // 验证医嘱
    for (let i = 0; i < h12_yzxbList.length; i++) {
      const adviceRow = h12_yzxbList[i];

      // 特殊医嘱处理
      const specialOrders = ['     术 后 医 嘱', '     重 整 医 嘱', '     产 后 医 嘱'];
      if (specialOrders.includes(adviceRow.xmmc)) {
        if (!adviceRow.zxcs) {
          adviceRow.zxcs = i + 1;
          continue;
        }
      } else {
        // 验证项目内容
        if (!adviceRow.xmid || adviceRow.xmid.trim() === '') {
          throw new BadRequestException('请选择医嘱项目内容，不能手工录入!');
        }

        // 验证用量
        if ((!adviceRow.jfyl || adviceRow.jfyl === 0) && adviceRow.sfbz === 1) {
          throw new BadRequestException('请录入用量!');
        }

        // 验证频次
        if (!adviceRow.syplid || adviceRow.syplid.trim() === '') {
          throw new BadRequestException('请录入次数!');
        }

        // 特殊频次验证
        if (
          adviceRow.syplid === '一次' &&
          (adviceRow.fylbid === '01' || adviceRow.fylbid === '03')
        ) {
          throw new BadRequestException(`${adviceRow.xmmc}药品频次不能录入【一次】，请重新录入!`);
        }

        // 费用类别验证
        if (adviceRow.xmdj > 0 && (!adviceRow.fylbid || adviceRow.fylbid.trim() === '')) {
          throw new BadRequestException(
            `第${i + 1}行，${adviceRow.xmmc}药品费用类别为空，请重新录入!`,
          );
        }
      }

      // 验证停止医嘱
      if (adviceRow.yzlx === 1 && adviceRow.tzrq && !adviceRow.jsys && !adviceRow.jssxys) {
        throw new BadRequestException('请录入停医生签名!');
      }

      // 验证日期
      if (adviceRow.tzrq && (adviceRow.jsys || adviceRow.jssxys)) {
        if (adviceRow.tzrq < adviceRow.yzrq) {
          throw new BadRequestException('请录入结束日期! 大于开始日期！');
        }

        // 长期医嘱日期验证
        if ((adviceRow.yzlx === 1 || adviceRow.yzlx === 5) && adviceRow.yzrq > adviceRow.tzrq) {
          throw new BadRequestException(
            `第${i + 1}行长期医嘱开始时间${adviceRow.yzrq}大于结束时间${adviceRow.tzrq}!`,
          );
        }

        // 标记停止
        if (adviceRow.yzlx === 1 && adviceRow.tzrq && (adviceRow.jsys || adviceRow.jssxys)) {
          adviceRow.tzbz = 1;
          await this.stopOrderDetails(adviceRow.yzzh, i);
        }

        if (adviceRow.yzlx === 5 && adviceRow.tzrq && adviceRow.jsys) {
          adviceRow.tzbz = 1;
          await this.stopOrderDetails(adviceRow.yzzh, i);
        }
      }

      // 病重告知处理
      if (adviceRow.xmid === 'A000000') {
        await this.updatePatientStatus(adviceRow.zyid, adviceRow.tzbz === 1 ? '3' : '1');
      }

      // 验证库存
      if (
        (adviceRow.tjbz === 0 || adviceRow.tzbz === 0) &&
        (adviceRow.xmzl === 2 || adviceRow.xmzl === 3)
      ) {
        const usageFrequency = await this.getUsageFrequency(adviceRow.syplid);
        const requiredQuantity = adviceRow.jfyl * usageFrequency * adviceRow.kyts;

        const stockAvailable = await this.checkStock(
          adviceRow.xmid,
          adviceRow.xmmc,
          adviceRow.xmgg,
          adviceRow.ksid,
          requiredQuantity,
          i,
        );

        if (!stockAvailable) {
          throw new BadRequestException('参数设置缺药不允许保存，请删除缺药库存，再保存！');
        }
      }

      // TODO: 校验库存

      // 对子数据重新排序执行次数
      //   for (let i = 0; i < adviceRow.additional?.length; i++) {
      //     adviceRow.zxcs = i + 1;

      //     adviceRow.additional.forEach((item) => {
      //       item.zxcs = i + 1;
      //       item.ksys = adviceRow.ksys;
      //     });
      //   }
    }

    // 2. 保存数据
    await this.dataSource.transaction(async (manager) => {
      //   try {
      for (let i = 0; i < h12_yzxbList.length; i++) {
        const adviceRow = h12_yzxbList[i];

        // //   附加项目会保存在主记录的附加记录中
        // if (adviceRow.ysbz === 0) continue;

        await this.saveYzxb(adviceRow, manager);
        // 保存明细
        if (adviceRow.additional) {
          for (const additionalItem of adviceRow.additional) {
            await this.saveYzxb(additionalItem, manager);
          }
        }
      }

      // 重新处理排序，限制：只有删除才会重排，新增
      //   if (h12_yzzbOpe.deleteList?.length > 0) {
      //     await this.resetZxcs(h12_yzzbOpe.zyid, h12_yzzbOpe.yzlx, manager);
      //   }
    });

    return '数据保存成功!';
  }

  async saveYzxb(advice: H12_yzxbDto, manager: EntityManager) {
    let h12_yzxbRow = null;
    if (advice.isNew) {
      h12_yzxbRow = manager.create(h12_yzxb, advice);
    } else {
      // 这样会产生级联操作
      h12_yzxbRow = await manager.findOneBy(h12_yzxb, {
        mxxh: advice.mxxh,
        yzlx: advice.yzlx,
        yzxh: advice.yzxh,
        zyid: advice.zyid,
      });
      Object.assign(h12_yzxbRow, advice);
    }
    return manager.save(h12_yzxbRow);
    // if (advice.isNew) {
    //   const h12_yzxbRow = manager.create(h12_yzxb, advice);
    //   return manager.save(h12_yzxbRow);
    // } else {
    //   // 获取非关键字段的其他字段
    //   const { mxxh, yzlx, yzxh, zyid, ...updateFields } = advice;
    //   // 直接更新，无需先查询
    //   //   return manager.update(
    //   //     h12_yzxb,
    //   //     {
    //   //       mxxh: advice.mxxh,
    //   //       yzlx: advice.yzlx,
    //   //       yzxh: advice.yzxh,
    //   //       zyid: advice.zyid,
    //   //     },
    //   //     updateFields, // 更新的字段
    //   //   );
    //   return manager
    //     .createQueryBuilder()
    //     .update(h12_yzxb)
    //     .set(updateFields)
    //     .where({
    //       mxxh: advice.mxxh,
    //       yzlx: advice.yzlx,
    //       yzxh: advice.yzxh,
    //       zyid: advice.zyid,
    //     })
    //     .execute();
    // }
  }

  /**
   * 重排zxcs，注意！！为了避免排序乱，一定不能使用filter来处理，否则排序会乱
   * @param zyid 住院ID
   * @param yzlx 医嘱类型
   */
  async resetZxcs(zyid: string, yzlx: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(h12_yzxb) : this.h12_yzxbRepo;
    const adviceAll = await this.h12_yzxbRepo.find({
      where: { zyid, yzlx },
      order: { mxxh: 'ASC' },
    });
    const adviceAdditionalList: any[] = [];
    for (const item of adviceAll) {
      if (item.ysbz === 0) {
        adviceAdditionalList.push(item);
      }
    }
    const adviceList = adviceAll.filter((item) => item.ysbz === 1);
    adviceList.forEach((advice, index) => {
      advice.zxcs = index + 1;
      // 重排附加项目序号
      adviceAdditionalList.forEach((addAdvice, addIndex) => {
        if (advice.yzzh === addAdvice.yzzh) {
          addAdvice.zxcs = addIndex + 1;
        }
      });
    });
    //
    for (const advice of adviceAll) {
      await repo.update(
        {
          yzxh: advice.yzxh,
          zyid: advice.zyid,
          yzlx: advice.yzlx,
          mxxh: advice.mxxh,
        },
        {
          zxcs: advice.zxcs,
        },
      );
    }
  }

  //   合并分组
  async mergeGroup(h12_yzxbs: H12_yzxbDto[]) {
    // 取第一行的组号，更新所有
    const yzzh = h12_yzxbs[0].yzzh;
    for (const h12_yzxb of h12_yzxbs) {
      const { yzlx, yzxh, zyid, mxxh } = h12_yzxb;
      await this.h12_yzxbRepo.update({ yzlx, yzxh, zyid, mxxh }, { yzzh });
    }
  }

  // 拆分组
  async splitGroup(h12_yzxbs: H12_yzxbDto[]) {
    // TODO: 从优化的角度来讲，第一行不需要重新获取组号
    const adviceYzzhs = [];
    h12_yzxbs?.map(async (h12_yzxbv, index) => {
      if (index === 0) return; // 第一行不拆分
      const { yzid, yzlx, yzxh, zyid, mxxh } = h12_yzxbv;
      if (h12_yzxbv.ysbz === 0) return; // 附加项目不能拆组
      const yzzh = await this.gyIdentityService.getMax('h12_yzzh');
      await this.h12_yzxbRepo.update({ yzlx, yzxh, zyid, mxxh }, { yzzh });
      adviceYzzhs.push({ yzid, yzzh });
    });
    return adviceYzzhs;
  }

  /**
   * 删除记录
   * @param h12_yzxb 删除的数据，包含主键
   * @returns
   */
  async remove(zyid: string, yzlx: number, yzxh: number, mxxh: number): Promise<boolean> {
    // TODO: 检查同组是否是最后一条ysbz=1的记录，如果是的话，要同时删除附加项目
    await this.h12_yzxbRepo.delete({
      zyid,
      yzlx,
      yzxh,
      mxxh,
    });
    return true;
  }

  async removeYzzh(data: Array<{ zyid: string; yzlx: number; yzzh: number }>): Promise<boolean> {
    // 注意，这里的附加项目已经被删除掉了
    const results = await Promise.all(
      data.map((item) => {
        const { zyid, yzlx, yzzh } = item;
        return this.h12_yzxbRepo.delete({
          zyid,
          yzlx,
          yzzh,
        });
      }),
    );
    return true;
  }

  async removeByYzzh(zyid: string, yzlx: number, yzzh: number): Promise<boolean> {
    await this.h12_yzxbRepo.delete({
      zyid,
      yzlx,
      yzzh,
    });
    return true;
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

  /**
   * 校验库存
   * @param xmid
   * @param xmmc
   * @param xmgg
   * @param ksid
   * @param requiredQuantity
   * @param index
   * @returns
   */
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
