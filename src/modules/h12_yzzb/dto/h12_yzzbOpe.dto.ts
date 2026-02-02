import { Allow, IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { UpdateH12_yzxbDto, H12_yzxbDto } from './h12_yzxb.dto';

/**
 * 操作参数类，医嘱保存时前端的附加信息通过这个参数来传
 */
export class H12_yzzbOpeDto {
  @Allow()
  attachFlag?: boolean;

  @Allow()
  zyid: string;

  @Allow()
  yzlx: number;

  @Allow()
  h12_yzxbs: UpdateH12_yzxbDto[];

  @Allow()
  deleteList: H12_yzxbDto[];
}

export class reviewDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  zyid: string;

  @IsNotEmpty({ message: 'yzxh不能为空' })
  @IsArray()
  yzxh: number[];

  @IsNotEmpty({ message: 'mxxh不能为空' })
  @IsArray()
  mxxh: number[];

  @IsNotEmpty({ message: 'yzlx不能为空' })
  yzlx?: number;

  @IsNotEmpty({ message: 'rysj不能为空' })
  rq?: Date;

  @IsNotEmpty({ message: 'kshs不能为空' })
  kshs?: string;

  @IsNotEmpty({ message: 'jshs不能为空' })
  jshs?: string;

  @IsOptional()
  kssxhs?: string;

  // 忽略费用：不处理未退费医嘱
  @IsOptional()
  hlfy?: boolean;
}

export class executeDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  zyid: string;

  @IsNotEmpty({ message: 'beginDate不能为空' })
  beginDate: Date;

  @IsNotEmpty({ message: 'endDate不能为空' })
  endDate: Date;

  @IsNotEmpty({ message: 'zxhs不能为空' })
  zxhs: string;

  @IsNotEmpty({ message: 'zxks不能为空' })
  zxks: string;

  @IsNotEmpty({ message: 'executeType不能为空' })
  executeType: string;

  @IsOptional()
  newYear?: string;

  @IsOptional()
  medicine?: string;

  @IsOptional()
  yzzh: string;
}

export class costDto {
  @IsOptional()
  mxxh?: number;

  @IsOptional()
  maxid?: number;

  @IsOptional()
  bzxcs?: number;
}

export class adviceDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  zyid: string;

  //   @IsNotEmpty({ message: 'yzlx不能为空' })
  @Allow()
  yzlx?: number;

  @Allow()
  @IsOptional()
  zxhs?: string;

  //   @Allow()
  //   @IsOptional()
  //   userId?: string;

  @IsArray()
  @IsOptional()
  mxxhList?: costDto[];

  @IsArray()
  @IsOptional()
  maxidList?: costDto[];
}

export class medicineReceiptDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  zyid?: string;

  @IsNotEmpty({ message: 'zxhs不能为空' })
  zxhs?: string;
}

export class outDto {
  @IsNotEmpty({ message: '住院id不能为空' })
  zyid?: string;

  @IsNotEmpty({ message: '出院时间不能为空' })
  cysj?: string;

  @IsNotEmpty({ message: '出院情况不能为空' })
  cyqk?: string;

  @IsNotEmpty({ message: '出院诊断不能为空' })
  cyzd?: string;

  @IsOptional()
  cyzd1?: string;

  @IsOptional()
  cyzd2?: string;

  @IsOptional()
  skipVerify?: boolean = false;

  // @IsNotEmpty({ message: '系统参数对象不能为空' })
  // gs_cxsz: gs_cxsz;
}
// export class gs_cxsz {
//   @IsOptional()
//   xyksid: string;
//   @IsOptional()
//   cyksid: string;
//   @IsOptional()
//   zyksid: string;
//   @IsOptional()
//   clksid: string;
//   @IsOptional()
//   qtksid: string;
//   @IsOptional()
//   zjksid: string;
//   @IsOptional()
//   jpksid: string;
//   @IsOptional()
//   hlksid: string;
// }

export class checkOutDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  zyid?: string;
}

export class CopyAdviceDto {
  @IsNotEmpty({ message: 'mxxh不能为空' })
  mxxh?: string[];

  @IsNotEmpty({ message: '新医嘱的zyid不能为空' })
  zyidNew?: string;
}

////
