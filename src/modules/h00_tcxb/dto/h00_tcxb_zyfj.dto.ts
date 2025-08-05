// src/h00_tcxb_zyfj/dto/h00_tcxb_zyfj.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H00TcxbZyfjBaseDto {
  @Allow()
  tcid: string;

  @Allow()
  mxxh: number;

  @Allow()
  xmid: string;

  @Allow()
  xmmc?: string;

  @Allow()
  dwzl?: number;

  @Allow()
  jldw?: string;

  @Allow()
  jldj?: number;

  @Allow()
  jlsl?: number;

  @Allow()
  slsx?: number;

  @Allow()
  slxx?: number;

  @Allow()
  sfbz?: number;

  @Allow()
  xzbz?: number;

  @Allow()
  fybz?: string;

  @Allow()
  fylbid?: string;

  @Allow()
  cjid?: string;

  @Allow()
  scph?: string;

  @Allow()
  pfjg?: number;

  @Allow()
  xmgg?: string;

  @Allow()
  zflx?: string;

  @Allow()
  xmzl?: number;

  @Allow()
  bzxx?: string;

  @Allow()
  syffid?: string;

  @Allow()
  syplid?: string;

  @Allow()
  bz1?: string;

  @Allow()
  bz2?: string;

  @Allow()
  bz3?: string;

  @Allow()
  qt2?: string;

  @Allow()
  qt3?: string;

  @Allow()
  ltbz?: string;

  @Allow()
  sjyl1?: string;

  @Allow()
  xmdw?: string;

  @Allow()
  typbz?: string;

  @Allow()
  kyfs?: number;

  @Allow()
  kyts?: number;
}

export class CreateH00TcxbZyfjDto extends H00TcxbZyfjBaseDto {}

export class UpdateH00TcxbZyfjDto extends PartialType(H00TcxbZyfjBaseDto) {}

export class QueryH00TcxbZyfjDto extends PartialType(H00TcxbZyfjBaseDto) {
  @Allow()
  pageNo?: number;

  @Allow()
  pageSize?: number;
}

export class H00TcxbZyfjResponseDto extends H00TcxbZyfjBaseDto {}
