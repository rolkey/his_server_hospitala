import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  Length,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateH31LyjlDto {
  @IsString()
  @Length(0, 10)
  ksid: string;

  @IsString()
  @Length(0, 20)
  djlb: string;

  @IsString()
  @Length(0, 12)
  djbh: string;

  @IsOptional()
  djsj?: Date;

  @IsString()
  @Length(0, 30)
  ywlb: string;

  @IsNumber()
  flbs: number;

  @IsNumber()
  hjje: number;

  @IsOptional()
  sqsj?: Date;

  @IsString()
  @Length(0, 10)
  fhksid: string;

  @IsString()
  @Length(0, 10)
  fhrid: string;

  @IsString()
  @Length(0, 10)
  shksid: string;

  @IsString()
  @Length(0, 10)
  shrid: string;

  @IsString()
  @Length(0, 10)
  lrrid: string;

  @IsNumber()
  ckclbz: number;

  @IsNumber()
  rkclbz: number;

  @IsNumber()
  tjbz: number;

  @IsOptional()
  @IsNumber()
  pfhj?: number;

  @IsOptional()
  @IsString()
  @Length(0, 1)
  ywlx?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  bz1?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  bz2?: string;

  @IsString()
  @Length(0, 20)
  zkksid: string;

  @IsString()
  @Length(0, 20)
  bz3: string;

  @IsString()
  @Length(0, 20)
  bz4: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  zyid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  zybh?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  brxm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  brnl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  xbid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  cwid?: string;

  @IsOptional()
  @IsNumber()
  szbz?: number;
}

export class UpdateH31LyjlDto {
  @IsOptional()
  djsj?: Date;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  ywlb?: string;

  @IsOptional()
  @IsNumber()
  flbs?: number;

  @IsOptional()
  @IsNumber()
  hjje?: number;

  @IsOptional()
  sqsj?: Date;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  fhksid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  fhrid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  shksid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  shrid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  lrrid?: string;

  @IsOptional()
  @IsNumber()
  ckclbz?: number;

  @IsOptional()
  @IsNumber()
  rkclbz?: number;

  @IsOptional()
  @IsNumber()
  tjbz?: number;

  @IsOptional()
  @IsNumber()
  pfhj?: number;

  @IsOptional()
  @IsString()
  @Length(0, 1)
  ywlx?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  bz1?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  bz2?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  zkksid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  bz3?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  bz4?: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  zyid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 15)
  zybh?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  brxm?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  brnl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  xbid?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  cwid?: string;

  @IsOptional()
  @IsNumber()
  szbz?: number;
}

export class FindOneH31LyjlDto {
  @IsString()
  ksid: string;

  @IsString()
  djlb: string;

  @IsString()
  djbh: string;
}

export class QueryH31LyjlDto {
  @IsOptional()
  @IsString()
  lyksid?: string;

  @IsOptional()
  @IsString()
  zkksid?: string;

  @IsOptional()
  @IsString()
  fhksid?: string;

  @IsOptional()
  @IsString()
  start?: string;

  @IsOptional()
  @IsString()
  end?: string;

  @IsOptional()
  @IsString()
  ckclbz?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageNo?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Type(() => Number)
  pageSize?: number = 10;
}

export class QueryByAdviceDto {
  @IsNotEmpty({ message: '科室ID不能为空' })
  @IsString()
  fhksid?: string;

  @IsNotEmpty({ message: '单据编号不能为空' })
  @Type(() => String)
  djbh?: string[];
}

export class QueryByAdviceDetailDto {
  @IsNotEmpty({ message: '科室ID不能为空' })
  @IsString()
  fhksid?: string;

  @IsNotEmpty({ message: '单据编号不能为空' })
  @Type(() => String)
  djbh?: string[];

  @IsNotEmpty({ message: '药品ID不能为空' })
  @IsString()
  ypid?: string;

  @IsNotEmpty({ message: '生产批次不能为空' })
  @IsString()
  scpc?: string;
}
