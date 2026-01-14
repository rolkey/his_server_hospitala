import { PartialType } from '@nestjs/mapped-types';
import {
  Allow,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  MaxLength,
  Length,
  IsDecimal,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 基础 DTO，包含所有字段
 */
export class BaseN0423Dto {
  @Allow()
  zyid: string;

  @Allow()
  ssxh: number;

  @Allow()
  ssjczbm?: string;

  @Allow()
  ssjczrq?: Date;

  @Allow()
  shjb?: string;

  @Allow()
  ssjczmc?: string;

  @Allow()
  sz?: string;

  @Allow()
  yz?: string;

  @Allow()
  ez?: string;

  @Allow()
  qkdj?: string;

  @Allow()
  qkylb?: string;

  @Allow()
  mzfs?: string;

  @Allow()
  mzys?: string;

  @Allow()
  bzxx?: string;

  @Allow()
  bzxx1?: string;

  @Allow()
  sjbz?: number;

  @Allow()
  oprnOperPartCode?: string;

  @Allow()
  oprnConTime?: string;

  @Allow()
  anstLvCode?: string;

  @Allow()
  oprnOptnPartCode?: string;

  @Allow()
  mainOprnFlag?: string;

  @Allow()
  anstAsaLvCode?: string;

  @Allow()
  anstMednCode?: string;

  @Allow()
  anstMednDos?: string;

  @Allow()
  unt?: string;

  @Allow()
  anstBegntime?: Date;

  @Allow()
  anstEndtime?: Date;

  @Allow()
  anstCopnCode?: string;

  @Allow()
  anstCopnDscr?: string;

  @Allow()
  pacuBegntime?: Date;

  @Allow()
  pacuEndtime?: Date;

  @Allow()
  cancOprnFlag?: string;

  @Allow()
  valiFlag?: string;

  @Allow()
  bzxx2?: string;

  @Allow()
  bzxx3?: string;

  @Allow()
  bzxx4?: string;

  @Allow()
  bzxx5?: string;

  @Allow()
  icd10?: string;

  @Allow()
  zwmc?: string;

  @Allow()
  sskssj?: Date;

  @Allow()
  ssjssj?: Date;
}

/**
 * 创建 DTO
 * 继承基础 DTO，可以添加创建特有的验证或字段
 */
export class CreateN0423Dto {
  @Allow()
  zyid?: string;

  @Allow()
  list: BaseN0423Dto[];
}

/**
 * 更新 DTO
 * 继承 PartialType 使所有字段可选
 */
export class UpdateN0423Dto extends PartialType(BaseN0423Dto) {
  // 更新操作通常不更新主键字段
}

/**
 * 查询 DTO
 * 继承 PartialType 使所有字段可选
 * 并添加分页、排序等查询参数
 */
export class QueryN0423Dto extends PartialType(BaseN0423Dto) {
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageNo?: number = 1;

  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number = 10;

  @Allow()
  @IsOptional()
  @IsString()
  sortBy?: string = 'ssxh';

  @Allow()
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @Allow()
  @IsOptional()
  @IsString()
  keyword?: string;

  @Allow()
  @IsOptional()
  startDate?: string;

  @Allow()
  @IsOptional()
  endDate?: string;
}

/**
 * 批量操作参数 DTO
 */
export class N0423BatchOperationDto {
  @Allow()
  @IsString()
  userId: string;

  @Allow()
  @IsString()
  systemId: string;

  @Allow()
  @IsString()
  ksid: string;

  @Allow()
  @IsString()
  operationType: 'create' | 'update' | 'delete';

  @Allow()
  @IsOptional()
  isMainOperation?: boolean;

  @Allow()
  @IsOptional()
  @Type(() => CreateN0423Dto)
  createItems?: CreateN0423Dto[];

  @Allow()
  @IsOptional()
  @Type(() => UpdateN0423Dto)
  updateItems?: Array<{
    zyid: string;
    ssxh: number;
    data: UpdateN0423Dto;
  }>;

  @Allow()
  @IsOptional()
  deleteItems?: Array<{
    zyid: string;
    ssxh: number;
  }>;

  @Allow()
  @IsOptional()
  @IsString()
  remark?: string;

  @Allow()
  @IsOptional()
  @IsNumber()
  batchNo?: number;
}

/**
 * 响应 DTO
 */
export class N0423ResponseDto extends BaseN0423Dto {
  @Allow()
  @IsOptional()
  formattedSsjczmc?: string;

  @Allow()
  @IsOptional()
  formattedIcd10?: string;

  @Allow()
  @IsOptional()
  operationDuration?: string;
}

/**
 * 导入导出 DTO
 */
export class ImportN0423Dto extends BaseN0423Dto {
  @Allow()
  @IsOptional()
  @IsString()
  importSource?: string;

  @Allow()
  @IsOptional()
  @IsString()
  importBatch?: string;
}

export class ExportN0423Dto extends PartialType(BaseN0423Dto) {
  @Allow()
  @IsString()
  exportFormat: 'excel' | 'csv' | 'pdf';

  @Allow()
  @IsOptional()
  @IsString()
  fileName?: string;

  @Allow()
  @IsOptional()
  @IsString({ each: true })
  selectedFields?: string[];
}
