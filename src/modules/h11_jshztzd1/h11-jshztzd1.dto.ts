import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H11Jshztzd1BaseDto {
  @Allow()
  zyid: string;

  @Allow()
  ksid: string;

  @Allow()
  qfbz: number;

  @Allow()
  zybh?: string;

  @Allow()
  brxm?: string;

  @Allow()
  yjhz?: number;

  @Allow()
  jshz?: number;

  @Allow()
  syyj?: number;

  @Allow()
  qtje?: number;

  @Allow()
  hkdz?: string;

  @Allow()
  cycw?: string;

  @Allow()
  tjsj?: Date;

  @Allow()
  tjbz?: number;

  @Allow()
  tjry?: string;

  @Allow()
  hdry?: string;

  @Allow()
  hdbz?: number;

  @Allow()
  hdsj?: Date;
}

export class CreateH11Jshztzd1Dto extends H11Jshztzd1BaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
}

export class UpdateH11Jshztzd1Dto extends PartialType(H11Jshztzd1BaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH11Jshztzd1Dto extends PartialType(H11Jshztzd1BaseDto) {
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  pageNo?: number;

  @Allow()
  pageSize?: number;

  // @Allow()
  // sortBy?: string;

  // @Allow()
  // sortOrder?: 'ASC' | 'DESC';
}

export class H11Jshztzd1ResponseDto extends H11Jshztzd1BaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}
