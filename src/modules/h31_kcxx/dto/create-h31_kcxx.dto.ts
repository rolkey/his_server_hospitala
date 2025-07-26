import { IsNotEmpty, IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class CreateH31_kcxxDto {
  @IsString()
  @IsNotEmpty()
  ksid: string;

  @IsString()
  @IsNotEmpty()
  ypid: string;

  @IsString()
  @IsOptional()
  ypgg?: string;

  @IsString()
  @IsOptional()
  cjid?: string;

  @IsString()
  @IsOptional()
  scph?: string;

  @IsNumber()
  @IsOptional()
  lsjg?: number;

  @IsNumber()
  @IsOptional()
  pfjg?: number;

  @IsString()
  @IsOptional()
  gsid?: string;

  @IsString()
  @IsOptional()
  jldw?: string;

  @IsNumber()
  @IsOptional()
  sqsl?: number;

  @IsNumber()
  @IsOptional()
  kcsl?: number;

  @IsNumber()
  @IsOptional()
  lsj1?: number;

  @IsNumber()
  @IsOptional()
  lsj2?: number;

  @IsNumber()
  @IsOptional()
  lsj3?: number;

  //
  @IsOptional()
  sxrq?: Date;

  //
  @IsOptional()
  bjrq?: Date;

  @IsString()
  @IsOptional()
  fjhm?: string;

  @IsString()
  @IsOptional()
  hjhm?: string;

  @IsString()
  @IsOptional()
  hjch?: string;

  @IsString()
  @IsOptional()
  hjwh?: string;

  //   @IsInt()
  @IsOptional()
  sxbz?: number;

  //   @IsInt()
  @IsOptional()
  yxbz?: number;

  //   @IsInt()
  @IsOptional()
  djbz?: number;

  @IsString()
  @IsOptional()
  fphm?: string;

  @IsString()
  @IsOptional()
  pzwh?: string;

  //   @IsInt()
  @IsOptional()
  xzbz?: number;

  //
  @IsOptional()
  sj?: Date;

  //   @IsInt()
  @IsOptional()
  gmp?: number;

  //   @IsInt()
  @IsOptional()
  zbbz?: number;

  @IsString()
  @IsOptional()
  scpc?: string;

  @IsString()
  @IsOptional()
  xdw?: string;

  @IsNumber()
  @IsOptional()
  xsl?: number;

  @IsNumber()
  @IsOptional()
  dfsl?: number;

  @IsNumber()
  @IsOptional()
  mzdfsl?: number;

  @IsNumber()
  @IsOptional()
  ssdfsl?: number;

  @IsNumber()
  @IsOptional()
  xlsjg?: number;

  @IsNumber()
  @IsOptional()
  xpfjg?: number;

  //
  @IsOptional()
  scrq?: Date;

  @IsString()
  @IsOptional()
  zsm?: string;
}
