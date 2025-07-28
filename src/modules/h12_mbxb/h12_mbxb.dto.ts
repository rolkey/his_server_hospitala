// src/h12_mbxb/h12_mbxb.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H12_mbxbBaseDto {
  @Allow()
  mblx: number;
  @Allow()
  mbid: string;
  @Allow()
  mxxh: number;
  @Allow()
  xmid?: string;
  @Allow()
  xmmc?: string;
  @Allow()
  jfyl?: number;
  @Allow()
  sjyl?: number;
  @Allow()
  syffid?: string;
  @Allow()
  syplid?: string;
  @Allow()
  xmgg?: string;
  @Allow()
  xmdw?: string;
  @Allow()
  xmdj?: number;
  @Allow()
  typbz?: string;
  @Allow()
  tcbz?: number;
  @Allow()
  scdh?: string;
  @Allow()
  fylbid?: string;
  @Allow()
  sfje?: number;
  @Allow()
  sfbz?: number;
  @Allow()
  fybz?: string;
  @Allow()
  bzxx?: string;
  @Allow()
  zflx?: string;
  @Allow()
  xmzl?: number;
  @Allow()
  cjid?: string;
  @Allow()
  scph?: string;
  @Allow()
  pfjg?: number;
  @Allow()
  szbz?: number;
  @Allow()
  sjyl1?: string;
  @Allow()
  mrcs?: number;
  @Allow()
  bz1?: string;
  @Allow()
  bz2?: string;
  @Allow()
  jldw?: string;
  @Allow()
  gsid?: string;
  @Allow()
  ypfl?: string;
  @Allow()
  dwjb?: number;
  @Allow()
  kyfs?: number;
  @Allow()
  yzzh?: number;
  @Allow()
  yzmxxh?: number;
  @Allow()
  qt1?: string;
  @Allow()
  ltbz?: string;
}

export class CreateH12_mbxbDto extends H12_mbxbBaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
}

export class UpdateH12_mbxbDto extends H12_mbxbBaseDto {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH12_mbxbDto extends H12_mbxbBaseDto {
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  pageNo?: number;
  @Allow()
  pageSize?: number;
  // sortBy?: string;
  // sortOrder?: 'ASC' | 'DESC';
}

export class H12_mbxbResponseDto extends H12_mbxbBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}
