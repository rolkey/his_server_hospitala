// src/h12_mbzb/h12_mbzb.dto.ts
export class CreateH12_mbzbDto {
  mbid: string;
  mblx: number;
  mbmc?: string;
  mbbz?: string;
  pybm?: string;
  wbbm?: string;
  qtbm?: string;
  ksid?: string;
  mbfl?: string;
  ysid?: string;
  bz1?: string;
  bz2?: string;
  bz3?: string;
}

export class UpdateH12_mbzbDto {
  mbmc?: string;
  mbbz?: string;
  pybm?: string;
  wbbm?: string;
  qtbm?: string;
  ksid?: string;
  mbfl?: string;
  ysid?: string;
  bz1?: string;
  bz2?: string;
  bz3?: string;
}

export class H12_mbzbResponseDto {
  mbid: string;
  mblx: number;
  mbmc: string | null;
  mbbz: string | null;
  pybm: string | null;
  wbbm: string | null;
  qtbm: string | null;
  ksid: string | null;
  mbfl: string | null;
  ysid: string | null;
  bz1: string | null;
  bz2: string | null;
  bz3: string | null;
}
