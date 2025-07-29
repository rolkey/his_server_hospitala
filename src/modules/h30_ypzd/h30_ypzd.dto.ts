// src/modules/h30_ypzd/h30_ypzd.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class H30_ypzdBaseDto {
  @Allow()
  ypid: string;

  @Allow()
  zwmc?: string;

  @Allow()
  bzbm?: string;

  @Allow()
  ypflid?: string;

  @Allow()
  ypflbm?: string;

  @Allow()
  ypgg?: string;

  @Allow()
  yphl?: string;

  @Allow()
  hlxs?: number;

  @Allow()
  hldw?: string;

  @Allow()
  jxflid?: string;

  @Allow()
  spmc?: string;

  @Allow()
  ywmc?: string;

  @Allow()
  ldmc?: string;

  @Allow()
  szbm?: string;

  @Allow()
  pybm?: string;

  @Allow()
  wbbm?: string;

  @Allow()
  qtbm?: string;

  @Allow()
  syffid?: string;

  @Allow()
  syplid?: string;

  @Allow()
  ycjl?: number;

  @Allow()
  yrjl?: number;

  @Allow()
  yjjl?: string;

  @Allow()
  ejjl?: string;

  @Allow()
  sjjl?: string;

  @Allow()
  yexs?: number;

  @Allow()
  esxs?: number;

  @Allow()
  ysxs?: number;

  @Allow()
  cfqj?: string;

  @Allow()
  zzbz?: number;

  @Allow()
  pwjj?: number;

  @Allow()
  qtjj?: number;

  @Allow()
  dybz?: number;

  @Allow()
  mzbz?: number;

  @Allow()
  gzbz?: number;

  @Allow()
  jsl1?: number;

  @Allow()
  jsl2?: number;

  @Allow()
  jkbz?: number;

  @Allow()
  ybfl?: number;

  @Allow()
  abcfl?: number;

  @Allow()
  fylbid?: string;

  @Allow()
  zflx?: string;

  @Allow()
  zyyt?: string;

  @Allow()
  yfyl?: string;

  @Allow()
  zysx?: string;

  @Allow()
  zcff?: string;

  @Allow()
  bzxx?: string;

  @Allow()
  bfxs?: number;

  @Allow()
  ypfl?: number;

  @Allow()
  sj1?: number;

  @Allow()
  bz1?: string;

  @Allow()
  lsj?: number;

  @Allow()
  pfj?: number;

  @Allow()
  ksid?: string;

  @Allow()
  uploadcode?: string;

  @Allow()
  zzrz?: number;

  @Allow()
  swjp?: number;

  @Allow()
  qt1?: number;

  @Allow()
  qt2?: number;

  @Allow()
  gsid?: string;

  @Allow()
  qtbz1?: string;

  @Allow()
  qtbz2?: string;

  @Allow()
  code?: string;

  @Allow()
  qt3?: number;

  @Allow()
  qt4?: number;

  @Allow()
  qt5?: number;

  @Allow()
  qt6?: number;

  @Allow()
  qtbz3?: string;

  @Allow()
  qtbz4?: string;

  @Allow()
  qtbz5?: string;

  @Allow()
  gg?: string;

  @Allow()
  pzwh?: string;

  @Allow()
  xlsj?: number;

  @Allow()
  ybgg?: string;

  @Allow()
  ybjx?: string;

  @Allow()
  ybcj?: string;

  @Allow()
  zzh?: string;

  @Allow()
  zzmc?: string;

  @Allow()
  synf?: number;

  @Allow()
  meno?: string;

  @Allow()
  lb?: string;

  @Allow()
  lbbig?: string;

  @Allow()
  cjrq?: Date;

  @Allow()
  zzgg?: string;

  @Allow()
  clcz?: string;

  @Allow()
  pric?: number;

  @Allow()
  cd?: string;

  @Allow()
  gsmc?: string;

  @Allow()
  gjybbm?: string;

  @Allow()
  gjybmc?: string;

  @Allow()
  qt7?: number;

  @Allow()
  qt8?: number;

  @Allow()
  kzbz?: number;

  @Allow()
  mccs?: number;

  @Allow()
  mrcs?: number;

  @Allow()
  mrsl?: number;

  @Allow()
  ksshl?: number;

  @Allow()
  zsm?: string;
}

export class CreateH30_ypzdDto extends H30_ypzdBaseDto {
  // 可以添加创建特有的验证规则
  // 例如：
  // @IsNotEmpty()
  // ypid: string;
}

export class UpdateH30_ypzdDto extends PartialType(H30_ypzdBaseDto) {
  // 所有字段自动变为可选
  // 可以添加更新特有的验证规则
}

export class QueryH30_ypzdDto extends PartialType(H30_ypzdBaseDto) {
  @Allow()
  pageNo?: number = 1; // 默认第一页

  @Allow()
  pageSize?: number = 10; // 默认每页10条

  // 可以添加排序字段
  // @Allow()
  // sortField?: string;

  // @Allow()
  // sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

export class H30_ypzdResponseDto extends H30_ypzdBaseDto {
  // 可以添加响应特有的字段或转换
  // 例如：
  // @Expose()
  // get fullName(): string {
  //   return `${this.zwmc} (${this.ypid})`;
  // }
}
