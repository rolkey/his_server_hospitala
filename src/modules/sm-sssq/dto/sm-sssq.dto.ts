import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class SmSssqBaseDto {
  @Allow()
  sqdh: number;

  @Allow()
  zyid?: string;

  @Allow()
  zyh?: string;

  @Allow()
  ssk?: string;

  @Allow()
  sqks?: string;

  @Allow()
  sqys?: string;

  @Allow()
  sgrq?: Date;

  @Allow()
  ssrq?: Date;

  @Allow()
  ssdm?: string;

  @Allow()
  ssnm?: string;

  @Allow()
  ssys?: string;

  @Allow()
  ssyz?: string;

  @Allow()
  ssez?: string;

  @Allow()
  sssz?: string;

  @Allow()
  mzdm?: string;

  @Allow()
  mzys?: string;

  @Allow()
  tjbz?: number;

  @Allow()
  apbz?: number;

  @Allow()
  zfbz?: number;

  @Allow()
  txks?: string;

  @Allow()
  czgh?: string;

  @Allow()
  sqtl?: number;

  @Allow()
  sqzd?: number;

  @Allow()
  bzxx?: string;

  @Allow()
  sqlx?: number;

  @Allow()
  ssapsj?: Date;

  @Allow()
  zdbm?: string;

  @Allow()
  lszd?: string;

  @Allow()
  sslx?: string;

  @Allow()
  shbz?: string;

  @Allow()
  bzxx1?: string;

  @Allow()
  bzxx2?: string;

  @Allow()
  bzxx3?: string;

  @Allow()
  bzxx4?: string;

  @Allow()
  bzxx5?: string;
}

export class CreateSmSssqDto extends SmSssqBaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
}

export class UpdateSmSssqDto extends PartialType(SmSssqBaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QuerySmSssqDto extends PartialType(SmSssqBaseDto) {
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  pageNo?: number;

  @Allow()
  pageSize?: number;

  @Allow()
  sortBy?: string;

  @Allow()
  sortOrder?: 'ASC' | 'DESC';
}

export class SmSssqResponseDto extends SmSssqBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}
