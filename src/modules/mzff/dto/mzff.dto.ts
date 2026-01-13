import { PartialType } from '@nestjs/mapped-types';
import { Allow, IsOptional, IsString, IsNumber, MaxLength, Length } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 基础 DTO，包含所有字段
 */
export class BaseMzffDto {
  @Allow()
  @IsString()
  @Length(1, 10)
  mzid: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mzffmc?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  szbm?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  pybm?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  wbbm?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  qtbm?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  gjbm?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  gjmc?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz1?: string;
}

/**
 * 创建 DTO
 * 继承基础 DTO，可以添加创建特有的验证或字段
 */
export class CreateMzffDto extends BaseMzffDto {
  // 创建时可能需要的额外字段或验证可以在这里添加
  // 例如：操作者信息
  @Allow()
  @IsOptional()
  @IsString()
  creatorId?: string;

  @Allow()
  @IsOptional()
  @IsString()
  creatorName?: string;
}

/**
 * 更新 DTO
 * 继承 PartialType 使所有字段可选
 */
export class UpdateMzffDto extends PartialType(BaseMzffDto) {
  // 注意：更新操作通常不更新主键字段
  // 如果需要更新主键，应该单独处理
}

/**
 * 查询 DTO
 * 继承 PartialType 使所有字段可选
 * 并添加分页、排序等查询参数
 */
export class QueryMzffDto extends PartialType(BaseMzffDto) {
  @Allow()
  @IsOptional()
  @Type(() => Number)
  pageNo?: number = 1;

  @Allow()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @Allow()
  @IsOptional()
  @IsString()
  sortBy?: string = 'mzid';

  @Allow()
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  // 可以添加一些特殊的查询条件
  @Allow()
  @IsOptional()
  @IsString()
  value?: string; // 模糊搜索关键字
}
