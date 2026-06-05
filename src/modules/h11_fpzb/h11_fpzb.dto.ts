import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  MaxLength,
  IsInt,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { G10Dzzh } from '../chs/G10Dzzh';
import { G60Jsxx } from '../chs/G60Jsxx';
import { G10Djxx } from '../chs/G10Djxx';
import { G60Jsmx } from '../chs/G60Jsmx';
import { G60Dzjs } from '../chs/G60Dzjs';
import { CreateH11XnhDto } from '../h11_xnh/h11_xnh.dto';

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

  // @IsNotEmpty({ message: '结算单号不能为空' })
  @IsString()
  @IsOptional()
  // @MaxLength(10)
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

  @IsOptional()
  mdtrtinfo?: G10Djxx;

  @IsOptional()
  setlinfo?: G60Jsxx;

  @IsOptional()
  @IsArray()
  setldetail?: G60Jsmx[];

  @IsOptional()
  g10Dzzh?: G10Dzzh;

  @IsNotEmpty({ message: '结算类型不能为空!' })
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
  jmlxid?: string = '1';

  @IsOptional()
  @IsString()
  @MaxLength(20)
  fpzh?: string;


  @IsNotEmpty({ message: '结算人ID不能为空!' })
  @IsString()
  @MaxLength(10)
  jsyid?: string;

  @IsNotEmpty({ message: '结算时间不能为空!' })
  @Type(() => Date)
  @IsDate()
  jssj?: Date;

  @IsNotEmpty({ message: '结算人姓名不能为空!' })
  @IsString()
  @MaxLength(30)
  jsyxm?: string;

  @IsOptional()
  @IsInt()
  fpbz?: number = 0;

  @IsOptional()
  @IsNumber()
  czf?: number = 0;


  @IsNotEmpty({ message: '病人类型ID不能为空!' })
  @IsString()
  @MaxLength(30)
  brlxid?: string;

  @IsNotEmpty({ message: '付款方式不能为空!' })
  paymentType?: CreateH11XnhDto;

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
  value?: string;

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
