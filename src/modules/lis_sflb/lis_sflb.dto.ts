// src/lis_sflb/lis_sflb.dto.ts

export class CreateLisSflbDto {
  lbcode: string;
  lbname?: string;
  pybm?: string;
  wbbm?: string;
  qtbm?: string;
  fylbid?: string;
  zxksid?: string;
  yxbz?: number;
  bz1?: string;
  bz2?: string;
}

export class UpdateLisSflbDto {
  lbname?: string;
  pybm?: string;
  wbbm?: string;
  qtbm?: string;
  fylbid?: string;
  zxksid?: string;
  yxbz?: number;
  bz1?: string;
  bz2?: string;
}

export class LisSflbResponseDto {
  lbcode: string;
  lbname: string | null;
  pybm: string | null;
  wbbm: string | null;
  qtbm: string | null;
  fylbid: string | null;
  zxksid: string | null;
  yxbz: number | null;
  bz1: string | null;
  bz2: string | null;
}
