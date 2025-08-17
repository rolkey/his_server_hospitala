// src/h13-yzzxcs-tf/h13-yzzxcs-tf.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H13YzzxcsTfBaseDto {
  @Allow()
  yzxh: number;

  @Allow()
  mxxh: number;

  @Allow()
  yzlx: number;

  @Allow()
  zyid: string;

  @Allow()
  zxrq: Date;

  @Allow()
  ksid?: string;

  @Allow()
  fydh?: string;

  @Allow()
  zybh?: string;

  @Allow()
  jfyl?: number;

  @Allow()
  xmdj?: number;

  @Allow()
  sfbz?: number;

  @Allow()
  fylbid?: string;

  @Allow()
  jsdh?: string;

  @Allow()
  jsbz?: number;

  @Allow()
  zxcs2?: number;

  @Allow()
  zxhs?: string;

  @Allow()
  zxsj?: string;

  @Allow()
  zflx?: string;

  @Allow()
  syffid?: string;

  @Allow()
  bzxcs?: number;

  @Allow()
  tyrid?: string;

  @Allow()
  tysj?: Date;

  @Allow()
  sqtysl?: number;

  @Allow()
  sjtysl?: number;

  @Allow()
  syrid?: string;

  @Allow()
  sysj?: Date;

  @Allow()
  kyts?: number;

  @Allow()
  zfbl?: number;

  @Allow()
  fybz?: number;

  @Allow()
  fysj?: Date;

  @Allow()
  fyrid?: string;

  @Allow()
  zxcs?: number;

  @Allow()
  zkksid?: string;

  @Allow()
  clbz?: number;

  @Allow()
  dybz?: number;

  @Allow()
  xnhbz?: number;

  @Allow()
  jzje?: number;

  @Allow()
  jzry?: string;

  @Allow()
  ybfl?: string;

  @Allow()
  maxid?: number;

  @Allow()
  scph?: string;

  @Allow()
  cjid?: string;

  @Allow()
  bz1?: string;

  @Allow()
  zfje?: number;

  @Allow()
  pfjg?: number;

  @Allow()
  xmid?: string;

  @Allow()
  yjry?: string;

  @Allow()
  yjrq?: Date;

  @Allow()
  yzzh?: number;

  @Allow()
  czrq?: Date;

  @Allow()
  scpc?: string;

  @Allow()
  sxrq?: Date;

  @Allow()
  scrq?: Date;
}

export class CreateH13YzzxcsTfDto extends H13YzzxcsTfBaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
}

export class UpdateH13YzzxcsTfDto extends PartialType(H13YzzxcsTfBaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH13YzzxcsTfDto extends PartialType(H13YzzxcsTfBaseDto) {
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  pageNo?: number;

  @Allow()
  pageSize?: number;

  // sortBy?: string;
  // sortOrder?: 'ASC' | 'DESC';
}

export class H13YzzxcsTfResponseDto extends H13YzzxcsTfBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}
