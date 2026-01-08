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
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 基础 DTO，包含所有字段
 */
export class BaseN0422Dto {
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;

  @Allow()
  @IsDecimal({ decimal_digits: '0' })
  zdxh: number;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  zdmc?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  zdbm?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  zdbq?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  zdlx?: string;

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
  palgNo?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  iptPatnDisediag?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(3)
  maindiagFlag?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  inhospDiagCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  admDiseCondCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  admCondCode?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  highDiagEvid?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  bkupDegCode?: string;

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
}

/**
 * 创建 DTO
 * 继承基础 DTO，可以添加创建特有的验证或字段
 */
export class CreateN0422Dto extends BaseN0422Dto {
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
export class UpdateN0422Dto extends PartialType(BaseN0422Dto) {
  // 注意：更新操作通常不更新主键字段
  // 如果需要更新主键，应该单独处理
}

/**
 * 查询 DTO
 * 继承 PartialType 使所有字段可选
 * 并添加分页、排序等查询参数
 */
export class QueryN0422Dto extends PartialType(BaseN0422Dto) {
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
  sortBy?: string = 'zdxh';

  @Allow()
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  // 可以添加一些特殊的查询条件
  @Allow()
  @IsOptional()
  @IsString()
  keyword?: string; // 模糊搜索关键字

  @Allow()
  @IsOptional()
  startDate?: string; // 开始日期

  @Allow()
  @IsOptional()
  endDate?: string; // 结束日期
}

/**
 * 批量操作参数 DTO
 * 类似您的 H12_yzxbOpeDto
 */
export class N0422BatchOperationDto {
  @Allow()
  @IsString()
  userId: string;

  @Allow()
  @IsString()
  systemId: string;

  @Allow()
  @IsString()
  ksid: string;

  // 操作类型：create, update, delete
  @Allow()
  @IsString()
  operationType: 'create' | 'update' | 'delete';

  // 是否为诊断主记录
  @Allow()
  @IsOptional()
  isMainDiagnosis?: boolean;

  // 批量创建的数据
  @Allow()
  @IsOptional()
  @Type(() => CreateN0422Dto)
  createItems?: CreateN0422Dto[];

  // 批量更新的数据
  @Allow()
  @IsOptional()
  @Type(() => UpdateN0422Dto)
  updateItems?: Array<{
    zyid: string;
    zdxh: number;
    data: UpdateN0422Dto;
  }>;

  // 批量删除的数据
  @Allow()
  @IsOptional()
  deleteItems?: Array<{
    zyid: string;
    zdxh: number;
  }>;

  // 附加信息
  @Allow()
  @IsOptional()
  @IsString()
  remark?: string;

  // 组号或批次号
  @Allow()
  @IsOptional()
  @IsNumber()
  batchNo?: number;
}

/**
 * 响应 DTO（可选）
 * 用于控制 API 返回的字段
 */
export class N0422ResponseDto extends BaseN0422Dto {
  // 可以添加一些计算字段或格式化后的字段
  @Allow()
  @IsOptional()
  formattedZdmc?: string;

  @Allow()
  @IsOptional()
  formattedIcd10?: string;
}

/**
 * 导入导出 DTO（可选）
 */
export class ImportN0422Dto extends BaseN0422Dto {
  @Allow()
  @IsOptional()
  @IsString()
  importSource?: string;

  @Allow()
  @IsOptional()
  @IsString()
  importBatch?: string;
}

export class ExportN0422Dto extends PartialType(BaseN0422Dto) {
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
