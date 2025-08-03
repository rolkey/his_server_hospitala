import { H31_kcxx } from './../h31_kcxx/h31_kcxx.entity';
import { Injectable, BadRequestException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
// import DateFormater from '@/utils/DateFormater';
import { H12_yzxbOpeDto } from './dto/h12_yzxbOpe.dto';
import { h12_yzzbService } from './h12_yzzb.service';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { ModuleRef } from '@nestjs/core';
import { ConfigReaderService } from '@/modules/h12_xmzd/service/config-reader.service';
import { Gstr_ainfDto } from '@/modules/h12_xmzd/dto/gstr_ainf.dto';
import { G_ksidDto } from '@/modules/h12_xmzd/dto/g_ksid.dto';
// import { Gs_cxszDto } from '@/modules/h12_xmzd/dto/gs_cxsz.dto';
// import { promises } from 'dns';
import { SunsoftService } from '@/modules/sunsoft/sunsoft.service';
import { H31_kcxxService } from '@/modules/h31_kcxx/h31_kcxx.service';
import { KcjgYpidRequestDto, Kcjgxx } from '@/modules/h31_kcxx/dto/kcjg-ypid.dto';

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
    // @InjectRepository(h12_yzxb)
    // private h12_yzxbRepo: Repository<h12_yzxb>,
    private readonly gyIdentityService: GyIdentityService,
    private readonly h12YzzbService: h12_yzzbService,
    private readonly configReaderService: ConfigReaderService,
    private readonly sunsoftService: SunsoftService,
    private readonly h31_kcxxService: H31_kcxxService,
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
          await this._handlePackageItems({
            advice: newAdvice,
            // item: mergedItem,
            mbid,
            recursionDepth: controlData.recursionDepth + 1,
          });
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
    const kckgxx = await this._getKcjgA({
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

    return {
      ...item,
      ...kckgxx,
      ksid: item.zxks || this.departmentId,
    };
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
    advice.syplid = item.syplid || 'QD';
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
      advice.kssxys = this.gstr_ainf.u_userid;
    } else if (item.cfqj === '3' && this.gstr_ainf.u_zcid > '0102') {
      alert(`该药品名称是抗生素药：[${item.xmmc}]，请副主任医师以上盖冒?`);
      advice.ksys = '';
      advice.kssxys = this.gstr_ainf.u_userid;
    }
  }

  /**
   * 处理套餐项目
   * @private
   */
  async _handlePackageItems({ advice, mbid, recursionDepth }) {
    if (recursionDepth >= this.MAX_RECURSION_DEPTH) {
      throw new Error('组套嵌套层级超过最大限制');
    }

    // 获取套餐项目
    // const packageItems = await adviceModuleApi.getMbxbList({
    //   mbid,
    // });
    const packageItems = [];

    // 创建子医嘱项
    advice.children = [];

    for (const pkgItem of packageItems) {
      const childAdvice = new h12_yzxb();
      advice.children.push(childAdvice);

      // 设置子医嘱基本信息
      await this._setChildAdviceBaseInfo(childAdvice, advice);

      // 获取子项目详情
      const childItem = await this._getItemDetail(pkgItem);

      // 设置子项目信息
      this._setChildItemInfo(childAdvice, childItem);
    }
  }

  /**
   * 设置子医嘱基本信息
   * @private
   */
  async _setChildAdviceBaseInfo(childAdvice: h12_yzxb, parentAdvice: h12_yzxb) {
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
    childAdvice.hdbz = parentAdvice.hdbz;
    childAdvice.lryid = this.gstr_ainf.u_userid;
    childAdvice.yzzh = parentAdvice.yzzh;
    childAdvice.ysbz = 0;
    childAdvice.ypid = parentAdvice.xmid;

    // 设置医生信息
    if (this.gstr_ainf.u_zcid === '0106') {
      childAdvice.kssxys = this.gstr_ainf.u_userid;
    } else {
      childAdvice.ksys = this.gstr_ainf.u_userid;
    }

    childAdvice.yzrq = new Date();
  }

  /**
   * 设置子项目信息
   * @private
   */
  _setChildItemInfo(childAdvice: h12_yzxb, childItem: any) {
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
}
