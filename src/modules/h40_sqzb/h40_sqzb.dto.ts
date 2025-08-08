// src/h40_sqzb/h40_sqzb.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H40SqzbBaseDto {
  @Allow()
  djbh: string;

  @Allow()
  ksid?: string;

  @Allow()
  ysid?: string;

  @Allow()
  sqsj?: Date;

  @Allow()
  sjzt?: number;

  @Allow()
  bzxx?: string;

  @Allow()
  zxksid?: string;

  @Allow()
  jcbw?: string;

  @Allow()
  jcmd?: string;

  @Allow()
  tz?: string;

  @Allow()
  sqlx?: string;

  @Allow()
  sl?: number;

  @Allow()
  dj?: number;

  @Allow()
  djfl?: string;

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
}

export class CreateH40SqzbDto extends H40SqzbBaseDto {
  // 继承所有基础字段
  // 可以添加创建特有的验证规则
  // 例如确保必填字段：
  // @IsNotEmpty()
  // djbh: string;
}

export class UpdateH40SqzbDto extends PartialType(H40SqzbBaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH40SqzbDto extends PartialType(H40SqzbBaseDto) {
  // 查询参数通常所有字段都是可选的
  // 可以添加分页、排序等查询特有参数
  @Allow()
  pageNo?: number;

  @Allow()
  pageSize?: number;

  // 日期范围查询
  @Allow()
  startDate?: Date;

  @Allow()
  endDate?: Date;

  // 排序相关参数
  @Allow()
  sortBy?: string;

  @Allow()
  sortOrder?: 'ASC' | 'DESC';
}

export class H40SqzbResponseDto extends H40SqzbBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
  // 例如：
  // @Expose()
  // get formattedDate(): string {
  //   return this.sqsj?.toISOString();
  // }
}
