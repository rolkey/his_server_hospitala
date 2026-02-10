import { IsOptional, IsString, Length } from 'class-validator';
import { h12_yzxb } from './../h12_yzxb.entity';
export class H12_yzxbDto {
  yzlx: number;
  yzxh: number;
  zyid: string;
  mxxh: number;
  zybh: string;
  zycs: number;
  ksrq?: string;
  kssj?: string;
  xmid?: string;
  xmmc?: string;
  jfyl?: number;
  sjyl?: number;
  syffid?: string;
  syplid?: string;
  xmgg?: string;
  xmdw?: string;
  xmdj?: number;
  typbz?: string;
  fybzf?: number;
  tcbz?: number;
  ksys?: string;
  scdh?: string;
  kshs?: string;
  jsys?: string;
  jshs?: string;
  jsrq?: string;
  jssj?: string;
  fylbid?: string;
  sfje?: number;
  sjbz?: number;
  sfbz?: number;
  jsbz?: number;
  zxbz?: number;
  tzbz?: number;
  fybz?: string;
  bzxx?: string;
  lryid?: string;
  hdbz?: number;
  hdsj?: string;
  zxcs?: number;
  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'zxrq 字段长度必须为 10 个字符' })
  zxrq?: string;
  tpbz?: number;
  zflx?: string;
  ksnf?: string;
  jsnf?: string;
  kssxys?: string;
  kssxhs?: string;
  jssxys?: string;
  jssxhs?: string;
  xmzl?: number;
  cjid?: string;
  scph?: string;
  pfjg?: number;
  hdhs?: string;
  zxhs?: string;
  zxsj?: string;
  tybz?: number;
  kyts?: number;
  yhbl?: number;
  jldw?: string;
  clbz?: number;
  dwGrade?: number;
  dwXs?: number;
  ypid?: string;
  ksid?: string;
  yzzh?: number;
  ysbz?: number;
  sjyl1?: string;
  srcs?: number;
  yzrq?: Date;
  tzrq?: Date;
  mrcs?: number;
  tjbz?: number;
  kyfs?: number;
  ybbz?: number;
  gjybbm?: string;
  gjybmc?: string;
  yzzt?: number;
  ltbz?: string;
  psbz?: string;
  bsjg?: string;
  hshd?: string;
  hshdrq?: Date;
  qt1?: string;
  zfbl?: number;
  isNew?: boolean;
  yzid?: string;
}

export class UpdateH12_yzxbDto extends H12_yzxbDto {
  additional: H12_yzxbDto[];
}

export class H12_yzxbResponseDto extends H12_yzxbDto {
  syffidEntity?: any;
  syplidEntity?: any;
  ksysEntity?: any;
  kshsEntity?: any;
  jsysEntity?: any;
  jshsEntity?: any;
  fylbidEntity?: any;
  lryidEntity?: any;
  kssxysEntity?: any;
  kssxhsEntity?: any;
  jssxysEntity?: any;
  jssxhsEntity?: any;
  hdhsEntity?: any;
  zxhsEntity?: any;
  ksidEntity?: any;
  h12_yzzb?: any;
  h13_yzzxcsList?: any[];
}

/**
 * 医嘱用法取套餐
 */
export class H12_yzxbSyffTcDto {
  syffid: string;
  h12_yzxb: H12_yzxbDto;
}
