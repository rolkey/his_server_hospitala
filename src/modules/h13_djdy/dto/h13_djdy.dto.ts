import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

/** 单条打印登记项 */
export class CreateItemDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  @IsString()
  @MaxLength(15, { message: 'zyid长度不能超过15' })
  zyid: string;

  @IsOptional()
  @IsInt()
  mxxh?: number | null;

  @IsNotEmpty({ message: 'pblx（报表类型）不能为空' })
  @IsString()
  @MaxLength(10, { message: 'pblx长度不能超过10' })
  pblx: string;

  /** 与 mxxh 二选一，写入表 maxid；为 null 时使用 mxxh */
  @IsOptional()
  @IsInt()
  maxid?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'dyflid长度不能超过10' })
  dyflid?: string;

  @IsNotEmpty({ message: 'czry（操作人员）不能为空' })
  @IsString()
  @MaxLength(10, { message: 'czry长度不能超过10' })
  czry: string;

  @IsOptional()
  @IsDateString()
  czrq?: string;
}

export class CreateDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'list不能为空，至少包含一条' })
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  list: CreateItemDto[];
}
