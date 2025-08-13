// src/transformers/varchar-number.transformer.ts

import { ValueTransformer } from 'typeorm';

export class VarcharNumberTransformer implements ValueTransformer {
  // 将实体中的 number 转换为数据库期望的 string 格式
  to(value: number | null): string | null {
    if (value === null || value === undefined || typeof value !== 'number' || isNaN(value)) {
      return null;
    }
    // 假设数据库期望逗号作为小数点，且需要两位小数
    // 例如：0.3 -> "0,30"
    // 如果数据库只需要 "0.3" 这种格式，但不能是纯数字字符串，则可以调整
    // 如果数据库只是不允许纯数字字符串，但接受 "0.3" 格式，则可以简化
    return value?.toFixed(2).replace('.', ',');
  }

  // 将数据库中的 string 转换回实体中的 number
  from(value: string | null): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    // 将数据库中的逗号小数点转换回点小数点，然后解析为 number
    // 例如："0,30" -> 0.3
    return parseFloat(value.replace(',', '.'));
  }
}

// 实例化 transformer，以便在实体中使用
export const varcharNumberTransformer = new VarcharNumberTransformer();
