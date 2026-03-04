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
export class BaseH15SszbDto {
  @Allow()
  @IsString()
  @Length(1, 12)
  ssid: string;

  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;

  @Allow()
  @IsString()
  @Length(1, 12)
  zybh?: string;

  @Allow()
  @IsInt()
  xh?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ysid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ssysid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  brxm?: string;

  @Allow()
  @IsString()
  @MaxLength(10)
  ksid: string;

  @Allow()
  @IsOptional()
  @IsInt()
  nl?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  cwid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  xbid?: string;

  @Allow()
  @IsOptional()
  @IsDateString()
  ssrq?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  ssmc?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  lryid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kbid?: string;

  @Allow()
  @IsOptional()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  yszje?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  ssj?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  sslb?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  xhhs?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  xshs?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  ssxz?: number;

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
  @IsString()
  @MaxLength(10)
  fyksid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  brlx?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz1?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  bz2?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  zqksid?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  sqdh?: number;
}

/**
 * 创建 DTO
 */
export class CreateH15SszbDto extends BaseH15SszbDto {
  // 可以添加创建时特有的字段
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
export class UpdateH15SszbDto extends PartialType(BaseH15SszbDto) {
  // 注意：主键字段通常不更新，只更新其他字段
  // 如果需要更新主键，需要特殊处理
}

/**
 * 查询 DTO
 */
export class QueryH15SszbDto extends PartialType(BaseH15SszbDto) {
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

  // 手术日期范围查询
  @Allow()
  @IsOptional()
  @IsDateString()
  startSsrq?: string;

  @Allow()
  @IsOptional()
  @IsDateString()
  endSsrq?: string;

  // 手术名称模糊查询
  @Allow()
  @IsOptional()
  @IsString()
  ssmcLike?: string;

  // 病人姓名模糊查询
  @Allow()
  @IsOptional()
  @IsString()
  brxmLike?: string;
}

/**
 * 批量操作 DTO
 */
export class H15SszbBatchOperationDto {
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
  @Type(() => CreateH15SszbDto)
  createItems?: CreateH15SszbDto[];

  @Allow()
  @IsOptional()
  @Type(() => UpdateH15SszbDto)
  updateItems?: Array<{
    ssid: string;
    zyid: string;
    xh: number;
    ksid: string;
    data: UpdateH15SszbDto;
  }>;

  @Allow()
  @IsOptional()
  deleteItems?: Array<{
    ssid: string;
    zyid: string;
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
 * 手术统计查询 DTO
 */
export class SurgeryStatisticsDto {
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
  ssysid?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  sslb?: number;

  @Allow()
  @IsOptional()
  @IsString()
  groupBy?: 'day' | 'month' | 'year' | 'ksid' | 'ssysid';
}

/**
 * 手术响应 DTO（可包含计算字段）
 */
export class H15SszbResponseDto extends BaseH15SszbDto {
  @Allow()
  @IsOptional()
  formattedSsrq?: string;

  @Allow()
  @IsOptional()
  patientAge?: string;

  @Allow()
  @IsOptional()
  surgeryDuration?: string;
}

/**
 * 手术状态更新 DTO
 */
export class UpdateSurgeryStatusDto {
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
  fyksid?: string;

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
 * 手术费用 DTO
 */
export class SurgeryFeeDto {
  @Allow()
  @IsDecimal({ decimal_digits: '4' })
  @Type(() => Number)
  yszje: number;

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
}
