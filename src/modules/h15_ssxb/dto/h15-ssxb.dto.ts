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
  @IsString()
  @Length(1, 12)
  ssid: string;

  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;

  @Allow()
  @IsInt()
  ssmxid: number;

  @Allow()
  @IsString()
  @Length(1, 12)
  czid: string;

  @Allow()
  @IsInt()
  xh: number;

  @Allow()
  @IsString()
  @Length(1, 8)
  ksid: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  xmmc?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  xmid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  xmgg?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  xmdw?: string;

  @Allow()
  @IsOptional()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  xmdj?: number;

  @Allow()
  @IsOptional()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  jfyl?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  syffid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(2)
  typbz?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  tcbz?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(12)
  zflx?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  fylbid?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  tpbz?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  fybz?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  jsbz?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsdh?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  sfbz?: number;

  @Allow()
  @IsOptional()
  @IsDateString()
  ssrq?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  mbid?: string;

  @Allow()
  @IsOptional()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  zfbl?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ybfl?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  xnhbz?: number;

  @Allow()
  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  @Type(() => Number)
  jzje?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  jzry?: string;

  @Allow()
  @IsInt()
  maxid: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(12)
  scph?: string;

  @Allow()
  @IsOptional()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  pfjg?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ypdh?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  scpc?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  cjid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  bz1?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  bz2?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  xmzl?: number;

  @Allow()
  @IsOptional()
  @IsInt()
  tjbz?: number;

  @Allow()
  @IsOptional()
  @IsInt()
  sjbz?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  fydh?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  zxksid?: string;

  @Allow()
  @IsOptional()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  sjtysl?: number;

  @Allow()
  @IsOptional()
  @IsDateString()
  fysj?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  ybbz?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  gjybbm?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  gjybmc?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  syplid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  sjjl?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  jldw?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ksys?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kssxys?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kshs?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  hdhs?: string;

  @Allow()
  @IsOptional()
  @IsDateString()
  hdrq?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  hdbz?: number;

  @Allow()
  @IsOptional()
  @IsDateString()
  sxrq?: string;

  @Allow()
  @IsOptional()
  @IsDateString()
  scrq?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  fyrid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(15)
  tcid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  tcmc?: string;
}

/**
 * 创建 DTO
 */
export class CreateH15SsxbDto extends BaseH15SsxbDto {
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
 */
export class UpdateH15SsxbDto extends PartialType(BaseH15SsxbDto) {
  // 主键字段通常不更新
}

/**
 * 查询 DTO
 */
export class QueryH15SsxbDto extends PartialType(BaseH15SsxbDto) {
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @Allow()
  @IsOptional()
  @IsString()
  sortBy?: string = 'xh';

  @Allow()
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @Allow()
  @IsOptional()
  @IsString()
  keyword?: string;

  // 收费日期范围查询
  @Allow()
  @IsOptional()
  @IsDateString()
  startSsrq?: string;

  @Allow()
  @IsOptional()
  @IsDateString()
  endSsrq?: string;

  // 项目名称模糊查询
  @Allow()
  @IsOptional()
  @IsString()
  xmmcLike?: string;

  // 费用类型查询
  @Allow()
  @IsOptional()
  @IsString()
  zflx?: string;
}

/**
 * 批量操作 DTO
 */
export class H15SsxbBatchOperationDto {
  @Allow()
  @IsString()
  userId: string;

  @Allow()
  @IsString()
  systemId: string;

  @Allow()
  @IsOptional()
  @IsString()
  operationType?: 'create' | 'update' | 'delete';

  @Allow()
  @IsOptional()
  @Type(() => CreateH15SsxbDto)
  createItems?: CreateH15SsxbDto[];

  @Allow()
  @IsOptional()
  @Type(() => UpdateH15SsxbDto)
  updateItems?: Array<{
    ssid: string;
    zyid: string;
    ssmxid: number;
    czid: string;
    xh: number;
    ksid: string;
    data: UpdateH15SsxbDto;
  }>;

  @Allow()
  @IsOptional()
  deleteItems?: Array<{
    ssid: string;
    zyid: string;
    ssmxid: number;
    czid: string;
    xh: number;
    ksid: string;
  }>;

  @Allow()
  @IsOptional()
  @IsString()
  remark?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  batchNo?: number;
}

/**
 * 收费统计查询 DTO
 */
export class FeeStatisticsDto {
  @Allow()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Allow()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Allow()
  @IsOptional()
  @IsString()
  ksid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  fylbid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  groupBy?: 'day' | 'month' | 'year' | 'ksid' | 'fylbid';
}

/**
 * 收费响应 DTO（可包含计算字段）
 */
export class H15SsxbResponseDto extends BaseH15SsxbDto {
  @Allow()
  @IsOptional()
  formattedSsrq?: string;

  @Allow()
  @IsOptional()
  totalAmount?: number;

  @Allow()
  @IsOptional()
  insuranceAmount?: number;

  @Allow()
  @IsOptional()
  selfPayAmount?: number;
}

/**
 * 收费状态更新 DTO
 */
export class UpdateFeeStatusDto {
  @Allow()
  @IsOptional()
  @IsInt()
  jsbz?: number;

  @Allow()
  @IsOptional()
  @IsString()
  jsdh?: string;

  @Allow()
  @IsOptional()
  @IsString()
  operatorId?: string;

  @Allow()
  @IsOptional()
  @IsString()
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
  @IsOptional()
  @IsString()
  feeType?: string;

  @Allow()
  @IsOptional()
  @IsString()
  feeDesc?: string;

  @Allow()
  @IsOptional()
  @IsDateString()
  feeDate?: string;

  @Allow()
  @IsOptional()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  zfbl?: number;
}
