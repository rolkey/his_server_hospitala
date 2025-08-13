import { Allow } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class H12RyjlBaseDto {
  @Allow()
  zyid: string;

  @Allow()
  lx: string;

  @Allow()
  brcsz?: string;

  @Allow()
  zs?: string;

  @Allow()
  xbs?: string;

  @Allow()
  jws?: string;

  @Allow()
  grs?: string;

  @Allow()
  yjs?: string;

  @Allow()
  jzs?: string;

  @Allow()
  ryqk?: string;

  @Allow()
  cyqk?: string;

  @Allow()
  zljg?: string;

  @Allow()
  blfx?: string;

  @Allow()
  yy?: string;

  @Allow()
  ryzd1?: string;

  @Allow()
  ryzd2?: string;

  @Allow()
  cyzd1?: string;

  @Allow()
  cyzd2?: string;

  @Allow()
  yszc?: string;

  @Allow()
  ysid?: string;

  @Allow()
  sjbz?: number;

  @Allow()
  rysj?: Date;

  @Allow()
  cysj?: Date;

  @Allow()
  lrsj?: Date;

  @Allow()
  bz1?: string;

  @Allow()
  bz2?: string;

  @Allow()
  bz3?: string;

  @Allow()
  bz4?: string;

  @Allow()
  bz5?: string;
}

export class CreateH12RyjlDto extends H12RyjlBaseDto {
  // 可以添加创建特有的验证规则
  // 例如：
  // @IsNotEmpty()
  // zyid: string;
  // @IsNotEmpty()
  // lx: string;
}

export class UpdateH12RyjlDto extends PartialType(H12RyjlBaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH12RyjlDto extends PartialType(H12RyjlBaseDto) {
  @Allow()
  pageNo?: number = 1;

  @Allow()
  pageSize?: number = 10;

  @Allow()
  startDate?: Date;

  @Allow()
  endDate?: Date;

  @Allow()
  sortBy?: string = 'lrsj';

  @Allow()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class H12RyjlResponseDto extends H12RyjlBaseDto {
  // 可以添加响应特有的字段或转换
  // 例如：
  // @Expose()
  // get formattedRysj(): string {
  //   return this.rysj?.toISOString();
  // }
}
