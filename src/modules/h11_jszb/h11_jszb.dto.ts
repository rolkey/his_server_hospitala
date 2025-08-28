import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateH11JszbDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsdh: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zybh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  brxm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  xbid?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rysj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zyid?: string;

  @IsOptional()
  @IsInt()
  jslx?: number;

  @IsOptional()
  @IsNumber()
  jsje?: number;

  @IsOptional()
  @IsNumber()
  zfje?: number;

  @IsOptional()
  @IsNumber()
  gfje?: number;

  @IsOptional()
  @IsNumber()
  jmje?: number;

  @IsOptional()
  @IsNumber()
  qfje?: number;

  @IsOptional()
  @IsNumber()
  ssje?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jmlxid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  fpzh?: string;

  @IsOptional()
  @IsNumber()
  yjje?: number;

  @IsOptional()
  @IsNumber()
  syje?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  zzsj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  ksid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  ksmc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsyid?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  jssj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  jsyxm?: string;

  @IsOptional()
  @IsInt()
  fpbz?: number;

  @IsOptional()
  @IsNumber()
  czf?: number;

  @IsOptional()
  @IsInt()
  sjzt?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sfsj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fphm?: string;
}

export class UpdateH11JszbDto {
  @IsOptional()
  @IsString()
  @MaxLength(12)
  zybh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  brxm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  xbid?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rysj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zyid?: string;

  @IsOptional()
  @IsInt()
  jslx?: number;

  @IsOptional()
  @IsNumber()
  jsje?: number;

  @IsOptional()
  @IsNumber()
  zfje?: number;

  @IsOptional()
  @IsNumber()
  gfje?: number;

  @IsOptional()
  @IsNumber()
  jmje?: number;

  @IsOptional()
  @IsNumber()
  qfje?: number;

  @IsOptional()
  @IsNumber()
  ssje?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jmlxid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  fpzh?: string;

  @IsOptional()
  @IsNumber()
  yjje?: number;

  @IsOptional()
  @IsNumber()
  syje?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  zzsj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  ksid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  ksmc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsyid?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  jssj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  jsyxm?: string;

  @IsOptional()
  @IsInt()
  fpbz?: number;

  @IsOptional()
  @IsNumber()
  czf?: number;

  @IsOptional()
  @IsInt()
  sjzt?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sfsj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fphm?: string;
}

export class H11JszbQueryDto {
  @IsOptional()
  @IsString()
  jsdh?: string;

  @IsOptional()
  @IsString()
  zybh?: string;

  @IsOptional()
  @IsString()
  brxm?: string;

  @IsOptional()
  @IsString()
  zyid?: string;

  @IsOptional()
  @IsString()
  ksid?: string;

  @IsOptional()
  @IsString()
  ksmc?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}
