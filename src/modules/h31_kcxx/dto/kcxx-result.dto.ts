// kcxx-result.dto.ts
export class KcxxResultDto {
  success: boolean;
  message?: string;
  data?: {
    lsjg: number;
    pfjg: number;
    scph: string;
    cjid: string;
    gsid: string;
    ypidn: string;
    kcsl: number;
    xs?: number; // 系数
    kcgl?: number;
  };
}
