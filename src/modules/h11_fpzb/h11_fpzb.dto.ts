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

export class CreateH11FpzbDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  fphm: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  kshm: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zybh?: string;

  @IsNotEmpty({ message: '结算单号不能为空' })
  @IsString()
  @MaxLength(10)
  jsdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zyid?: string;

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
  @Type(() => Date)
  @IsDate()
  zzsj?: Date;

  @IsOptional()
  @IsNumber()
  fpje?: number;

  @IsOptional()
  @IsNumber()
  yjje?: number;

  @IsOptional()
  @IsNumber()
  syje?: number;

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
  sfyid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  sfyxm?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sfsj?: Date;

  @IsOptional()
  @IsInt()
  sjzt?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  zfyid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  zfyxm?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  zfsj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  zfyy?: string;

  @IsOptional()
  @IsNumber()
  qtje?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fyksid?: string;

  @IsOptional()
  @IsNumber()
  fyhj?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dzfp?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  jzrq?: Date;

  @IsOptional()
  @IsInt()
  jzbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  jkdh?: string;
}

export class UpdateH11FpzbDto {
  @IsOptional()
  @IsString()
  @MaxLength(12)
  zybh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zyid?: string;

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
  @Type(() => Date)
  @IsDate()
  zzsj?: Date;

  @IsOptional()
  @IsNumber()
  fpje?: number;

  @IsOptional()
  @IsNumber()
  yjje?: number;

  @IsOptional()
  @IsNumber()
  syje?: number;

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
  sfyid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  sfyxm?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sfsj?: Date;

  @IsOptional()
  @IsInt()
  sjzt?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  zfyid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  zfyxm?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  zfsj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  zfyy?: string;

  @IsOptional()
  @IsNumber()
  qtje?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fyksid?: string;

  @IsOptional()
  @IsNumber()
  fyhj?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dzfp?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  jzrq?: Date;

  @IsOptional()
  @IsInt()
  jzbz?: number;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  jkdh?: string;
}

export class H11FpzbQueryDto {
  @IsOptional()
  @IsString()
  fphm?: string;

  @IsOptional()
  @IsString()
  kshm?: string;

  @IsOptional()
  @IsString()
  zybh?: string;

  @IsOptional()
  @IsString()
  jsdh?: string;

  @IsOptional()
  @IsString()
  zyid?: string;

  @IsOptional()
  @IsString()
  brxm?: string;

  @IsOptional()
  @IsString()
  ksid?: string;

  @IsOptional()
  @IsString()
  ksmc?: string;

  @IsOptional()
  @IsString()
  start?: string;

  @IsOptional()
  @IsString()
  end?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageNo?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number = 10;
}

export class H11FpzbCancelDto {
  @IsNotEmpty({ message: '发票号码不能为空!' })
  @IsString()
  fphm?: string;

  @IsNotEmpty({ message: '操作人id不能为空' })
  @IsString()
  czrid?: string;

  @IsNotEmpty({ message: '操作人姓名不能为空' })
  @IsString()
  czrxm?: string;
}
