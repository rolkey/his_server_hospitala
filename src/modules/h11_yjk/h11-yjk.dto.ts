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

export class CreateH11YjkDto {
  @IsNotEmpty({ message: '收据号码不能为空' })
  @IsString()
  @MaxLength(10)
  sjhm: string;

  @IsNotEmpty({ message: '收据类型不能为空' })
  @IsInt()
  sjlx: number;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zybh?: string;

  @IsNotEmpty({ message: '住院ID不能为空' })
  @IsString()
  @MaxLength(12)
  zyid: string;

  @IsOptional()
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

  @IsNotEmpty({ message: '汇兑率不能为空' })
  @IsNumber()
  hbhl: number;

  @IsNotEmpty({ message: '人民币金额不能为空' })
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

  @IsNotEmpty({ message: '收据状态不能为空' })
  @IsInt()
  sjzt: number;

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

  @IsNotEmpty({ message: '结算标志不能为空' })
  @IsInt()
  jsbz: number;

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
  @IsOptional()
  @IsString()
  sjhm?: string;

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
  @IsInt()
  sjzt?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 10;
}
