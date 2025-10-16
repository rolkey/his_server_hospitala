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

export class CreateH23RytzDto {
  @IsNotEmpty({ message: '通知单号不能为空' })
  @IsString()
  @MaxLength(10)
  tzdh: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  brxm?: string;

  @IsNotEmpty({ message: '民族ID不能为空' })
  @IsString()
  @MaxLength(12)
  mzid: string;

  @IsNotEmpty({ message: '病人性别不能为空' })
  @IsString()
  @MaxLength(10)
  brxb: string;

  @IsNotEmpty({ message: '病人类型ID不能为空' })
  @IsString()
  @MaxLength(10)
  brlxid: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rysj?: Date;

  @IsNotEmpty({ message: '入院情况不能为空' })
  @IsString()
  @MaxLength(254)
  ryqk: string;

  @IsNotEmpty({ message: '备注内容不能为空' })
  @IsString()
  @MaxLength(100)
  bznr: string;

  @IsNotEmpty({ message: '开单科室ID不能为空' })
  @IsString()
  @MaxLength(10)
  kdksid: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lxdz?: string;

  @IsNotEmpty({ message: '通知单类型不能为空' })
  @IsNumber()
  tzdlx: number;

  @IsNotEmpty({ message: '入院科室ID不能为空' })
  @IsString()
  @MaxLength(10)
  ryksid: string;

  @IsNotEmpty({ message: '医生ID不能为空' })
  @IsString()
  @MaxLength(10)
  ysid: string;

  @IsNotEmpty({ message: '护士ID不能为空' })
  @IsString()
  @MaxLength(10)
  hsid: string;

  @IsNotEmpty({ message: '手术医生ID不能为空' })
  @IsString()
  @MaxLength(10)
  sxysid: string;

  @IsNotEmpty({ message: '入院标志不能为空' })
  @IsNumber()
  rybz: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  brnl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  nldw?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  brnl1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  nldw1?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  csrq?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  sfzh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  hyzkmc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  hyid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  mzmc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  lxdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  bzxx1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  bzxx2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  ryff?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  sfdm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  sjdm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  jgdm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  xjdm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  hkyb?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  lxrm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  lxrdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  dbry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  zyys?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz4?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bz1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  gxid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  hsidn?: string;

  @IsOptional()
  @IsNumber()
  yjk?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  lxrsfzh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lxrdz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  GG1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  GG2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  GG3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  XZZ1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  XZZ2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  XZZ3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  XZZ4?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  XZZ5?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  HKDZ1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  HKDZ2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  HKDZ3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  HKDZ4?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  HKDZ5?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  hkyb1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  gzdw?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  dwdh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  dwyb?: string;
}

export class UpdateH23RytzDto extends CreateH23RytzDto {}

export class H23RytzQueryDto {
  @IsOptional()
  @IsString()
  tzdh?: string;

  @IsOptional()
  @IsString()
  brxm?: string;

  @IsOptional()
  @IsString()
  mzid?: string;

  @IsOptional()
  @IsString()
  ryksid?: string;

  @IsOptional()
  @IsString()
  ysid?: string;

  @IsOptional()
  @IsString()
  start?: Date;

  @IsOptional()
  @IsString()
  end?: Date;

  @IsOptional()
  @IsString()
  rybz?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number = 10;
}
