import { Allow } from 'class-validator';
// kcjg-ypid.dto.ts
export class KcjgYpidRequestDto {
  @Allow()
  lx: number;

  @Allow()
  ypid: string;

  @Allow()
  ypmc: string;

  @Allow()
  xmzl: number;

  /**
   * 申请数量
   */
  @Allow()
  sqsl: number;

  @Allow()
  ksid1: string;

  @Allow()
  ksid2: string;

  @Allow()
  ksid3: string;

  @Allow()
  ksid4: string;

  @Allow()
  ksid5: string;
}

// 库存价格信息
export class Kcjgxx {
  ksid: string;
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
  //   zflx: string;
  zzbz: string;
  cfqj: string;
  zysx: string;
  psbz: string;
  syffid: string;
  zxks: string;
  fylbid: string;
  sfbz: number;
  sj1: number;
  sj2: number;
  bz1: string;
  bz2: string;
  bz3: string;
  ypidn: string;
  kcsl: number;
  xs?: number;
  kcgl?: number;
  gjybbm: string;
  gjybmc: string;
}

export class KcjgYpidResponseDto {
  success: boolean;
  message?: string;
  data?: Kcjgxx;
}
