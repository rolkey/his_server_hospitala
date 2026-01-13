import { Type } from 'class-transformer';
import { Allow, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CsxzQueryDto {
  @Allow()
  data?: string | null;
  @Allow()
  name?: string | null;
  @Allow()
  no?: number | null;
  @Allow()
  bz1?: string | null;
  @Allow()
  bz2?: string | null;
  @Allow()
  yxbz?: number | null;
  @Allow()
  lx: string;
  @Allow()
  pybm?: string | null;
  @Allow()
  wbbm?: string | null;
}

export class QueryBaseCsxzDto extends CsxzQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  pageSize?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageNo?: number;
}
