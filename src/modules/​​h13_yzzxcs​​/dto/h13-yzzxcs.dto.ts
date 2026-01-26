// src/h13-yzzxcs/h13-yzzxcs.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow, IsOptional } from 'class-validator';
import { DateTransformer } from '@/common/transformers/date.transformer';

export class H13YzzxcsBaseDto {
  @Allow()
  @IsOptional()
  yzxh: number;

  @Allow()
  @IsOptional()
  mxxh: number;

  @Allow()
  @IsOptional()
  yzlx: number;

  @Allow()
  @IsOptional()
  zyid: string;

  @Allow()
  @IsOptional()
  @DateTransformer()
  zxrq: Date;

  @Allow()
  @IsOptional()
  ksid?: string;

  @Allow()
  @IsOptional()
  fydh?: string;

  @Allow()
  @IsOptional()
  zybh?: string;

  @Allow()
  @IsOptional()
  jfyl?: number;

  @Allow()
  @IsOptional()
  xmdj?: number;

  @Allow()
  @IsOptional()
  sfbz?: number;

  @Allow()
  @IsOptional()
  fylbid?: string;

  @Allow()
  @IsOptional()
  jsdh?: string;

  @Allow()
  @IsOptional()
  jsbz?: number;

  @Allow()
  @IsOptional()
  zxcs2?: number;

  @Allow()
  @IsOptional()
  zxhs?: string;

  @Allow()
  @IsOptional()
  zxsj?: string;

  @Allow()
  @IsOptional()
  zflx?: string;

  @Allow()
  @IsOptional()
  syffid?: string;

  @Allow()
  @IsOptional()
  bzxcs?: number;

  @Allow()
  @IsOptional()
  tyrid?: string;

  @Allow()
  @IsOptional()
  @DateTransformer()
  tysj?: Date;

  @Allow()
  @IsOptional()
  sqtysl?: number;

  @Allow()
  @IsOptional()
  sjtysl?: number;

  @Allow()
  @IsOptional()
  syrid?: string;

  @Allow()
  @IsOptional()
  @DateTransformer()
  sysj?: Date;

  @Allow()
  @IsOptional()
  kyts?: number;

  @Allow()
  @IsOptional()
  zfbl?: number;

  @Allow()
  @IsOptional()
  fybz?: number;

  @Allow()
  @IsOptional()
  @DateTransformer()
  fysj?: Date;

  @Allow()
  @IsOptional()
  fyrid?: string;

  @Allow()
  @IsOptional()
  zxcs?: number;

  @Allow()
  @IsOptional()
  zkksid?: string;

  @Allow()
  @IsOptional()
  clbz?: number;

  @Allow()
  @IsOptional()
  dybz?: number;

  @Allow()
  @IsOptional()
  xnhbz?: number;

  @Allow()
  @IsOptional()
  jzje?: number;

  @Allow()
  @IsOptional()
  jzry?: string;

  @Allow()
  @IsOptional()
  ybfl?: string;

  @Allow()
  @IsOptional()
  maxid?: number;

  @Allow()
  @IsOptional()
  scph?: string;

  @Allow()
  @IsOptional()
  cjid?: string;

  @Allow()
  @IsOptional()
  bz1?: string;

  @Allow()
  @IsOptional()
  zfje?: number;

  @Allow()
  @IsOptional()
  pfjg?: number;

  @Allow()
  @IsOptional()
  xmid?: string;

  @Allow()
  @IsOptional()
  yjry?: string;

  @Allow()
  @IsOptional()
  @DateTransformer()
  yjrq?: Date;

  @Allow()
  @IsOptional()
  yzzh?: number;

  @Allow()
  @IsOptional()
  @DateTransformer()
  czrq?: Date;

  @Allow()
  @IsOptional()
  scpc?: string;

  @Allow()
  @IsOptional()
  @DateTransformer()
  sxrq?: Date;

  @Allow()
  @IsOptional()
  @DateTransformer()
  scrq?: Date;

  @Allow()
  @IsOptional()
  zqksid?: string;
}

export class CreateH13YzzxcsDto extends H13YzzxcsBaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
}

export class UpdateH13YzzxcsDto extends PartialType(H13YzzxcsBaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH13YzzxcsDto extends PartialType(H13YzzxcsBaseDto) {
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  @IsOptional()
  pageNo?: number;

  @Allow()
  @IsOptional()
  pageSize?: number;

  // sortBy?: string;
  // sortOrder?: 'ASC' | 'DESC';
}

export class H13YzzxcsResponseDto extends H13YzzxcsBaseDto {
  @Allow()
  xmmc: string;

  @Allow()
  fylbmc: string;

  @Allow()
  syplmc: string;

  /**
   * 待退数量
   */
  @Allow()
  dtsl: number;

  /**
   * 已退数量
   */
  @Allow()
  ytsl: number;

  /**
   * 退回金额
   */
  @Allow()
  thje: number;
}
