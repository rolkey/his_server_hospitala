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
  @IsString()
  @Length(1, 12)
  zyid: string;

  @Allow()
  @IsDecimal({ decimal_digits: '0' })
  ssxh: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  ssjczbm?: string;

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ssjczrq?: Date;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  shjb?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  ssjczmc?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  sz?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  yz?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ez?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  qkdj?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  qkylb?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  mzfs?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  mzys?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx1?: string;

  @Allow()
  @IsOptional()
  @IsInt()
  sjbz?: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  oprnOperPartCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  oprnConTime?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  anstLvCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  oprnOptnPartCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  mainOprnFlag?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  anstAsaLvCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  anstMednCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  anstMednDos?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  unt?: string;

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  anstBegntime?: Date;

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  anstEndtime?: Date;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  anstCopnCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  anstCopnDscr?: string;

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  pacuBegntime?: Date;

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  pacuEndtime?: Date;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(3)
  cancOprnFlag?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(3)
  valiFlag?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx2?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx3?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx4?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx5?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  icd10?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  zwmc?: string;

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sskssj?: Date;

  @Allow()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ssjssj?: Date;
}

/**
 * 创建 DTO
 * 继承基础 DTO，可以添加创建特有的验证或字段
 */
export class CreateN0423Dto {
  @Allow()
  @IsOptional()
  @IsString()
  zyid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  n0423s: BaseN0423Dto[];
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
