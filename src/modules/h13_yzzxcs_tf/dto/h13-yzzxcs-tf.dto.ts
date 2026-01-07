import { Allow } from 'class-validator';

/**
 * 医嘱中心查询参数DTO
 */
export class QueryYzzxcsDto {
  @Allow()
  zyid: string;

  @Allow()
  yzxh: number;

  @Allow()
  yzlx: number;

  @Allow()
  yzzh: number;
}
