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

export class CreateH21YlzhDto {
  @IsNotEmpty({ message: '医疗账号不能为空' })
  @IsString()
  @MaxLength(20)
  ylzh: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  yllx?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  brxm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  brnl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  xbid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  jtdz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  lxdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  lxry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  zdqk?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jzys?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  zzys?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  ywry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  ywdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  djry?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  djsj?: Date;

  @IsOptional()
  @IsNumber()
  yxbz?: number;

  @IsOptional()
  @IsNumber()
  yjk?: number;

  @IsOptional()
  @IsNumber()
  syje?: number;

  @IsOptional()
  @IsNumber()
  jf?: number;

  @IsOptional()
  @IsNumber()
  jfsy?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  oylzh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  oylzh1?: string;

  @IsOptional()
  @IsNumber()
  je1?: number;

  @IsOptional()
  @IsNumber()
  je2?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rq1?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rq2?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  hyzk?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  mz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  mjly?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  gj?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  zy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  xx?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  lxdz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  gzdz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  dh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  yzbm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  fkfs?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  ybzh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  hybz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  hypw?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  bzxx1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  bzxx2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  nldw?: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  sfzh?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  csrq?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  patientId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dqdm1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dqdm2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dqdm3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dqdm4?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dqdm5?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  abocode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  rhcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  xlcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  xwcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  gxid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bkh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  jkh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  gms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bls?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bzz1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bzz2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bzz3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  dqdm6?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dzjkk?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1)
  infectionSync?: string;

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
  @MaxLength(128)
  openid?: string;
}

export class UpdateH21YlzhDto extends CreateH21YlzhDto {}

export class H21YlzhQueryDto {
  @IsOptional()
  @IsString()
  ylzh?: string;

  @IsOptional()
  @IsString()
  brxm?: string;

  @IsOptional()
  @IsString()
  sfzh?: string;

  @IsOptional()
  @IsString()
  lxdh?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageNo?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number = 10;
}
