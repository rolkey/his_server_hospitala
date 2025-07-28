// src/lis_sflb/lis_sflb.dto.ts

export class LisSflbBaseDto {
  lbcode: string;
  lbname?: string;
  pybm?: string;
  wbbm?: string;
  qtbm?: string;
  fylbid?: string;
  zxksid?: string;
  yxbz?: number;
  bz1?: string;
  bz2?: string;
}

export class CreateLisSflbDto extends LisSflbBaseDto {
  // 继承所有基础字段
  // 可以在此添加创建特有的验证规则或字段
}

export class UpdateLisSflbDto extends LisSflbBaseDto {
  // 使用PartialType使所有字段可选
  // 可以在此添加更新特有的验证规则或字段
}

export class QueryLisSflbDto extends LisSflbBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}

export class LisSflbResponseDto extends LisSflbBaseDto {
  // 继承所有基础字段
  // 可以添加响应特有的字段或转换
}
