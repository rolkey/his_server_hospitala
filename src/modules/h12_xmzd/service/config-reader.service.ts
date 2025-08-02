// src/services/config-reader.service.ts
import { Injectable } from '@nestjs/common';
import { ParamService } from './param.service';

@Injectable()
export class ConfigReaderService {
  constructor(private readonly paramService: ParamService) {}

  async readGsCxsz() {
    const [
      zybh,
      szbahauto,
      mrxf,
      mrsj,
      mrjg,
      mrxj,
      mrmz,
      mrgj,
      //
      hlfylbid,
      bcfylbid,
      xgfylbid,
      qtfylbid,
      mrfylbid,
      zyfylbid,
      ctfylbid,
      xdfylbid,
      kffylbid,
      //
      printgs,
      basy,
      yzxsall,
      xbl,
      yztj,
      zyyjfg,
      hljk,
      mmgl,
      bqgl,
      sygd,
      tmyp,
      yzbgs,
      //
      yzprintgs,
      yzsl,
      sqdgs,
      mbsz,
      ssksid,
      syzd,
      ckfs,
      sysj,
      //
      zysfdz,
      tsyzsx,
      syplsx,
      yzjssl,
      yzprint,
      zybhsz,
      yzzld,
    ] = await Promise.all([
      this.paramService.gfGetPara(11, 'zybh', '0', '住院号不允许'),
      this.paramService.gfGetPara(60, 'szbahauto', '1', '病案号自动生成'),
      this.paramService.gfGetPara(50, 'mrxf', '广西', '默认省份'),
      this.paramService.gfGetPara(50, 'mrsf', '', '默认市份'),
      this.paramService.gfGetPara(50, 'mrjg', '', '默认籍贯'),
      this.paramService.gfGetPara(50, 'mrxz', '', '默认乡份'),
      this.paramService.gfGetPara(50, 'mrmz', '', '默认民族'),
      this.paramService.gfGetPara(50, 'mrgj', 'CHN', '默认国籍'),
      //
      this.paramService.gfGetPara(40, 'hlfylbid', '08', '化验费用类别'),
      this.paramService.gfGetPara(40, 'bcfylbid', '', 'B超费用类别'),
      this.paramService.gfGetPara(40, 'xgfylbid', '', 'X光费用类别'),
      this.paramService.gfGetPara(40, 'qtfylbid', '', '其他费用类别'),
      this.paramService.gfGetPara(40, 'mrfylbid', '', 'MR费用类别'),
      this.paramService.gfGetPara(40, 'zyfylbid', '', '中医费用类别'),
      this.paramService.gfGetPara(40, 'ctfylbid', '', 'CT费用类别'),
      this.paramService.gfGetPara(40, 'xdfylbid', '', '心电费用类别'),
      this.paramService.gfGetPara(40, 'kffylbid', '', '康复费用类别'),
      //
      this.paramService.gfGetPara(13, 'printgs', '0', '住院打印格式'),
      this.paramService.gfGetPara(13, 'basy', '0', '病案首页格式'),
      this.paramService.gfGetPara(99, 'yzxsall', '0', '显示未停医嘱'),
      this.paramService.gfGetPara(12, 'xbl', '0', '启用新病历'),
      this.paramService.gfGetPara(12, 'yztj', '1', '分长临医嘱提交'),
      this.paramService.gfGetPara(13, 'yjfg', '0', '检验分管打印'),
      this.paramService.gfGetPara(12, 'hljk', '本公司', '化验接口公司'),
      this.paramService.gfGetPara(13, 'mmgl', '1', '允许医生生成毛毛关联'),
      this.paramService.gfGetPara(13, 'bqgl', '0', '启用病区管理'),
      this.paramService.gfGetPara(50, 'sygd', '0', '允许首页医生归档'),
      this.paramService.gfGetPara(30, 'tmyp', '0', '启用毒麻药品'),
      this.paramService.gfGetPara(12, 'yzbgs', '格式2', '医嘱本格式'),
      //
      this.paramService.gfGetPara(12, 'yzprintgs', '全部模式', '医嘱打印模式'),
      this.paramService.gfGetPara(12, 'yzsl', '26', '打印医嘱行数'),
      this.paramService.gfGetPara(22, 'sqdgs', '1', '门诊申请格式'),
      this.paramService.gfGetPara(23, 'mbsz', '1', '默认模板选择'),
      this.paramService.gfGetPara(15, 'ssksid', '', '手术科室'),
      this.paramService.gfGetPara(50, 'syzd', '1', '允许首页过滤诊断'),
      this.paramService.gfGetPara(30, 'cksl', '1', '是否允许出库数量'),
      this.paramService.gfGetPara(50, 'sysj', '24', '出院时间限制首页修改'),
      //
      this.paramService.gfGetPara(11, 'zysfdz', '2', '启用住院登记地址模式'),
      this.paramService.gfGetPara(13, 'tsyzsx', '0', '启用特殊医嘱录入'),
      this.paramService.gfGetPara(13, 'syplsx', '1', '启用医嘱频率中文显示'),
      this.paramService.gfGetPara(13, 'yzjssl', '0', '启用临嘱自动计算总量'),
      this.paramService.gfGetPara(13, 'yzprint', '1', '不限制病案首页打印'),
      this.paramService.gfGetPara(11, 'zybhsz', '按自定义', '住院号生成规则'),
      this.paramService.gfGetPara(13, 'yzzld', '单人一张', '医嘱治疗格式'),
    ]);

    return {
      zybh,
      szbahauto,
      mrxf,
      mrsj,
      mrjg,
      mrxj,
      mrmz,
      mrgj,
      //
      hlfylbid,
      bcfylbid,
      xgfylbid,
      qtfylbid,
      mrfylbid,
      zyfylbid,
      ctfylbid,
      xdfylbid,
      kffylbid,
      //
      printgs,
      basy,
      yzxsall,
      xbl,
      yztj,
      zyyjfg,
      hljk,
      mmgl,
      bqgl,
      sygd,
      tmyp,
      yzbgs,
      //
      yzprintgs,
      yzsl,
      sqdgs,
      mbsz,
      ssksid,
      syzd,
      ckfs,
      sysj,
      //
      zysfdz,
      tsyzsx,
      syplsx,
      yzjssl,
      yzprint,
      zybhsz,
      yzzld,
    };
  }

