import { Injectable } from '@nestjs/common';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { N0422 } from '../n04_22/n04_22.entity';
import { N04_23 } from '../n04-23/n04-23.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { ParamService } from '../h12_xmzd/service/param.service';

/**
 * 病人信息接口
 */
/**
 * 病人信息视图对象（与后端 HisCaseVo 对应）
 */
export interface HisCaseVo {
  /** 记录ID */
  ID?: number | null;
  /** 分院ID */
  hospitalId?: number | null;
  /** 对应医院系统的记录ID */
  hisId?: string | null;
  /** 住院号 */
  patientNo?: string | null;
  /** 病人姓名 */
  patientName?: string | null;
  /** 岁数（字符串） */
  age?: string | null;
  /** 年龄（数字） */
  ageS?: number | null;
  /** 年龄段：0-成人,1-儿童,2-婴儿 */
  ageCategory?: string | null;
  /** 病案号 */
  caseNum?: string | null;
  /** 住院次数 */
  admissionNo?: number | null;
  /** 床号 */
  bedNo?: string | null;
  /** 支付类型 */
  pamentType?: string | null;
  /** 性别 */
  sex?: string | null;
  /** 出生日期 */
  birthDate?: Date | null;
  /** 入院日期 */
  admissionDate?: Date | null;
  /** 出院日期 */
  dischargeDate?: Date | null;
  /** 科室ID */
  deptId?: string | null;
  /** 科室名称 */
  deptName?: string | null;
  /** 结算时间 */
  settlementDate?: Date | null;
  /** 结算单号 */
  settNum?: string | null;
  /** 归档时间 */
  archivingTime?: Date | null;
  /** 医疗费用 */
  totalAmount?: number | null;
  /** 主治医生ID */
  doctorId?: string | null;
  /** 主治医生姓名 */
  doctorName?: string | null;
  /** 主管医生ID */
  managerDoctorId?: string | null;
  /** 主管医生姓名 */
  managerDoctorName?: string | null;
  /** 主任医生ID */
  deptDoctorId?: string | null;
  /** 主任医生姓名 */
  deptDoctorName?: string | null;
  /** 婴儿重量 */
  babyWeight?: number | null;
  /** 离院方式 */
  dischargeStatus?: string | null;
  /** 入院方式 */
  claimTypeName?: string | null;
  /** 住院状态 */
  inState?: number | null;
  /** 支付状态 */
  payState?: number | null;
  /** 归档状态 */
  codingStatus?: string | null;
  /** 创建时间 */
  createDate?: Date | null;
  /** 更新时间 */
  updateDate?: Date | null;
  /** 住院天数 */
  stayDays?: number | null;
  /** 医院级别 */
  hisLevel?: number | null;
  /** 费用 */
  cost?: number | null;
  /** 医保类别 */
  drgBenefitType?: string | null;
  /** 生日（天） */
  birthDays?: number | null;
  /** 主诊编码 */
  mainDiagCode?: string | null;
  /** 主手编码 */
  mainOperCode?: string | null;
  /** 生育险 */
  isMaternity?: boolean | null;
  /** 工伤险 */
  isInjury?: boolean | null;
  /** 大病险 */
  isSeriousIllness?: boolean | null;
  /** 参数 */
  params?: Record<string, any>;
}

/**
 * 诊断信息视图对象（与后端 HisCaseDiagVo 对应）
 */
export interface HisCaseDiagVoTs {
  /** 记录ID */
  id?: number | null;
  /** 诊断序号 */
  diagnosisNum?: number | null;
  /** 诊断类型 */
  diagnosisType?: string | null;
  /** 诊断代码 */
  diagnosisCode?: string | null;
  /** 诊断名称 */
  diagnosisName?: string | null;
  /** 手术类型：0-诊断,1-手术 */
  operType?: number | null;
  /** 主诊标志 */
  mainFlag?: string | null;
  /** 危急情况 */
  criticalCondition?: number | null;
  /** 数据来源 */
  dataSource?: string | null;
  /** 医院系统患者ID */
  hisId?: string | null;
  /** 档案表ID */
  hisCaseId?: number | null;
}

/**
 * 费用明细视图对象（与后端 HisCaseChargeVo 对应）
 */
