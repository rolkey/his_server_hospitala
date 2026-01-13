import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  Allow,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class CreateBasOprDto {
  @Allow()
  oprId?: number;

  @IsString()
  @Length(0, 128)
  icdcm: string;

  @IsString()
  @Length(0, 128)
  opr: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  gbId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  helpCode?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  elseHelpCode?: string;

  @IsOptional()
  @IsString()
  @Length(0, 16)
  parentId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  grade?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leafFlag?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  oprDegreeId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stopFlag?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sysFlag?: number;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  keyWord?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  pybm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  wbbm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  qtbm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  ybbm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  ybmc?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  bzbm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  bzmc?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  qtdm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  qtmc?: string;

  @IsOptional()
  @IsString()
  @Length(0, 60)
  bzxx?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1)
  lx?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1)
  yxbz?: string;
}

export class QueryBasOprDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  pageSize?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageNo?: number;

  @IsOptional()
  @IsString()
  value?: string;
}

export class UpdateBasOprDto extends CreateBasOprDto {
  @IsNotEmpty({ message: 'oprId不能为空' })
  @IsNumber()
  oprId: number;
}
