// src/modules/h31_kcxx/h31-kcxx.dto.ts
import { Allow } from 'class-validator';

export class QueryKcxxDto {
  @Allow()
  ksid?: string;

  @Allow()
  ypid?: string;

  @Allow()
  scph?: string;

  @Allow()
  pageNo?: number = 1;

  @Allow()
  pageSize?: number = 10;
}

export class KcxxResponseDto {
  ksid: string;
  ypid: string;
  ypgg: string | null;
  cjid: string | null;
  scph: string;
  lsjg: number;
  pfjg: number;
  gsid: string | null;
  kcsl: number;
  sxrq: Date | null;
  pzwh: string | null;
  scpc: string | null;
  xsl: number;
  zsm: string;
}

export class QueryKcjgDto {
  @Allow()
  lx: number; // 0-项目 1-药品

  @Allow()
  ypid: string;

  @Allow()
  ypmc?: string;

  @Allow()
  xmzl?: number; // 1-项目 2-药品

  @Allow()
  ksid1?: string;

  @Allow()
  ksid2?: string;

  @Allow()
  ksid3?: string;

  @Allow()
  ksid4?: string;

  @Allow()
  ksid5?: string;
}

export class KcjgResponseDto {
  lsjg: number;
  pfjg: number;
  scph: string;
  cjid: string;
  gsid: string;
  kcdw: string;
  sfdw: string;
  ypgg: string;
  fyfs: string;
  ybfl: string;
  zzbz: string;
  cfqj: string;
  zysx: string;
  psbz: string;
  syffid: string;
  fylbid: string;
  zxks: string;
  sj1: number;
  sj2: number;
  bz1: string;
  bz2: string;
  bz3: string;
  kcsl?: number;
  success: boolean;
  message?: string;
}