export interface HisCaseChargeVoTs {
  id?: number | null;
  hospitalId?: number | null;
  hisId?: string | null;
  caseId?: number | null;
  category?: string | null; // 费用类别
  usageDate?: Date | null; // 费用日期
  itemIdHosp?: string | null; // 医院项目ID
  itemNameHosp?: string | null; // 医院项目名称
  medicalItemId?: string | null; // 医保编码
  medicalItemName?: string | null; // 医保名称
  drugUsage?: string | null; // 用法
  drugSpec?: string | null; // 规格
  dosageForm?: string | null; // 剂型
  packageUnit?: string | null; // 包装单位
  unitPrice?: number | null; // 单价
  num?: number | null; // 数量
  cost?: number | null; // 金额
  cashAmount?: number | null; // 现金支付
  benifitType?: string | null; // 医保类别
  benifitState?: number | null; // 医保状态
  deptCode?: string | null; // 科室代码
  deptName?: string | null; // 科室名称
  doctorId?: string | null; // 医生代码
  doctorName?: string | null; // 医生姓名
  doctorTitle?: string | null; // 医师职称代码
  doctorTitleName?: string | null; // 医师职称
  settlementNum?: string | null; // 结算单号
  settlementId?: number | null; // 结算单ID
  prescDeptCode?: string | null; // 执行科室代码
  prescDeptName?: string | null; // 执行科室名称
  prescDoctorCode?: string | null; // 执行医生代码
  prescDoctorName?: string | null; // 执行医生姓名
  nbFlag?: string | null; // 成人/婴儿
  adviceId?: string | null; // 医嘱ID
  cancelFlag?: string | null; // 取消标志
  storeId?: string | null; // 仓库ID
  storeName?: string | null; // 仓库名称
  adviceGroupId?: number | null; // 医嘱组号
}

// 辅助：安全取字符串并 trim
function safeTrim(s: any): string | null {
  if (s === null || s === undefined) return null;
  if (typeof s === 'string') return s.trim();
  return String(s);
}

/**
 * 将病人信息实体 h11_brxx 映射为 HisCaseVo 对象
 * @param brxx 病人信息实体（已加载关联实体）
 * @returns 映射后的 HisCaseVo 对象
 */
function mapBrxxToHisCaseVo(brxx: h11_brxx): Partial<HisCaseVo> {
  // 性别映射（根据实际业务编码调整）
  const sexMap: Record<string, string> = {
    '1': '男',
    '2': '女',
    // 可扩展其他编码
  };
  const sex = brxx.xbid ? sexMap[brxx.xbid] || brxx.xbid : undefined;

  // 提取年龄数字（假设 brnl 格式如 "35岁"）
  let ageS: number | undefined;
  if (brxx.brnl) {
    const match = brxx.brnl.match(/\d+/);
    if (match) ageS = parseInt(match[0], 10);
  }

  // 获取医生姓名（优先使用关联实体，否则使用ID）
  const doctorName = brxx.mzysEntity?.unam ?? brxx.mzys;
  const managerDoctorName = brxx.sxysEntity?.unam ?? brxx.sxys;

  return {
    hisId: brxx.patientId, // 对应医院系统的记录ID
    patientNo: brxx.zybh, // 住院号
    patientName: brxx.brxm, // 病人姓名
    age: brxx.brnl, // 年龄（字符串）
    ageS, // 年龄（数字）
    birthDate: brxx.csrq, // 出生日期
    admissionDate: brxx.rysj, // 入院日期
    dischargeDate: brxx.cysj, // 出院日期
    deptId: brxx.ryksid, // 科室ID
    deptName: brxx.ryksmc, // 科室名称
    settlementDate: brxx.jssj, // 结算时间
    settNum: brxx.lsh, // 结算单号
    stayDays: brxx.zyts, // 住院天数（由实体 @AfterLoad 计算）
    sex, // 性别（中文）
    pamentType: brxx.sflx, // 支付类型
    claimTypeName: brxx.ryff, // 入院方式
    inState: brxx.zyzt, // 住院状态（0/1/2/3/4）
    doctorId: brxx.mzys, // 主治医生ID
    doctorName, // 主治医生姓名
    managerDoctorId: brxx.sxys, // 主管医生ID（或上级医生）
    managerDoctorName, // 主管医生姓名
    caseNum: brxx.bahm, // 病案号
    admissionNo: brxx.zycs, // 住院次数
    bedNo: brxx.rycw, // 床号（实际是床位ID，可能需要转换）
    babyWeight: brxx.etrytz ? parseFloat(brxx.etrytz) : undefined, // 婴儿重量
    dischargeStatus: brxx.cybs, // 离院方式（出院标识）
    totalAmount: brxx.qfje ?? brxx.fdje, // 医疗费用（优先使用欠费金额，可调整）
    // 以下字段根据业务需要从其他实体或默认值补充
    // codingStatus: brxx.???,
    // archivingTime: brxx.???,
    // createDate: new Date(),
    // updateDate: new Date(),
    // hisLevel: undefined,
    // cost: undefined,
    // drgBenefitType: undefined,
    // drgVersion: undefined,
    // mainDiagCode: undefined,
    // mainOperCode: undefined,
    // isMaternity: undefined,
    // isInjury: undefined,
    // isSeriousIllness: undefined,
  };
}

