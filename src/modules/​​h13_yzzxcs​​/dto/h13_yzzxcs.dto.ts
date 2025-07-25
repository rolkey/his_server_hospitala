import { Exclude } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsDecimal,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';

export class Createh13_yzzxcsDto {
  @IsNotEmpty({ message: '医嘱序号不能为空' })
  @IsInt({ message: '医嘱序号必须是整数' })
  yzxh: number;

  @IsNotEmpty({ message: '明细序号不能为空' })
  @IsInt({ message: '明细序号必须是整数' })
  mxxh: number;

  @IsNotEmpty({ message: '医嘱类型不能为空' })
  @IsInt({ message: '医嘱类型必须是整数' })
  yzlx: number;

  @IsNotEmpty({ message: '住院ID不能为空' })
  @IsString({ message: '住院ID必须是字符串' })
  @MaxLength(12, { message: '住院ID长度不能超过12个字符' })
  zyid: string;

  @IsNotEmpty({ message: '执行日期不能为空' })
  @IsDate({ message: '执行日期必须是有效日期' })
  zxrq: Date;

  @IsOptional()
  @IsString({ message: '科室ID必须是字符串' })
  @MaxLength(10, { message: '科室ID长度不能超过10个字符' })
  ksid?: string;

  @IsOptional()
  @IsString({ message: '费用单号必须是字符串' })
  @MaxLength(12, { message: '费用单号长度不能超过12个字符' })
  fydh?: string;

  @IsOptional()
  @IsString({ message: '住院编号必须是字符串' })
  @MaxLength(12, { message: '住院编号长度不能超过12个字符' })
  zybh?: string;

  @IsOptional()
  @IsDecimal({}, { message: '计费数量必须是有效的小数' })
  jfyl?: number;

  @IsOptional()
  @IsDecimal({}, { message: '项目单价必须是有效的小数' })
  xmdj?: number;

  @IsOptional()
  @IsInt({ message: '收费标志必须是整数' })
  sfbz?: number;

  @IsOptional()
  @IsString({ message: '费用类别ID必须是字符串' })
  @MaxLength(10, { message: '费用类别ID长度不能超过10个字符' })
  fylbid?: string;
}

export class Updateh13_yzzxcsDto {
  @Exclude()
  id: string;

  @IsOptional()
  @IsString({ message: '科室ID必须是字符串' })
  @MaxLength(10, { message: '科室ID长度不能超过10个字符' })
  ksid?: string;

  @IsOptional()
  @IsString({ message: '费用单号必须是字符串' })
  @MaxLength(12, { message: '费用单号长度不能超过12个字符' })
  fydh?: string;

  @IsOptional()
  @IsString({ message: '住院编号必须是字符串' })
  @MaxLength(12, { message: '住院编号长度不能超过12个字符' })
  zybh?: string;

  @IsOptional()
  @IsDecimal({}, { message: '计费数量必须是有效的小数' })
  jfyl?: number;

  @IsOptional()
  @IsDecimal({}, { message: '项目单价必须是有效的小数' })
  xmdj?: number;

  @IsOptional()
  @IsInt({ message: '收费标志必须是整数' })
  sfbz?: number;

  @IsOptional()
  @IsString({ message: '费用类别ID必须是字符串' })
  @MaxLength(10, { message: '费用类别ID长度不能超过10个字符' })
  fylbid?: string;
}

export class Queryh13_yzzxcsDto {
  @Allow()
  @IsOptional()
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小为1' })
  pageSize?: number;

  @Allow()
  @IsOptional()
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为1' })
  pageNo?: number;

  @Allow()
  @IsOptional()
  permissions?: boolean;

  @Allow()
  @IsOptional()
  @IsInt({ message: '医嘱序号必须是整数' })
  yzxh?: number;

  @Allow()
  @IsOptional()
  @IsString({ message: '住院ID必须是字符串' })
  @MaxLength(12, { message: '住院ID长度不能超过12个字符' })
  zyid?: string;

  @Allow()
  @IsOptional()
  @IsDate({ message: '开始日期必须是有效日期' })
  startDate?: Date;

  @Allow()
  @IsOptional()
  @IsDate({ message: '结束日期必须是有效日期' })
  endDate?: Date;
}
