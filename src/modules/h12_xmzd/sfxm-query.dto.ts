// src/dto/sfxm-query.dto.ts
import { Allow, IsString } from 'class-validator';

export class SfxmQueryDto {
  @IsString()
  uKsid: string;

  bz: number;

  // 混合查询参数
  query: string;

  // 费用类型
  feeType: number;

  @Allow()
  pageSize?: number;

  @Allow()
  pageNo?: number;
}
