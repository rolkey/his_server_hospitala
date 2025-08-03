// kcjg-ypid.dto.ts
export class KcjgYpidRequestDto {
  lx: number;
  ypid: string;
  ypmc: string;
  xmzl: number;
  ksid1: string;
  ksid2: string;
  ksid3: string;
  ksid4: string;
  ksid5: string;
}

// 库存价格信息
export class Kcjgxx {
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
}

export class KcjgYpidResponseDto {
  success: boolean;
  message?: string;
  data?: Kcjgxx;
}
