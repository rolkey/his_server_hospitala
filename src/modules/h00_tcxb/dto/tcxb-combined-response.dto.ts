// src/h00_tcxb/dto/tcxb-combined-response.dto.ts
// 非数据库相关的实体类使用横线代表
import { Allow } from 'class-validator';

export class TcxbCombinedResponseDto {
  @Allow()
  tcid: string;

  @Allow()
  mxxh: number;

  @Allow()
  xmid: string;

  @Allow()
  xmmc: string;

  @Allow()
  dwzl?: number;

  @Allow()
  jldw: string;

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
  xmdw: string;

  @Allow()
  sjyl1: string;

  @Allow()
  typbz: string;

  @Allow()
  kyts: number;

  @Allow()
  kyfs: number;

  @Allow()
  ltbz?: string;

  @Allow()
  tcmc?: string;

  @Allow()
  xmzl?: number;

  @Allow()
  ybfl?: string;

  @Allow()
  xnfl?: string;

  @Allow()
  zxks?: string;

  @Allow()
  gjybbm?: string;

  @Allow()
  gjybmc?: string;
}
