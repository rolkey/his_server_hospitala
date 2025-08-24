import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  MaxLength,
  IsInt,
  Allow,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateH11YjkDto {
  @IsNotEmpty({ message: '收据号码不能为空' })
  @IsString()
  @MaxLength(10)
  sjhm: string;

  @IsOptional()
  @IsInt()
  sjlx: number = 1;

  @IsNotEmpty({ message: '住院编号不能为空' })
  @IsString()
  @MaxLength(12)
  zybh?: string;

  @IsNotEmpty({ message: '住院ID不能为空' })
  @IsString()
  @MaxLength(12)
  zyid: string;

  @IsNotEmpty({ message: '病人姓名不能为空' })
  @IsString()
  @MaxLength(30)
  brxm?: string;

  @IsNotEmpty({ message: '科室ID不能为空' })
  @IsString()
  @MaxLength(10)
  ksid: string;

  @IsNotEmpty({ message: '科室名称不能为空' })
  @IsString()
  @MaxLength(30)
  ksmc: string;

  @IsNotEmpty({ message: '付款方式ID不能为空' })
  @IsString()
  @MaxLength(10)
  fkfsid: string;

  @IsNotEmpty({ message: '付款方式名称不能为空' })
  @IsString()
  @MaxLength(30)
  fkfsmc: string;

  @IsNotEmpty({ message: '预交金额不能为空' })
  @IsNumber()
  yjje: number;

  @IsOptional()
  @IsNumber()
  hbhl: number = 1.0;

  @IsOptional()
  @IsNumber()
  rmbje: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  zphm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  yhid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  yhzh?: string;

  @IsNotEmpty({ message: '收费员ID不能为空' })
  @IsString()
  @MaxLength(10)
  sfyid: string;

  @IsNotEmpty({ message: '收费员姓名不能为空' })
  @IsString()
  @MaxLength(30)
  sfyxm: string;

  @IsOptional()
  @IsInt()
  sjzt: number = 1;

  @IsNotEmpty({ message: '收费时间不能为空' })
  @Type(() => Date)
  @IsDate()
  sfsj: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  zfyid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  zfyxm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  zfyy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  jkrm?: string;

  @IsOptional()
  @IsInt()
  jsbz: number = 0;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsdh?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tksj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  bzxx?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bzxx1?: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(20)
  fyksid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bzxx2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  dzfp?: string;
}

export class UpdateH11YjkDto extends CreateH11YjkDto {}

export class H11YjkQueryDto {
  @Allow()
  pageNo?: number = 1;

  @Allow()
  pageSize?: number = 10;

  @Allow()
  sjhm?: string;

  @Allow()
  brxm?: string;

  @Allow()
  zyid?: string;

  @Allow()
  ksid?: string;

  @Allow()
  sjzt?: number;

  @Allow()
  startDate?: Date;

  @Allow()
  endDate?: Date;
}

export class H11YjkCancelDto {
  @Allow()
  sjhm?: string;

  @Allow()
  zfyid?: string;
}
