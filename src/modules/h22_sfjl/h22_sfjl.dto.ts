import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreateH22SfjlDto {
  @IsString()
  lsh: string;

  @IsOptional()
  @IsString()
  usid?: string;

  @IsOptional()
  @IsString()
  unam?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rq?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  s_date?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  e_date?: Date;

  @IsOptional()
  @IsString()
  s_fphm?: string;

  @IsOptional()
  @IsString()
  e_fphm?: string;

  @IsOptional()
  @IsInt()
  jsbz?: number;

  @IsOptional()
  @IsNumber()
  jshj?: number;

  @IsOptional()
  @IsNumber()
  mzje?: number;

  @IsOptional()
  @IsNumber()
  mzybje?: number;

  @IsOptional()
  @IsNumber()
  mzjzje?: number;

  @IsOptional()
  @IsNumber()
  mzxnhje?: number;

  @IsOptional()
  @IsNumber()
  mzgfje?: number;

  @IsOptional()
  @IsNumber()
  mzjbje?: number;

  @IsOptional()
  @IsString()
  mzfphm?: string;

  @IsOptional()
  @IsString()
  mzzfhm?: string;

  @IsOptional()
  @IsNumber()
  zyje?: number;

  @IsOptional()
  @IsNumber()
  zybjk?: number;

  @IsOptional()
  @IsNumber()
  zytk?: number;

  @IsOptional()
  @IsNumber()
  zyyjk?: number;

  @IsOptional()
  @IsNumber()
  zyjsk?: number;

  @IsOptional()
  @IsNumber()
  zyybje?: number;

  @IsOptional()
  @IsNumber()
  zygfje?: number;

  @IsOptional()
  @IsNumber()
  zyxnhje?: number;

  @IsOptional()
  @IsNumber()
  zyjbje?: number;

  @IsOptional()
  @IsNumber()
  qtje?: number;

  @IsOptional()
  @IsString()
  zyfphm?: string;

  @IsOptional()
  @IsString()
  zyzfhm?: string;

  @IsOptional()
  @IsInt()
  shbz?: number;

  @IsOptional()
  @IsString()
  shry?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  shrq?: Date;

  @IsOptional()
  @IsString()
  sjzt?: string;

  @IsOptional()
  @IsString()
  bzxx?: string;

  @IsOptional()
  @IsString()
  mzs?: string;

  @IsOptional()
  @IsString()
  zys?: string;

  @IsOptional()
  @IsString()
  yjks?: string;

  @IsOptional()
  @IsNumber()
  mzpos?: number;

  @IsOptional()
  @IsNumber()
  zyyjkpos?: number;

  @IsOptional()
  @IsNumber()
  zyjspos?: number;

  @IsOptional()
  @IsNumber()
  qtje1?: number;

  @IsOptional()
  @IsNumber()
  qtje2?: number;

  @IsOptional()
  @IsInt()
  jslx?: number;

  @IsOptional()
  @IsString()
  fyid?: string;

  @IsOptional()
  @IsNumber()
  xjje?: number;

  @IsOptional()
  @IsNumber()
  yhje?: number;

  @IsOptional()
  @IsNumber()
  wxje?: number;

  @IsOptional()
  @IsNumber()
  jmje?: number;

  @IsOptional()
  @IsNumber()
  kje?: number;

  @IsOptional()
  @IsNumber()
  bsje?: number;

  @IsOptional()
  @IsNumber()
  qte1?: number;

  @IsOptional()
  @IsNumber()
  qte2?: number;
}

export class UpdateH22SfjlDto extends PartialType(CreateH22SfjlDto) {}

export class QueryH22SfjlDto {
  @IsOptional()
  @IsString()
  sfyid?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageNo?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number = 10;
}

export class QueryCheckoutDateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '收费员不能为空' })
  sfyid?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '备注类型不能为空' })
  bz?: string;
}

export class CheckoutDateDto {
  @IsString()
  @IsNotEmpty({ message: '结账流水号不能为空' })
  lsh?: string;

  @IsString()
  @IsNotEmpty({ message: '收费员ID不能为空' })
  sfyid?: string;

  @IsString()
  @IsNotEmpty({ message: '收费员名称不能为空' })
  sfymc?: string;

  @IsString()
  @IsNotEmpty({ message: '统计时间不能为空' })
  tjrq?: string;

  @IsString()
  @IsNotEmpty({ message: '开始时间不能为空' })
  startDate?: string;

  @IsString()
  @IsNotEmpty({ message: '结束时间不能为空' })
  endDate?: string;

  @IsString()
  @IsNotEmpty({ message: '备注类型不能为空' })
  bz?: string;
}

export class CancelCheckoutDateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '流水号不能为空' })
  lsh?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '收费员ID不能为空' })
  sfyid?: string;
}

export class ResetCheckoutDateDto {
  @IsString()
  @IsNotEmpty({ message: '流水号不能为空' })
  lsh?: string;

  @IsString()
  @IsNotEmpty({ message: '管理员密码不能为空' })
  pwd?: string;

  @IsString()
  @IsNotEmpty({ message: '收费员ID不能为空' })
  sfyid?: string;

  @IsString()
  @IsNotEmpty({ message: '收费员名称不能为空' })
  sfymc?: string;

  @IsString()
  @IsNotEmpty({ message: '统计时间不能为空' })
  tjrq?: string;

  @IsString()
  @IsNotEmpty({ message: '开始时间不能为空' })
  startDate?: string;

  @IsString()
  @IsNotEmpty({ message: '结束时间不能为空' })
  endDate?: string;

  @IsString()
  @IsNotEmpty({ message: '备注类型不能为空' })
  bz?: string;
}
