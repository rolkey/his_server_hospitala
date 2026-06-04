import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { G01Ryxx } from './G01Ryxx';
import { G10Djxx } from './G10Djxx';
import { G50Zdxx } from './G50Zdxx';
import { G60Fymx } from './G60Fymx';
import { G60Jsxx } from './G60Jsxx';
import { G60Jsmx } from './G60Jsmx';
import { G10Dzzh } from './G10Dzzh';
import { G60Dzjs } from './G60Dzjs';

export class BaseInfoDto {
  @IsString()
  @IsNotEmpty()
  psn_no: string;

  @IsString()
  @IsNotEmpty()
  psn_cert_type: string;

  @IsString()
  @IsNotEmpty()
  certno: string;

  @IsString()
  @IsNotEmpty()
  psn_name: string;

  @IsString()
  @IsNotEmpty()
  gend: string;

  @IsString()
  @IsNotEmpty()
  naty: string;

  @IsString()
  @IsNotEmpty()
  brdy: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  psn_mgtcode?: string | null;

  @IsOptional()
  @IsString()
  exp_content?: string | null;
}
export class InsuInfoDto {
  @IsNumber()
  balc: number;

  @IsString()
  @IsNotEmpty()
  insutype: string;

  @IsString()
  @IsNotEmpty()
  psn_insu_stas: string;

  @IsString()
  @IsNotEmpty()
  psn_insu_date: string;

  @IsOptional()
  @IsString()
  paus_insu_date?: string | null;

  @IsString()
  @IsNotEmpty()
  psn_type: string;

  @IsString()
  @IsNotEmpty()
  cvlserv_flag: string;

  @IsString()
  @IsNotEmpty()
  insuplc_admdvs: string;

  @IsString()
  @IsNotEmpty()
  emp_name: string;
}
export class IdetInfoDto {
  @IsString()
  @IsOptional()
  psn_idet_type?: string;

  @IsString()
  @IsOptional()
  psn_type_lv?: string;

  @IsString()
  @IsOptional()
  memo?: string;

  @IsString()
  @IsOptional()
  begntime?: string;

  @IsString()
  @IsOptional()
  endtime?: string;
}

export class ChsPersonDetail {
  @IsString()
  @IsNotEmpty()
  lsh: string;

  @IsString()
  @IsNotEmpty()
  lshxh: string;

  @IsString()
  @IsNotEmpty()
  mdtrt_cert_no: string;

  @IsString()
  @IsNotEmpty()
  mdtrt_cert_type: string;

  @IsString()
  @IsNotEmpty()
  insuorg: string;

  @IsString()
  @IsNotEmpty()
  insuplc_admdvs: string;

  @IsString()
  ectoken?: string;

  @IsString()
  cardno?: string;

  @IsString()
  cardSn?: string;

  @ValidateNested()
  @Type(() => BaseInfoDto)
  baseinfo: BaseInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsuInfoDto)
  insuinfo: InsuInfoDto[];

  @IsArray()
  @IsOptional()
  idetinfo: IdetInfoDto[];
}

export class PreSettlement {
  @IsOptional()
  baseInfo: G01Ryxx;

  @IsOptional()
  mdtrtinfo: G10Djxx;

  @IsOptional()
  setlinfo: G60Jsxx;

  @IsOptional()
  @IsArray()
  diseinfo: G50Zdxx[];

  @IsOptional()
  @IsArray()
  feedetail: G60Fymx[];

  @IsOptional()
  @IsArray()
  setldetail: G60Jsmx[];
}

export class Settlement {
  @IsOptional()
  @IsString()
  ybdjh?: string;

  @IsOptional()
  @IsString()
  invono?: string;

  @IsOptional()
  setlinfo: G60Jsxx;

  @IsOptional()
  @IsArray()
  setldetail: G60Jsmx[];

  @IsOptional()
  g10Dzzh?: G10Dzzh;

  @IsOptional()
  g60Dzjs?: G60Dzjs;
}

export class MsgDto {
  @IsNotEmpty({ message: 'lsh不能为空' })
  @IsString()
  lsh: string;

  @IsNotEmpty({ message: 'lshxh不能为空' })
  @IsString()
  lshxh: string;

  @IsOptional()
  @IsString()
  infno?: string;

  @IsOptional()
  @IsString()
  psn_no?: string;

  @IsOptional()
  @IsString()
  mdtrt_id?: string;
}
export class ReplaceDto {}
