import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsArray, Allow } from 'class-validator';

export class QueryParamsDto {
  @Allow()
  ksid: string;

  @IsOptional()
  value?: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageNo: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageSize: number;

  @Allow()
  kssj: string;

  @Allow()
  jssj: string;
}

export class ConfigDto {
  @Allow()
  hlfylbid0: string;

  @Allow()
  hlfylbid1: string;

  @Allow()
  hlfylbid2: string;

  @Allow()
  hlfylbid3: string;

  @Allow()
  hlfylbid4: string;
}
