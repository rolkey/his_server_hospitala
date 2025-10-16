import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  MaxLength,
  IsInt,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateH11XnhDto } from '../h11_xnh/h11_xnh.dto';

export class CreateH11JszbDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  jsdh: string;

  @IsNotEmpty({ message: '住院编号不能为空!' })
  @IsString()
  @MaxLength(12)
  zybh?: string;

  @IsNotEmpty({ message: '病人姓名不能为空!' })
  @IsString()
  @MaxLength(30)
  brxm?: string;

  @IsNotEmpty({ message: '病人性别不能为空!' })
  @IsString()
  @MaxLength(10)
  xbid?: string;

  @IsNotEmpty({ message: '入院时间不能为空!' })
  @Type(() => Date)
  @IsDate()
  rysj?: Date;

  @IsNotEmpty({ message: '住院ID不能为空!' })
  @IsString()
  @MaxLength(12)
  zyid?: string;

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

  @IsOptional()
  @IsNumber()
  yjje?: number;

  @IsOptional()
  @IsNumber()
  syje?: number;

  @IsNotEmpty({ message: '终止时间不能为空!' })
  @Type(() => Date)
  @IsDate()
  zzsj?: Date;

  @IsNotEmpty({ message: '科室ID不能为空!' })
  @IsString()
  @MaxLength(10)
  ksid?: string;

  @IsNotEmpty({ message: '科室名称不能为空!' })
  @IsString()
  @MaxLength(30)
  ksmc?: string;

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

  @IsOptional()
  @IsInt()
  sjzt?: number = 1;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sfsj?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  fphm?: string;

  @IsNotEmpty({ message: '病人类型ID不能为空!' })
  @IsString()
  @MaxLength(30)
  brlxid?: string;

  @IsNotEmpty({ message: '付款方式不能为空!' })
  paymentType?: CreateH11XnhDto;
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
  @IsString()
  start?: string;

  @IsOptional()
  @IsString()
  end?: string;

  @IsNotEmpty({ message: '当前页不能为空!' })
  @Type(() => Number)
  @IsNumber()
  pageNo?: number = 1;

  @IsNotEmpty({ message: '每页条数不能为空!' })
  @Type(() => Number)
  @IsNumber()
  pageSize?: number = 10;
}
