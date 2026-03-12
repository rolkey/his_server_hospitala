import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsInt,
  IsDate,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateH00BrlbDto {
  @IsNotEmpty({ message: '病人类别ID不能为空' })
  @IsString()
  @MaxLength(10)
  brlbid: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  brlbmc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  szbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  pybm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  wbbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  qtbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz2?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zfbl?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataSta?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataEnd?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  je1?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  je2?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  hbbz?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  yxbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  brdl?: string;
}

export class UpdateH00BrlbDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  brlbmc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  szbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  pybm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  wbbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  qtbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz2?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  zfbl?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataSta?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataEnd?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  je1?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  je2?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  hbbz?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  yxbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  brdl?: string;
}

export class H00BrlbQueryDto {
  @ApiPropertyOptional({ description: '病人类别ID' })
  @IsOptional()
  @IsString()
  brlbid?: string;

  @ApiPropertyOptional({ description: '病人类别名称' })
  @IsOptional()
  @IsString()
  brlbmc?: string;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageNo?: number = 1;

  @ApiPropertyOptional({ description: '每页条数', default: 10 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number = 10;
}
