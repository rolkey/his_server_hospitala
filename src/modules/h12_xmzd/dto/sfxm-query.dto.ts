// src/dto/sfxm-query.dto.ts
import { Allow } from 'class-validator';

export class SfxmQueryDto {
  @Allow()
  uKsid: string;

  @Allow()
  bz: number;

  // 混合查询参数
  @Allow()
  query: string;

  // 费用类型
  @Allow()
  feeType: number;

  @Allow()
  pageSize?: number;

  @Allow()
  pageNo?: number;
}