/**
 * 将诊断实体列表转换为 HisCaseDiagVo 列表
 * @param zdxx 诊断实体列表（N0422[]）
 * @param hisId 医院系统患者ID（可选，可从 brxx 中获取）
 * @param hisCaseId 档案表ID（可选，暂未提供可传 null）
 * @returns HisCaseDiagVo 列表
 */
function mapZdxxToHisDiagVo(
  zdxx: N0422[],
  hisId?: string | null,
  hisCaseId?: number | null,
): HisCaseDiagVoTs[] {
  return zdxx.map((diag) => ({
    diagnosisNum: diag.zdxh,
    diagnosisType: diag.zdlx,
    diagnosisCode: diag.zdbm,
    diagnosisName: diag.zdmc,
    mainFlag: diag.maindiag_flag,
    // 以下字段根据业务需要设置默认值或从其他来源获取
    operType: 0, // 默认视为诊断，若需区分手术可后续扩展
    criticalCondition: null, // 危急情况字段，若无数据设为 null
    dataSource: null, // 数据来源，如需标识可传入固定值
    hisId: hisId ?? null,
    hisCaseId: hisCaseId ?? null,
  }));
}

/**
 * 将手术实体列表转换为 HisCaseDiagVo 列表（手术类型）
 * @param ssxx 手术实体列表
 * @param hisId 医院系统患者ID
 * @param hisCaseId 档案表ID（可选）
 * @returns 手术信息列表
 */
function mapSsxxToHisOperVo(
  ssxx: N04_23[],
  hisId?: string | null,
  hisCaseId?: number | null,
): HisCaseDiagVoTs[] {
  if (!ssxx || ssxx.length === 0) return [];

  return ssxx.map((surgery) => ({
    diagnosisNum: surgery.ssxh, // 手术序号
    diagnosisCode: surgery.ssjczbm || surgery.icd10, // 优先使用手术编码，备选ICD10
    diagnosisName: surgery.ssjczmc || surgery.zwmc, // 优先使用手术名称，备选中文名
    operType: 1, // 手术类型固定为1
    mainFlag: surgery.main_oprn_flag, // 主手术标志（如 '1' 表示是主手术）
    // 以下字段根据业务需要补充默认值或留空
    diagnosisType: null, // 手术无诊断类型
    criticalCondition: null, // 危急情况无对应字段
    dataSource: null, // 数据来源暂不填
    hisId: hisId ?? null,
    hisCaseId: hisCaseId ?? null,
  }));
}

/**
 * 将医嘱实体列表转换为费用明细列表
 * @param yzxb 医嘱实体列表（建议提前加载关联实体）
 * @param hisId 医院系统患者ID（对应 HisCaseChargeVo.hisId）
 * @param caseId 档案ID（对应 HisCaseChargeVo.caseId，可选）
 * @returns 费用明细列表
 */
