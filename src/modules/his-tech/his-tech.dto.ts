import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsArray, Allow } from 'class-validator';

export class QueryParamsDto {
  @Allow()
  ksid: string;

  @IsOptional()
  value?: string;

  @IsNumber()
  pageNo: number;

  @IsNumber()
  pageSize: number;

  @IsArray()
  @IsString({ each: true })
  kssj: string;

  @IsArray()
  @IsString({ each: true })
  jssj: string;
}
