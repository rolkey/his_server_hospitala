export function getSqlWithParameters(query: any): string {
  const sql = query.getQuery();
  const parameters = query.getParameters();

  let fullSql = sql;

  // 替换命名参数
  for (const [key, value] of Object.entries(parameters)) {
    if (Array.isArray(value)) {
      // 处理 IN (...) 子句中的数组参数
      const placeholders = value.map(() => '?').join(', ');
      fullSql = fullSql.replace(new RegExp(`:\\.\\.\\.${key}`, 'g'), placeholders);

      // 替换数组中的每个值
      let index = 0;
      fullSql = fullSql.replace(new RegExp(`\\?`, 'g'), () => {
        if (index < value.length) {
          return formatValue(value[index++]);
        }
        return '?';
      });
    } else {
      // 处理普通参数
      const regex = new RegExp(`:${key}(?![a-zA-Z0-9_])`, 'g');
      fullSql = fullSql.replace(regex, formatValue(value));
    }
  }

  return fullSql;
}

// 格式化值的辅助函数
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }

  if (value instanceof Date) {
    return `'${value.toISOString()}'`;
  }

  return String(value);
}
