export function getSqlWithParameters(query: any): string {
  const sql = query.getQuery();
  const parameters = query.getParameters();

  return decodeSQLs(sql, parameters);
}

export function decodeSQLs(sql: string, parameters: any) {
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
      const regexa = new RegExp(`@${key}(?![a-zA-Z0-9_])`, 'g');
      fullSql = fullSql.replace(regexa, formatValue(value));
    }
  }

  return fullSql;
}

export function getCompleteSqlWithParameters(query: any): string {
  // 获取主查询的SQL和参数
  const mainSql = query.getQuery();
  const mainParameters = query.getParameters();

  // 递归处理子查询
  const processSubQueries = (sql: string, parameters: any): string => {
    let processedSql = sql;

    // 处理子查询
    const subQueryMatches = sql.match(/\((SELECT[\s\S]*?)\)/gi);
    if (subQueryMatches) {
      for (const subQuery of subQueryMatches) {
        // 提取子查询SQL（去掉括号）
        const subQueryContent = subQuery.substring(1, subQuery.length - 1);
        // 递归处理子查询
        const processedSubQuery = processSubQueries(subQueryContent, parameters);
        // 替换原SQL中的子查询
        processedSql = processedSql.replace(subQuery, `(${processedSubQuery})`);
      }
    }

    // 处理参数
    let finalSql = processedSql;
    for (const [key, value] of Object.entries(parameters)) {
      if (Array.isArray(value)) {
        // 处理 IN (...) 子句中的数组参数
        const placeholders = value.map(() => '?').join(', ');
        finalSql = finalSql.replace(new RegExp(`:\\.\\.\\.${key}`, 'g'), placeholders);

        // 替换数组中的每个值
        let index = 0;
        finalSql = finalSql.replace(new RegExp(`\\?(?=(?:[^']*'[^']*')*[^']*$)`, 'g'), () => {
          if (index < value.length) {
            return formatValue(value[index++]);
          }
          return '?';
        });
      } else {
        // 处理普通参数，使用更精确的正则表达式避免误替换
        const regex = new RegExp(`:${key}(?![a-zA-Z0-9_])`, 'g');
        finalSql = finalSql.replace(regex, formatValue(value));
      }
    }

    return finalSql;
  };

  // 处理整个查询
  return processSubQueries(mainSql, mainParameters);
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
