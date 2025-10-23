import { Allow } from 'class-validator';

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
