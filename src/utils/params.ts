/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params: any) {
  if (!params) return '';

  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = encodeURIComponent(propName) + '=';
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            const params = propName + '[' + key + ']';
            const subPart = encodeURIComponent(params) + '=';
            result += subPart + encodeURIComponent(value[key]) + '&';
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&';
      }
    }
  }
  // 去掉 result 最后一个 & 符号
  result = result.substring(0, result.length - 1);
  return result;
}

/**
 * 合并对象，空值会忽略
 * @param objects 多个对象
 * @returns
 */
export function mergeObjects<T extends Record<string, any>>(...objects: T[]): T {
  const result = {} as T;

  // 从后往前遍历，这样前面的对象可以覆盖后面的对象
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    for (const key in obj) {
      // 只有当值不为空（null、undefined、空字符串等）或者结果对象中还没有这个属性时，才设置
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '' && !(key in result)) {
        result[key] = obj[key];
      }
    }
  }

  return result;
}
