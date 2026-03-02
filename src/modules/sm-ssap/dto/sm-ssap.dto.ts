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

/** 取消手术安排：按住院标识 + 申请单号定位安排单 */
export class CancelSmSsapDto {
  @Allow()
  zyid: string;

  @Allow()
  sqdh: number;

  @Allow()
  ssbh?: string;
}

/** 费用列表查询条件（可选） */
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
}
