import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { Allow } from 'class-validator';

export class SmSsapBaseDto {
  @Allow()
  zyid: string;

  // 对应 SM_SSSQ.SQDH；创建安排通常来自已有申请单
  @Allow()
  sqdh: number;

  @Allow()
  ssbh?: string;

  @Allow()
  zyh?: string;

  @Allow()
  @Transform(({ value }) => (value ? new Date(value) : null))
  aprq?: Date;

  @Allow()
  @Transform(({ value }) => (value ? new Date(value) : null))
  ssrq?: Date;

  @Allow()
  ssnm?: string;

  @Allow()
  ssdm?: string;

  @Allow()
  ssys?: string;

  @Allow()
  ssys_2?: string;

  @Allow()
  ssyz?: string;

  @Allow()
  ssez?: string;

  @Allow()
  sssz?: string;

  @Allow()
  xshs?: string;

  @Allow()
  xshs_2?: string;

  @Allow()
  xhhs?: string;

  @Allow()
  xhhs_2?: string;

  @Allow()
  mzdm?: string;

  @Allow()
  mzys?: string;

  @Allow()
  mzys_2?: string;

  @Allow()
  jzbz?: number;

  @Allow()
  hzbz?: number;

  @Allow()
  thbz?: number;

  @Allow()
  mzbz?: number;

  @Allow()
  qxbz?: number;

  @Allow()
  ssbz?: number;

  @Allow()
  jfbz?: number;

  @Allow()
  zfbz?: number;

  @Allow()
  wcbz?: number;

  @Allow()
  shbz?: number;

  @Allow()
  ssyq?: string;

  @Allow()
  zysx?: string;

  @Allow()
  czgh?: string;

  @Allow()
  ssfj?: string;

  @Allow()
  ssth?: string;

  @Allow()
  mzwcbz?: number;

  @Allow()
  ssks?: string;

  @Allow()
  sqlx?: number;

  @Allow()
  zdbm?: string;

  @Allow()
  lszd?: string;

  @Allow()
  sslx?: string;

  @Allow()
  sxys?: string;

  @Allow()
  bzxx1?: string;

  @Allow()
  bzxx2?: string;

  @Allow()
  bzxx3?: string;
}

export class CreateSmSsapDto extends SmSsapBaseDto {}

export class UpdateSmSsapDto extends PartialType(SmSsapBaseDto) {}

/** 手术安排修改：主键 zyid、sqdh 必传，其余为可修改字段（只更新传入的字段） */
export class UpdateSmSsapBodyDto extends UpdateSmSsapDto {
  @Allow()
  zyid: string;

  @Allow()
  sqdh: number;
}

/** 取消手术安排：按住院标识 + 申请单号定位安排单 */
export class CancelSmSsapDto {
  @Allow()
  zyid: string;

  @Allow()
  sqdh: number;

  @Allow()
  ssbh?: string;
}

/** 费用列表查询条件（可选），与旧版 PB 查询条件对应 */
export class FeeListQueryDto {
  @Allow()
  zyid?: string;

  @Allow()
  @Transform(({ value }) => (value ? new Date(value) : null))
  ssrqStart?: Date;

  @Allow()
  @Transform(({ value }) => (value ? new Date(value) : null))
  ssrqEnd?: Date;

  /** 作废标志，默认 0 未作废 */
  @Allow()
  zfbz?: number;

  /** 开始日期（入院日期范围），对应 em_sta，格式 YYYY-MM-DD */
  @Allow()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateStart?: Date;

  /** 结束日期（入院日期范围），对应 em_end，格式 YYYY-MM-DD */
  @Allow()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateEnd?: Date;

  /** 是否按入院日期范围筛选，对应 cbx_rq.checked */
  @Allow()
  @Transform(({ value }) => value === 'true' || value === true)
  rqcx?: boolean;

  /**
   * 在院状态：0=全部, 1=在院(zyzt<=2), 3=待办(zyzt=3), 4=出院(zyzt=4)，对应 zt
   */
  @Allow()
  @Transform(({ value }) => (value !== undefined && value !== '' ? Number(value) : undefined))
  zt?: number;

  /** 检索关键字：住院号或姓名，对应 sle_cx；含中文按姓名模糊，否则按住院号前缀 */
  @Allow()
  cx?: string;

  /** 科室 ID，'0' 或空表示全部，对应 ddlb_ksid */
  @Allow()
  ksid?: string;

  /** 病人类型 ID，'0' 或空表示全部，对应 ddlb_brlx */
  @Allow()
  brlx?: string;
}
