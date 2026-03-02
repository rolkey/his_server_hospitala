import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsArray, Allow } from 'class-validator';

export class QueryParamsDto {
  @Allow()
  @IsOptional()
  ksid?: string;

  @Allow()
  @IsOptional()
  brid?: string;

  /**
   * 处理标志：是否已经被处理，0未处理 1已处理
   */
  @Allow()
  clbz: string;

  @IsOptional()
  value?: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageNo: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageSize: number;

  @Allow()
  kssj: string;

  @Allow()
  jssj: string;
}

export class ConfigDto {
  @Allow()
  hlfylbid0: string;

  @Allow()
  hlfylbid1: string;

  @Allow()
  hlfylbid2: string;

  @Allow()
  hlfylbid3: string;

  @Allow()
  hlfylbid4: string;
}

// 患者信息DTO
export class PatientInfoDto {
  // 业务类型：1-门诊 2-住院
  ywlx: number;

  // 病人ID
  brid: string;

  // 病人基本信息
  brxm: string; // 病人姓名
  xbid: string; // 性别ID
  brnl: string; // 病人年龄
  nldw: string; // 年龄单位
  zxsj: Date; // 执行时间

  // 医生科室信息
  ysid: string; // 医生ID
  ksid: string; // 科室ID
  zdmc: string; // 诊断名称
  zdicd: string; // 诊断ICD

  // 病人分类信息
  brlbid: string; // 病人类别ID
  qtid: string; // 其他ID
  brlxid: string; // 病人类型ID

  // 联系信息
  sfzh: string; // 身份证号
  lxdh: string; // 联系电话
  lxdz: string; // 联系地址
  jtdh: string; // 家庭电话
  hkdz: string; // 户口地址

  // 其他信息
  ylzh: string; // 医疗证号
  csrq: Date; // 出生日期
  bzxx: string; // 备注信息

  // 住院特有字段
  zybh: string; // 住院编号
  yzxs: string; // 医嘱形式
  ryzd: string; // 入院诊断
  cycw: string; // 出院床位
  rycw: string; // 入院床位
  bz2: string; // 备注2
  ryksmc: string; // 入院科室名称
  rysj: Date; // 入院时间
  mzys: string; // 门诊医生
  zyzt: string; // 住院状态
}

// 在his-tech.dto.ts中添加
export class YzDetailDto {
  zyid: string; // 住院ID
  yzlx: string; // 医嘱类型
  yzxh: number; // 医嘱序号
  mxxh: number; // 明细序号
  yzzh: number; // 医嘱组号
  xmid: string; // 项目ID
  xmmc: string; // 项目名称
  jfyl: number; // 计费用量
  ksys: string; // 开始医生
  kssxys: string; // 开始执行医生
  xmdj: number; // 项目单价
  xmdw: string; // 项目单位
  xmgg: string; // 项目规格
  clbz: number; // 处理标志
  ksid: string; // 科室ID
  szbz: number; // 收费标志
  bzxx: string; // 备注信息
  zxhs: string; // 执行护士
  zxsj: string; // 执行时间
  cjid: string; // 采集ID
  maxid: number; // 最大ID
  yjry: string; // 检验人员
  yjrq: string; // 检验日期
  zxrq: string; // 执行日期
  yzrq: string; // 医嘱日期
  tzrq: string; // 停止日期
  scdh: string; // 申请单号
}

export class CfDetailDto {
  mzid: string;
  cfid: string;
  mxxh: number;
  xmmc: string;
  xmid: string;
  yzcs: number;
  ksid: string;
  zxsz: number;
  sl: number;
  dj: number;
  yjry: string;
  yjrq: Date;
  jcbw: string;
  jcmd: string;
}

export class Execute0Dto {
  @Allow()
  mxxh: number[];

  @Allow()
  cfid: string;

  @Allow()
  ksid: string;

  @Allow()
  userId: string;
}

export class Execute1Dto {
  @Allow()
  userId: string;

  @Allow()
  zyid: string;

  @Allow()
  scdh: string;
}
