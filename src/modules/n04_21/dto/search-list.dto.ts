import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export const SEARCH_FILTER_OPS = [
  'eq',
  'ne',
  'like',
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
  'empty',
  'notEmpty',
] as const;

export type SearchFilterOp = (typeof SEARCH_FILTER_OPS)[number];

export class SearchFilterItemDto {
  @ApiProperty({ description: '字段名（白名单内）', example: 'xm' })
  @Allow()
  @IsString()
  @IsNotEmpty({ message: '过滤字段不能为空' })
  field: string;

  @ApiProperty({
    description:
      '操作符：eq等于 / ne不等于 / like包含 / gt大于 / gte大于等于 / lt小于 / lte小于等于 / between区间 / empty为空 / notEmpty不为空',
    enum: SEARCH_FILTER_OPS,
    example: 'like',
  })
  @Allow()
  @IsIn(SEARCH_FILTER_OPS)
  op: SearchFilterOp;

  @ApiPropertyOptional({ description: '比较值；区间时为起始值' })
  @Allow()
  @IsOptional()
  value?: string | number | null;

  @ApiPropertyOptional({ description: '区间结束值' })
  @Allow()
  @IsOptional()
  value2?: string | number | null;
}

export class SearchListQueryDto {
  @ApiPropertyOptional({
    description: '动态过滤条件，可按 N04_21 列表字段任意增删',
    type: [SearchFilterItemDto],
  })
  @Allow()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => SearchFilterItemDto)
  filters?: SearchFilterItemDto[];

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNo?: number;

  @ApiPropertyOptional({ description: '每页条数', default: 100 })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize?: number;
}
