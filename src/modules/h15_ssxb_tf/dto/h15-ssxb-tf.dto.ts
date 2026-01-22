import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsDateString,
  MaxLength,
  Min,
  Max,
  IsDecimal,
  IsBoolean,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseH15SsxbDto } from '@/modules/h15_ssxb/dto/h15-ssxb.dto';

/**
 * 基础 DTO，包含所有字段
 */
/**
 * BaseH15SsxbTfDto 类是一个数据传输对象(DTO)，用于定义和验证一系列属性
 * 这些属性可能用于某个系统中的特定业务模块，具有严格的类型和长度限制
 */
export class BaseH15SsxbTfDto {
  // SSID标识符，字符串类型，最大长度为12
  @IsString()
  @MaxLength(12)
  ssid: string;

  @IsString()
  @MaxLength(12)
  zyid: string;

  @IsInt()
  ssmxid: number;

  @IsString()
  @MaxLength(12)
  czid: string;

  @IsInt()
  xh: number;

  @IsString()
  @MaxLength(8)
  ksid: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  xmmc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  xmid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  xmgg?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  xmdw?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  xmdj?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  jfyl?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  syffid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  typbz?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(255)
  tcbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zflx?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fylbid?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(255)
  tpbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fybz?: string;

  @IsOptional()
  @IsInt()
  jsbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsdh?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sfbz?: number;

  @IsOptional()
  @IsDateString()
  ssrq?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  mbid?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zfbl?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  ybfl?: string;

  @IsOptional()
  @IsInt()
  xnhbz?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  jzje?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jzry?: string;

  @IsInt()
  maxid: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  ypdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  scpc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  cjid?: string;

  @IsOptional()
  bz1?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bz2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  scph?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pfjg?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(255)
  xmzl?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(255)
  tjbz?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(255)
  sjbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  fydh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  zxksid?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sjtysl?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  gjybbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  gjybmc?: string;

  @IsOptional()
  @IsDateString()
  fysj?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(255)
  ybbz?: number;

  @IsOptional()
  @IsDateString()
  hdrq?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(32767)
  hdbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  syplid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  sjjl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jldw?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  ksys?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  kssxys?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  kshs?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  hdhs?: string;

  @IsOptional()
  @IsDateString()
  sxrq?: string;

  @IsOptional()
  @IsDateString()
  scrq?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fyrid?: string;
}

/**
 * 创建 DTO
 */
export class CreateH15SsxbTfDto extends PartialType(BaseH15SsxbDto) {
  // 逻辑字段
  tfsl: number;
}

/**
 * 更新 DTO
 */
export class UpdateH15SsxbTfDto extends PartialType(BaseH15SsxbTfDto) {
  // 主键字段通常不更新
}

/**
 * 查询 DTO
 */
export class QueryH15SsxbTfDto extends PartialType(BaseH15SsxbTfDto) {
  @IsOptional()
  @Type(() => Number)
  pageNo?: number = 1;

  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @IsOptional()
  sortBy?: string = 'xh';

  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  keyword?: string;

  // 收费日期范围查询
  @IsOptional()
  @IsDateString()
  startSsrq?: string;

  @IsOptional()
  @IsDateString()
  endSsrq?: string;

  // 项目名称模糊查询
  @IsOptional()
  xmmcLike?: string;

  // 费用类型查询
  @IsOptional()
  zflx?: string;
}

/**
 * 批量操作 DTO
 */
export class H15SsxbTfBatchDto {
  @IsString()
  userId: string;

  @IsString()
  zyid: string;

  @IsOptional()
  @IsString()
  sqdh?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BaseH15SsxbTfDto)
  items?: BaseH15SsxbTfDto[];

  @IsOptional()
  @IsInt({ each: true })
  deleteItems?: number[];
}

/**
 * 收费统计查询 DTO
 */
export class FeeStatisticsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  ksid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fylbid?: string;

  @IsOptional()
  @IsEnum(['day', 'month', 'year', 'ksid', 'fylbid'])
  groupBy?: 'day' | 'month' | 'year' | 'ksid' | 'fylbid';
}

/**
 * 收费响应 DTO（可包含计算字段）
 */
export class H15SsxbTfResponseDto extends BaseH15SsxbTfDto {
  @IsOptional()
  formattedSsrq?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  insuranceAmount?: number;

  @IsOptional()
  @IsNumber()
  selfPayAmount?: number;
}

/**
 * 收费状态更新 DTO
 */
export class UpdateFeeStatusDto {
  @IsOptional()
  @IsInt()
  jsbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  operatorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  operatorName?: string;
}

/**
 * 收费明细 DTO
 */
export class FeeDetailDto {
  @IsNumber()
  @Type(() => Number)
  xmdj: number;

  @IsNumber()
  @Type(() => Number)
  jfyl: number;

  @IsOptional()
  @IsString()
  feeType?: string;

  @IsOptional()
  @IsString()
  feeDesc?: string;

  @IsOptional()
  @IsDateString()
  feeDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zfbl?: number;
}
