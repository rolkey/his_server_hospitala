// src/services/config-reader.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParamService } from './param.service';
import { G_ksidDto } from '../dto/g_ksid.dto';
import { usrcat as Usrcat } from '@/modules/usrcat/usrcat.entity';
import { ksmc as Ksmc } from '@/modules/ksmc/ksmc.entity';
import { Gstr_ainfDto } from '../dto/gstr_ainf.dto';
import { Gs_cxszDto } from '../dto/gs_cxsz.dto';
import { Gs_cxsz_ssDto } from '../dto/gs_cssz_ss.dto';

@Injectable()
export class ConfigReaderService {
  // 构造函数
  constructor(
    @InjectRepository(Usrcat)
    private usrcatRepository: Repository<Usrcat>,
    @InjectRepository(Ksmc)
    private ksmcRepository: Repository<Ksmc>,
    private readonly paramService: ParamService,
  ) {}

  async readGsCxsz(): Promise<Gs_cxszDto> {
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
      //
      yzinsert,
      blvb,
      zyxxts,
      zysort,
      ysstopbz,
      yssytsbl,
      ssvb,
      lssyplid,
      lssyplidbz,
      sssqvb,
      drgbz,
      //
      drgData,
      drghis,
      brsort,
      zyyjkbz,
      zytsyzbz,
      yfselectbz,
      yzzhautobz,
      zyysfilter,
      zyysypts,
      zysqzld,
      zysytsbz,
      yxbzauto,
      zyysjmmm,
      szzyh,
      zysyzxybz,
      yzlsfybz,
      yzdzjmbz,
      ybjkmode,
      ylmbbz,
      ylybksid,
      kssz,
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
      //
      this.paramService.gfGetParaNew(12, 'yzinsert', '1', '启用医嘱插入权限(1启用,0不启用)'),
      this.paramService.gfGetParaNew(
        12,
        'blvb',
        'w_h12bl_main_new',
        '病历版本窗口(w_h12bl_main,w_h12bl_main_new)',
      ),
      this.paramService.gfGetParaNew(12, 'xxts', '0', '启用住院天数信息提示(1启用,0不启用)'),
      this.paramService.gfGetParaNew(12, 'zysort', '0', '启用医嘱日期排序(1启用,0不启用)'),
      this.paramService.gfGetParaNew(12, 'ysstopbz', '0', '启用医生停嘱自动退费(1启用,0不启用)'),
      this.paramService.gfGetParaNew(12, 'yssytsbl', '0', '病案首页特殊病例(0普通,104001长期精神)'),
      this.paramService.gfGetParaNew(15, 'ssvb', '0', '手术模板版本(0旧版,1新版)'),
      this.paramService.gfGetParaNew(12, 'lssyplid', 'QD', '临时医嘱频率默认'),
      this.paramService.gfGetParaNew(12, 'lssyplidbz', '1', '临时医嘱药品频率默认(1启用,0不启用)'),
      this.paramService.gfGetParaNew(15, 'sssqvb', 'V1.0', '手术申请版(V1.0,V2.0)'),
      this.paramService.gfGetParaNew(12, 'drgbz', '0', 'drg入组标志(0不启用,1本本司,2南宁,3其他)'),
      this.paramService.gfGetParaNew(
        12,
        'drgData',
        'http://yxhjkj.drg.cpolar.cn/api/drgGroup/getData/',
        '第三方drg入组数据返回地址',
      ),
      this.paramService.gfGetParaNew(
        12,
        'drghis',
        'http://yxhjkj.drg.cpolar.cn/api/drgGroup/hisDetail/',
        '第三方drg入组网页返回地址',
      ),
      this.paramService.gfGetParaNew(
        12,
        'brsort',
        'rycw',
        '住院医生病人列表排序(rycw,zybh,mzys,cysj)',
      ),
      this.paramService.gfGetParaNew(99, 'zyyjkbz', '1', '住院清单押金是否显示(0不显示,1显示)'),
      this.paramService.gfGetParaNew(12, 'zytsyzbz', '0', '住院特殊医嘱显示(0不显示,1显示)'),
      this.paramService.gfGetParaNew(12, 'yfselectbz', '0', '住院医嘱选择药局(0否,1是)'),
      this.paramService.gfGetParaNew(12, 'yzzhautobz', '0', '住院医嘱自动生成组号(0否,1是)'),
      this.paramService.gfGetParaNew(
        12,
        'zyysfilter',
        '1',
        '住院病人列表(0按主冶医师,1按管床医师)',
      ),
      this.paramService.gfGetParaNew(12, 'zyysypts', '0', '住院药品缺药是否允许保存(0否,1是)'),
      this.paramService.gfGetParaNew(
        13,
        'zysqzld',
        '1',
        '医嘱中医治疗单格式(1不良上下午,2时间签名,3..',
      ),
      this.paramService.gfGetParaNew(12, 'zysyts', '1', '病案首页护理天数小时转换(0否,1是'),
      this.paramService.gfGetParaNew(30, 'yxbzauto', '0', '启用手工控制库存有效标志(1是，0否)'),
      this.paramService.gfGetParaNew(12, 'zyysjmmm', '1', '住院医嘱签名是否需要密码(0否,1是)'),
      this.paramService.gfGetPara(60, 'szzyh', '0', '住院号自动生成'),
      this.paramService.gfGetParaNew(12, 'zysyzxybz', '0', '病案首页中西医是否西医首页(0否,1是)'),
      this.paramService.gfGetParaNew(30, 'yzlsfybz', '0', '启用临时医嘱发药包括出院带药(1是，0否)'),
      this.paramService.gfGetParaNew(99, 'yzdzjmbz', '0', '启用住院医嘱、首页电子签名(1是，0否)'),
      this.paramService.gfGetParaNew(
        1,
        'xyb_znsc_mode',
        '0',
        '医保接口智能审查模式-0直连模式1服务模式',
      ),
      this.paramService.gfGetParaNew(81, 'ylmbbz', '0', '启用养老管理系统(1启用，0未启用)'),
      this.paramService.gfGetParaNew(81, 'ylybksid', '', '启用养老医保科室编号'),
      this.paramService.gfGetPara(30, 'yzkssz', '0', '医嘱科室发药'),
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
      //
      yzinsert,
      blvb,
      zyxxts,
      zysort,
      ysstopbz,
      yssytsbl,
      ssvb,
      lssyplid,
      lssyplidbz,
      sssqvb,
      drgbz,
      //
      drgData,
      drghis,
      brsort,
      zyyjkbz,
      zytsyzbz,
      yfselectbz,
      yzzhautobz,
      zyysfilter,
      zyysypts,
      zysqzld,
      zysytsbz,
      yxbzauto,
      zyysjmmm,
      szzyh,
      zysyzxybz,
      yzlsfybz,
      yzdzjmbz,
      ybjkmode,
      ylmbbz,
      ylybksid,
      kssz,
    };
  }
  async readYfCxsz(as_ksid: string, systemId: number): Promise<YfCsszDto> {
    const [xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid, jpksid, hlksid] =
      await Promise.all([
        this.paramService.gfGetPara(systemId, 'xy' + as_ksid, '0603', '西药' + as_ksid),
        this.paramService.gfGetPara(systemId, 'cy' + as_ksid, '0603', '成药' + as_ksid),
        this.paramService.gfGetPara(systemId, 'zy' + as_ksid, '0604', '中药' + as_ksid),
        this.paramService.gfGetPara(systemId, 'cl' + as_ksid, '0603', '材料' + as_ksid),
        this.paramService.gfGetPara(systemId, 'qt' + as_ksid, '0603', '其他' + as_ksid),
        this.paramService.gfGetPara(systemId, 'zj' + as_ksid, '0603', '针剂' + as_ksid),
        this.paramService.gfGetPara(systemId, 'sscl' + as_ksid, as_ksid, '手术材料' + as_ksid),
        this.paramService.gfGetPara(systemId, 'jp' + as_ksid, '0603', '放射材料' + as_ksid),
        this.paramService.gfGetPara(systemId, 'hl' + as_ksid, '0603', '检验材料' + as_ksid),
      ]);

    return {
      xyksid,
      cyksid,
      zyksid,
      clksid,
      qtksid,
      zjksid,
      ssclksid,
      jpksid,
      hlksid,
      // 添加新的字段到返回值
      //   cssz,
    };
  }

  async readGstrAinf({ userId, systemId }): Promise<Gstr_ainfDto> {
    const jcdzbz = await this.paramService.gfGetParaNew(
      12,
      'BLJCURLbz',
      '0',
      '检查接口调用方URL是否统一启用(1启用,0不启用)',
    );

    // 查找用户
    const userQuery = this.usrcatRepository
      .createQueryBuilder('a')
      .innerJoin('__ksry', 'b', 'a.usid = b.usid AND b.syid = :systemId', { systemId })
      .select([
        'a.unam AS unam',
        'a.pwrd AS pwrd',
        'a.hzsr AS hzsr',
        'a.bmlx AS bmlx',
        'a.xgmm AS xgmm',
        'a.bgmm AS bgmm',
        'a.mmyx AS mmyx',
        'a.zhjy AS zhjy',
        'a.mmrq AS mmrq',
        'b.ksid AS ksid',
        'a.zcid AS zcid',
        'a.zwid AS zwid',
        'a.ybry AS ybry',
      ])
      .where('a.usid = :userId OR (a.usid = :sa AND :userId = :sa AND b.syid = :systemId)', {
        userId,
        sa: 'SA',
        systemId,
      })
      .limit(1);

    const userData = await userQuery.getRawOne();
    const gstr_ainfDto = new Gstr_ainfDto();

    if (userData) {
      gstr_ainfDto.u_userid = userId.toUpperCase();
      gstr_ainfDto.u_username = userData.unam || '';
      //   gstr_ainfDto.u_password = userData.pwrd || '';
      gstr_ainfDto.u_hzsr = (userData.hzsr || '').toLowerCase();
      gstr_ainfDto.u_bmlx = (userData.bmlx || '').toLowerCase();
      gstr_ainfDto.u_xgmm = userData.xgmm !== 0;
      gstr_ainfDto.u_bgmm = userData.bgmm !== 0;
      gstr_ainfDto.u_mmyx = userData.mmyx !== 0;
      gstr_ainfDto.u_zhjy = userData.zhjy !== 0;
      gstr_ainfDto.u_ksid = userData.ksid?.trim() || '';
      gstr_ainfDto.u_zcid = userData.zcid || '';
      gstr_ainfDto.u_zwid = userData.zwid || '';
      gstr_ainfDto.ysgjbm = userData.ybry || '';

      // 查找科室
      if (userData.ksid) {
        const department = await this.ksmcRepository.findOne({
          where: { ksid: userData.ksid },
          select: ['ksmc', 'ksfl'],
        });

        if (department) {
          gstr_ainfDto.u_ksmc = department.ksmc || '';
          gstr_ainfDto.ksfl = String(department.ksfl) || '0';
        } else {
          gstr_ainfDto.u_ksmc = '';
          gstr_ainfDto.ksfl = '0';
        }
      }
    } else {
      throw new BadRequestException(
        userId + ' 在科室人员表中没有配置！！请在维护系统中配置后才能正常工作！！',
      );
    }

    return {
      ...gstr_ainfDto,
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
      s_systemid: systemId,
    };
  }

  async readGConfigs(): Promise<any> {
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
      gs_zydjf: await this.paramService.gfGetPara(13, 'zydjf', '0', '中药代煎费'),
      gs_zydjf1: await this.paramService.gfGetPara(13, 'zydjf1', '0', '中药代煎费1'),
      gs_zydjf2: await this.paramService.gfGetPara(13, 'zydjf2', '0', '中药代煎费2'),
      gs_yzsssh: await this.paramService.gfGetPara(13, 'yzsssh', '0', '医嘱实时审核'),
    };
  }

  async readAllConfigs({ userId, systemId }): Promise<any> {
    const [gs_cxsz, gstr_ainf, g_configs] = await Promise.all([
      this.readGsCxsz(),
      this.readGstrAinf({ userId, systemId }),
      this.readGConfigs(),
    ]);

    return {
      gs_cxsz,
      gstr_ainf,
      g_configs,
    };
  }

  // src/services/config-reader.service.ts
  // ... 其他代码保持不变 ...

  // 读取手术模块配置
  async readGsCxsz_ss(): Promise<Gs_cxsz_ssDto> {
    const [
      ssvb,
      ssksid,
      ssclksid,
      yzlsfybz,
      yxbzauto,
      kcpdhb,
      cfyymc,
      zycfgs,
      yppfjgbz,
      ypzsmbz,
      zsmscpcbz,
      zsmysxsbz,
      ykzsmyf,
    ] = await Promise.all([
      this.paramService.gfGetParaNew(15, 'ssvb', '0', '手术模板版本(0旧版,1新版)'),
      this.paramService.gfGetPara(15, 'ssksid', '', '手术科室'),
      this.paramService.gfGetPara(15, 'sscl', '', '手术材料'),
      this.paramService.gfGetParaNew(30, 'yzlsfybz', '0', '启用临时医嘱发药包括出院带药(1是，0否)'),
      this.paramService.gfGetParaNew(30, 'yxbzauto', '0', '启用手工控制库存有效标志(1是，0否)'),
      this.paramService.gfGetParaNew(30, 'kcpdhb', '0', '库存盘点是否合并数量(1合并，0分批次)'),
      this.paramService.gfGetParaNew(0, 'cfyymc', '', '处方显示医院名称'),
      this.paramService.gfGetParaNew(
        30,
        'zycfgs',
        '0',
        '门诊中药处方格式(0默认,1四行,其他格式数字)',
      ),
      this.paramService.gfGetParaNew(30, 'yppfjgbz', '1', '启用进货价格显示(1是，0否)'),
      this.paramService.gfGetParaNew(30, 'ypzsmbz', '0', '启用药品追溯码数量自动计算(1是，0否)'),
      this.paramService.gfGetParaNew(30, 'zsmscpcbz', '0', '启用追溯码关联批次(1是，0否)'),
      this.paramService.gfGetParaNew(30, 'zsmysxsbz', '0', '启用追溯码只扫最小包装(1是，0否)'),
      this.paramService.gfGetParaNew(30, 'ykzsmyf', '0', '启用追溯码领用免扫码(1是，0否)'),
    ]);

    return {
      ssvb,
      ssksid,
      ssclksid,
      yzlsfybz,
      yxbzauto,
      kcpdhb,
      cfyymc,
      zycfgs,
      yppfjgbz,
      ypzsmbz,
      zsmscpcbz,
      zsmysxsbz,
      ykzsmyf,
    };
  }

  // 读取用户信息
  async readGstrAinf_ss({ userId, systemId }): Promise<Gstr_ainfDto> {
    // 复用现有的readGstrAinf方法
    return this.readGstrAinf({ userId, systemId });
  }

  // 读取系统配置
  async readGConfigs_ss(): Promise<any> {
    const [gl_djws, gs_hskcbz, gs_hsgl, gs_ckfs, gs_yksl] = await Promise.all([
      this.paramService.gfGetPara(13, 'yzyxsj', '4', '医嘱单价位数'),
      this.paramService.gfGetPara(13, 'hskcbz', '0', '录医嘱提示库存'),
      this.paramService.gfGetPara(13, 'hsgl', '1', '医嘱库存标志(1,关联;0不关联)'),
      this.paramService.gfGetPara(30, 'cksl', '1', '是否允许出库数量'),
      this.paramService.gfGetPara(30, 'yksl', '0', '启用药品预扣数量'),
    ]);

    return {
      gl_djws,
      gs_hskcbz,
      gs_hsgl,
      gs_ckfs,
      gs_yksl,
    };
  }

  // 修改ssapConfigs方法
  async ssapConfigs({ userId, systemId }): Promise<any> {
    const [gs_cxsz, gstr_ainf, g_configs] = await Promise.all([
      this.readGsCxsz_ss(), // 使用新的手术配置方法
      this.readGstrAinf_ss({ userId, systemId }),
      this.readGConfigs_ss(),
    ]);

    // 获取各类药品和材料的ksid
    const ksids = await this.getKsids(gstr_ainf.u_ksid);

    return {
      gs_cxsz,
      gstr_ainf,
      g_configs,
      g_ksid: ksids, // 展开ksids对象
    };
  }

  /**
   * 获取各类药品和材料的ksid
   * @param uKsid 用户ksid
   * @returns 返回包含各类药品和材料ksid的对象
   */
  public async getKsids(uKsid: string): Promise<G_ksidDto> {
    // 并行获取西药、成药、中药、材料、其他、针剂的ksid
    if (!uKsid) {
      uKsid = '0109'; // HIS系统在初始化的时候是写死的，未知原因
    }
    const [xyksid, cyksid, zyksid, clksid, qtksid, zjksid] = await Promise.all([
      this.paramService.gfGetPara(13, `xy${uKsid}`, '0603', `西药${uKsid}`),
      this.paramService.gfGetPara(13, `cy${uKsid}`, '0603', `成药${uKsid}`),
      this.paramService.gfGetPara(13, `zy${uKsid}`, '0604', `中药${uKsid}`),
      this.paramService.gfGetPara(13, `cl${uKsid}`, '0603', `材料${uKsid}`),
      this.paramService.gfGetPara(13, `qt${uKsid}`, '0603', `其他${uKsid}`),
      this.paramService.gfGetPara(13, `zj${uKsid}`, '0603', `针剂${uKsid}`),
    ]);

    const ssclksid = await this.paramService.gfGetPara(
      13,
      `sscl${uKsid}`,
      clksid,
      `手术材料${uKsid}`,
    );

    return { xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid };
  }
}
