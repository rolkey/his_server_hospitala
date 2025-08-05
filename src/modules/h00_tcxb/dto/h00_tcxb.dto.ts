// src/h00_tcxb/h00_tcxb.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H00TcxbBaseDto {
  @Allow()
  tcid: string;

  @Allow()
  mxxh: number;

  @Allow()
  xmid?: string;

  @Allow()
  xmmc?: string;

  @Allow()
  dwzl?: number;

  @Allow()
  jldw?: string;

  @Allow()
  jldj?: number;

  @Allow()
  jlsl?: number;

  @Allow()
  slsx?: number;

  @Allow()
  slxx?: number;

  @Allow()
  sfbz?: number;

  @Allow()
  xzbz?: number;

  @Allow()
  fybz?: string;

  @Allow()
  fylbid?: string;

  @Allow()
  cjid?: string;

  @Allow()
  scph?: string;

  @Allow()
  pfjg?: number;

  @Allow()
  xmgg?: string;

  @Allow()
  zflx?: string;

  @Allow()
  xmzl?: number;

  @Allow()
  bzxx?: string;

  @Allow()
  syffid?: string;

  @Allow()
  syplid?: string;

  @Allow()
  bz1?: string;

  @Allow()
  bz2?: string;

  @Allow()
  bz3?: string;

  @Allow()
  qt2?: string;

  @Allow()
  qt3?: string;

  @Allow()
  ltbz?: string;
}

export class CreateH00TcxbDto extends H00TcxbBaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
}

export class UpdateH00TcxbDto extends PartialType(H00TcxbBaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH00TcxbDto extends PartialType(H00TcxbBaseDto) {
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  pageNo?: number;

  @Allow()
  pageSize?: number;

  // 排序相关参数
  // @Allow()
  // sortBy?: string;

  // @Allow()
  // sortOrder?: 'ASC' | 'DESC';
}

export class H00TcxbResponseDto extends H00TcxbBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}
