import { IsNotEmpty, IsOptional, IsString, IsInt, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateH00GxzdDto {
  @IsNotEmpty({ message: '关系字典ID不能为空' })
  @IsString()
  @MaxLength(10)
  gxid: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  gxmc?: string;

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
}

export class UpdateH00GxzdDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  gxmc?: string;

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
}

export class H00GxzdQueryDto {
  @ApiPropertyOptional({ description: '关系字典ID' })
  @IsOptional()
  @IsString()
  gxid?: string;

  @ApiPropertyOptional({ description: '关系名称' })
  @IsOptional()
  @IsString()
  gxmc?: string;

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
