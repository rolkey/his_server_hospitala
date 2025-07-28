// src/h12_mbzb/h12_mbzb.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H12_mbzbBaseDto {
  @Allow()
  mbid: string;
  @Allow()
  mblx: number;
  @Allow()
  mbmc?: string;
  @Allow()
  mbbz?: string;
  @Allow()
  pybm?: string;
  @Allow()
  wbbm?: string;
  @Allow()
  qtbm?: string;
  @Allow()
  ksid?: string;
  @Allow()
  mbfl?: string;
  @Allow()
  ysid?: string;
  @Allow()
  bz1?: string;
  @Allow()
  bz2?: string;
  @Allow()
  bz3?: string;
}

export class CreateH12_mbzbDto extends H12_mbzbBaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
}

export class UpdateH12_mbzbDto extends H12_mbzbBaseDto {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH12_mbzbDto extends H12_mbzbBaseDto {
  @Allow()
  value?: string;
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  pageNo?: number;
  @Allow()
  pageSize?: number;
  //   sortBy?: string;
  //   sortOrder?: 'ASC' | 'DESC';
}

export class H12_mbzbResponseDto extends H12_mbzbBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}
