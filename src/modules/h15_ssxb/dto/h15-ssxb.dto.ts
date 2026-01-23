import { PartialType } from '@nestjs/mapped-types';
import {
  Allow,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsDecimal,
  MaxLength,
  Length,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 基础 DTO，包含所有字段
 */
export class BaseH15SsxbDto {
  @Allow()
  ssid: string;

  @Allow()
  zyid: string;

  @Allow()
  ssmxid: number;

  @Allow()
  czid: string;

  @Allow()
  xh: number;

  @Allow()
  ksid: string;

  @Allow()
  xmmc?: string;

  @Allow()
  xmid?: string;

  @Allow()
  xmgg?: string;

  @Allow()
  xmdw?: string;

  @Allow()
  xmdj?: number;

  @Allow()
  jfyl?: number;

  @Allow()
  syffid?: string;

  @Allow()
  typbz?: string;

  @Allow()
  tcbz?: number;

  @Allow()
  zflx?: string;

  @Allow()
  fylbid?: string;

  @Allow()
  tpbz?: number;

  @Allow()
  fybz?: string;

  @Allow()
  jsbz?: number;

  @Allow()
  jsdh?: string;

  @Allow()
  sfbz?: number;

  @Allow()
  @IsDateString()
  ssrq?: string;

  @Allow()
  mbid?: string;

  @Allow()
  zfbl?: number;

  @Allow()
  ybfl?: string;

  @Allow()
  xnhbz?: number;

  @Allow()
  jzje?: number;

  @Allow()
  jzry?: string;

  @Allow()
  maxid: number;

  @Allow()
  scph?: string;

  @Allow()
  pfjg?: number;

  @Allow()
  ypdh?: string;

  @Allow()
  scpc?: string;

  @Allow()
  cjid?: string;

  @Allow()
  bz1?: string;

  @Allow()
  bz2?: string;

  @Allow()
  xmzl?: number;

  @Allow()
  tjbz?: number;

  @Allow()
  sjbz?: number;

  @Allow()
  fydh?: string;

  @Allow()
  zxksid?: string;

  @Allow()
  sjtysl?: number;

  @Allow()
  fysj?: string;

  @Allow()
  ybbz?: number;

  @Allow()
  gjybbm?: string;

  @Allow()
  gjybmc?: string;

  @Allow()
  syplid?: string;

  @Allow()
  sjjl?: string;

  @Allow()
  jldw?: string;

  @Allow()
  ksys?: string;

  @Allow()
  kssxys?: string;

  @Allow()
  kshs?: string;

  @Allow()
  hdhs?: string;

  @Allow()
  hdrq?: string;

  @Allow()
  hdbz?: number;

  @Allow()
  sxrq?: string;

  @Allow()
  scrq?: string;

  @Allow()
  fyrid?: string;

  @Allow()
  tcid?: string;

  @Allow()
  tcmc?: string;

  @Allow()
  h15SsxbTfs: any[]; // 这是一对多关系
}

/**
 * 创建 DTO
 */
export class CreateH15SsxbDto extends PartialType(BaseH15SsxbDto) {}

/**
 * 更新 DTO
 */
export class UpdateH15SsxbDto extends PartialType(BaseH15SsxbDto) {
  // 主键字段通常不更新
}

/**
 * 查询 DTO
 */
export class QueryH15SsxbDto extends PartialType(BaseH15SsxbDto) {
  @Allow()
  @Type(() => Number)
  pageNo?: number = 1;

  @Allow()
  @Type(() => Number)
  pageSize?: number = 10;

  @Allow()
  sortBy?: string = 'xh';

  @Allow()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @Allow()
  keyword?: string;

  @Allow()
  sqdh?: string;

  // 收费日期范围查询
  @Allow()
  startSsrq?: string;

  @Allow()
  endSsrq?: string;

  // 项目名称模糊查询
  @Allow()
  xmmcLike?: string;

  // 费用类型查询
  @Allow()
  zflx?: string;
}

/**
 * 批量操作 DTO
 */
export class H15SsxbBatchDto {
  @Allow()
  userId: string;

  @Allow()
  zyid: string;

  @Allow()
  sqdh?: string;

  @Allow()
  items?: BaseH15SsxbDto[];

  @Allow()
  deleteItems?: number[];
}

/**
 * 收费统计查询 DTO
 */
export class FeeStatisticsDto {
  @Allow()
  @IsDateString()
  startDate?: string;

  @Allow()
  @IsDateString()
  endDate?: string;

  @Allow()
  ksid?: string;

  @Allow()
  fylbid?: string;

  @Allow()
  groupBy?: 'day' | 'month' | 'year' | 'ksid' | 'fylbid';
}

/**
 * 收费响应 DTO（可包含计算字段）
 */
export class H15SsxbResponseDto extends BaseH15SsxbDto {
  @Allow()
  formattedSsrq?: string;

  @Allow()
  totalAmount?: number;

  @Allow()
  insuranceAmount?: number;

  @Allow()
  selfPayAmount?: number;
}

/**
 * 收费状态更新 DTO
 */
export class UpdateFeeStatusDto {
  @Allow()
  jsbz?: number;

  @Allow()
  jsdh?: string;

  @Allow()
  operatorId?: string;

  @Allow()
  operatorName?: string;
}

/**
 * 收费明细 DTO
 */
export class FeeDetailDto {
  @Allow()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  xmdj: number;

  @Allow()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  jfyl: number;

  @Allow()
  feeType?: string;

  @Allow()
  feeDesc?: string;

  @Allow()
  @IsDateString()
  feeDate?: string;

  @Allow()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  zfbl?: number;
}