function mapYzxxToHisChargeVo(
  yzxb: h12_yzxb[],
  hisId?: string | null,
  caseId?: number | null,
): HisCaseChargeVoTs[] {
  if (!yzxb || yzxb.length === 0) return [];

  return yzxb.map((item) => {
    // 基础信息
    const charge: HisCaseChargeVoTs = {
      hisId: hisId ?? null,
      caseId: caseId ?? null,
      // 费用日期：优先使用医嘱日期 yzrq，若无则尝试使用开始日期组合（暂不组合）
      usageDate: item.yzrq ?? null,
      // 项目信息
      itemIdHosp: item.xmid ?? null,
      itemNameHosp: item.xmmc ?? null,
      // 医保编码：优先使用国家医保编码，否则使用项目ID
      medicalItemId: item.gjybbm ?? item.xmid ?? null,
      medicalItemName: item.gjybmc ?? item.xmmc ?? null,
      // 药品相关信息
      drugUsage: item.syffidEntity?.syffmc ?? item.syffid ?? null,
      drugSpec: item.xmgg ?? null,
      dosageForm: item.ypzdEntity?.zwmc ?? null, // 剂型（需药品字典）
      packageUnit: item.xmdw ?? null,
      unitPrice: item.xmdj ?? null,
      // 数量和金额：数量使用计费用量，金额优先使用实付金额，否则计算
      num: item.jfyl ?? null,
      cost: item.sfje ?? (item.xmdj && item.jfyl ? item.xmdj * item.jfyl : null),
      cashAmount: null, // 无对应字段
      // 医保相关
      benifitType: item.fylbidEntity?.fylbmc ?? item.fylbid ?? null,
      benifitState: null,
      // 科室信息
      deptCode: item.ksid ?? null,
      deptName: item.ksidEntity?.ksmc ?? null,
      // 开单医生
      doctorId: item.ksys ?? null,
      doctorName: item.ksysEntity?.unam ?? null,
      // 职称信息（无对应）
      doctorTitle: null,
      doctorTitleName: null,
      // 结算信息（无对应）
      settlementNum: null,
      settlementId: null,
      // 执行科室（无直接对应，可暂用开单科室）
      prescDeptCode: item.ksid ?? null,
      prescDeptName: item.ksidEntity?.ksmc ?? null,
      // 执行医生：使用结束医生（可能代表执行医生）
      prescDoctorCode: item.jsys ?? null,
      prescDoctorName: item.jsysEntity?.unam ?? null,
      // 成人/婴儿（需结合患者年龄，此处暂不设置，后续可补充）
      nbFlag: null,
      // 医嘱标识
      adviceId: item.yzxh ? `${item.yzxh}` : null, // 序号可作唯一标识
      cancelFlag: item.tzbz === 1 ? '1' : null, // 停用标志作为取消标志（1表示停用）
      // 仓库信息（无对应）
      storeId: null,
      storeName: null,
      // 医嘱组号
      adviceGroupId: item.yzzh ?? null,
    };

    return charge;
  });
}

const DataSource = {
  CHARGE: 'charge',
  ADVICE: 'advice',
  DIAG: 'diagnosis',
  OPER: 'operators',
} as const;

/**
 * 医嘱审核类
 */
@Injectable()
export class H12CheckService {
  constructor(private readonly paramService: ParamService) {}
  /**
   * 医嘱审核
   * @param brxx 患者信息
   * @param zdxx 诊断
   * @param ssxx 手术
   * @param yzxb 医嘱
   */
  async checkAdvice(brxx: h11_brxx, zdxx: N0422[], ssxx: N04_23[], yzxb: h12_yzxb[]) {
    // 把数据转为审核需要的格式
    const hisCaseVo = mapBrxxToHisCaseVo(brxx);
    const hisCaseDiagVo = mapZdxxToHisDiagVo(zdxx, brxx.patientId, null);
    const hisCaseOperVo = mapSsxxToHisOperVo(ssxx, brxx.patientId, null);
    const hisCaseChargeVo = mapYzxxToHisChargeVo(yzxb, brxx.patientId, null);
    hisCaseVo.params.set(DataSource.DIAG, hisCaseDiagVo);
    hisCaseVo.params.set(DataSource.OPER, hisCaseOperVo);
    hisCaseVo.params.set(DataSource.CHARGE, hisCaseChargeVo);

    const url = `http://192.168.168.128:8080/rolkey-drgi-zfd-rk/his-hac/checkAdviceRealTime`;
    // 通过调用Post方法调用远程审核接口
    // const result = await axios.post(url, hisCaseVo);
  }
}