  async readGstrAinf() {
    const jcdzbz = await this.paramService.gfGetParaNew(
      12,
      'BLJCURLbz',
      '0',
      '检查接口调用方URL是否统一启用(1启用,0不启用)',
    );
    return {
      gjjgbm: await this.paramService.gfGetParaNew(1, 'xyb_yydm', '', '国家医保平台机构编码'),
      jcdzbz: jcdzbz,
      jcdz:
        jcdzbz === '1'
          ? await this.paramService.gfGetParaNew(
              12,
              'BLJCURL',
              'http://134.202.128.4:801/yapacs.aspx?hisid=',
              '检查接口调用方URL由平台提供参数',
            )
          : '',
      jcdzxd: await this.paramService.gfGetParaNew(
        12,
        'BLJCXDURL',
        '',
        '检查心电接口调用方URL由心电提供参数',
      ),
    };
  }

  async readGConfigs() {
    return {
      gl_djws: await this.paramService.gfGetPara(13, 'yzyxsj', '4', '医嘱单价位数'),
      gs_fyts: await this.paramService.gfGetPara(11, 'fyts', '0', '住院天数算法'),
      gs_kpgs: await this.paramService.gfGetPara(13, 'kpgs', '3', '卡片打印格式'),
      gs_hskcbz: await this.paramService.gfGetPara(13, 'hskcbz', '0', '录医嘱提示库存'),
      gs_yszx: await this.paramService.gfGetPara(12, 'yszx', '0', '允许医生执行'),
      gs_hsxh: await this.paramService.gfGetPara(13, 'hsxh', '0', '缩图排序住号'),
      gs_mhcx: await this.paramService.gfGetPara(22, 'mhcx', '0', '输入法模糊查询'),
      gs_kszybh: await this.paramService.gfGetPara(13, 'kszybh', '0', '住院部分住院号'),
      gs_qfsz: await this.paramService.gfGetPara(13, 'qfsz', '0', '区分批零价'),
      gs_hsgl: await this.paramService.gfGetPara(13, 'hsgl', '1', '医嘱库存标志(1,关联;0不关联)'),
      gs_xetwd: await this.paramService.gfGetPara(13, 'xetwd', '1', '新生儿体温单'),
      gs_printgs: await this.paramService.gfGetPara(13, 'printgs', '0', '住院打印格式'),
      gs_zysy: await this.paramService.gfGetPara(50, 'zysy', '0', '中医首页'),
      gs_zymc: await this.paramService.gfGetPara(50, 'zysymc', '0', '编码与名称'),
      gs_cwxs: await this.paramService.gfGetPara(13, 'zycwxs', '1', '住院显示床位'),
      gs_szbah: await this.paramService.gfGetPara(60, 'szbah', '0', '病案与住院号一致'),
    };
  }

  async readAllConfigs() {
    const [gs_cxsz, gstr_ainf, g_configs] = await Promise.all([
      this.readGsCxsz(),
      this.readGstrAinf(),
      this.readGConfigs(),
    ]);

    return {
      gs_cxsz,
      gstr_ainf,
      g_configs,
    };
  }
}
