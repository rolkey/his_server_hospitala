import { HttpStatus } from '@nestjs/common';

// 出院操作返回结果接口
export interface OutResponse {
  success: boolean; // 操作是否成功
  message?: string; // 错误信息或成功提示
  isDetails?: boolean; // 是否需要显示详细错误表单
  errorCode?: number; // 错误代码
  errorDetails?: Array<{
    // 错误明细列表（当isDetails为true时包含）
    yzlx?: string; // 医嘱类型
    mxxh?: string; // 明细号
    yzrq?: string; // 医嘱日期
    xmid?: string; // 项目ID
    xmmc?: string; // 项目名称
    jfyl?: number; // 费用
    syffid?: string; // 使用方法ID
    syplid?: string; // 使用频率ID
    ksys?: string; // 科室医生
    kshs?: string; // 科室护士
  }>;
}

// 创建成功响应
export function createSuccessResponse(): OutResponse {
  return {
    success: true,
  };
}

// 创建错误响应
export function createErrorResponse(
  message: string,
  errorCode?: number,
  isDetails: boolean = false,
  errorDetails?: Array<any>,
): OutResponse {
  return {
    // 操作是否成功
    success: false,
    // 错误信息或成功提示
    message,
    // 错误代码
    errorCode,
    // 是否需要显示详细错误表单 true/false
    isDetails,
    // 错误明细列表（当isDetails为true时包含）
    errorDetails,
  };
}
