import { N0421 } from '../n04_21.entity';

/** 对齐 PB WF_RETRIEVE_PATIENT / uf_vidify_new20 / uf_vidify_cy 的查询结果 */
export interface PatientCaseRetrieveResult {
  record: Partial<N0421> | null;
  /** n04_21 原本无记录，本次从 h11_brxx 初始化 */
  initialized: boolean;
  /** 对齐 uf_vidify_new20 返回 -1：需维护住院病人信息 */
  needPatientMaintenance: boolean;
  /** 校验错误或提示（如 31 天内再入院） */
  messages: string[];
}
