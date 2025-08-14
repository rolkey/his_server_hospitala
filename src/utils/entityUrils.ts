import { Connection, EntityManager, EntityTarget } from 'typeorm';

// 获取实体的所有列名
function getEntityColumns<T>(
  entity: EntityTarget<T>,
  connectionOrManager: Connection | EntityManager,
): string[] {
  try {
    const metadata = connectionOrManager.getRepository(entity).metadata;
    return metadata.columns.map((column) => column.propertyName);
  } catch (error) {
    console.error(`Error getting columns for entity: ${error}`);
    return [];
  }
}

// 筛选出只在目标实体中存在的字段
export function filterEntityFields<T>(
  entity: EntityTarget<T>,
  fields: Record<string, any>,
  connectionOrManager: Connection | EntityManager,
): Record<string, any> {
  const entityColumns = getEntityColumns(entity, connectionOrManager);
  const result: Record<string, any> = {};

  for (const key in fields) {
    if (entityColumns.includes(key)) {
      result[key] = fields[key];
    }
  }

  return result;
}

// // 使用示例
// delete updateFields.isNew;
// const filteredUpdateFields = filterEntityFields(h12_yzxb, updateFields, manager);

// return manager.update(
//   h12_yzxb,
//   {
//     mxxh,
//     yzlx,
//     yzxh,
//     zyid,
//   },
//   filteredUpdateFields,
// );
