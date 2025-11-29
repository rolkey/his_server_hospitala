// src/h12_cycl/h12_cycl.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H12CyclBaseDto {
  @Allow()
  zyid: string;

  @Allow()
  zybh?: string;

  @Allow()
  brxm?: string;

  @Allow()
  xbid?: string;

  @Allow()
  rycw?: string;

  @Allow()
  ryqk?: string;

  @Allow()
  rysj?: Date;

  @Allow()
  ksid?: string;

  @Allow()
  rybs?: string;

  @Allow()
  cyqk?: string;

  @Allow()
  cysj?: Date;

  @Allow()
  cyys?: string;

  @Allow()
  lrsj?: Date;

  @Allow()
  bzxx?: string;

  @Allow()
  bz1?: string;

  @Allow()
  bz2?: string;

  @Allow()
  bz3?: string;

  @Allow()
  bz4?: string;

  @Allow()
  bz5?: string;

  @Allow()
  sjzt?: number;
}

export class CreateH12CyclDto extends H12CyclBaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
}

export class UpdateH12CyclDto extends PartialType(H12CyclBaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH12CyclDto extends PartialType(H12CyclBaseDto) {
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  pageNo?: number;

  @Allow()
  pageSize?: number;

  // 日期范围查询
  @Allow()
  rysjStart?: Date;

  @Allow()
  rysjEnd?: Date;

  @Allow()
  cysjStart?: Date;

  @Allow()
  cysjEnd?: Date;

  @Allow()
  lrsjStart?: Date;

  @Allow()
  lrsjEnd?: Date;

  // 排序相关参数
  @Allow()
  sortBy?: string;

  @Allow()
  sortOrder?: 'ASC' | 'DESC';
}

export class H12CyclResponseDto extends H12CyclBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}
