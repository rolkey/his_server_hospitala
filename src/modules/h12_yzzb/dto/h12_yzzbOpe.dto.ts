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
  zyid?: string;

  @IsNotEmpty({ message: 'yzxh不能为空' })
  @IsArray()
  yzxh?: number[];

  @IsNotEmpty({ message: 'mxxh不能为空' })
  @IsArray()
  mxxh?: number[];

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
}



export class executeDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  zyid?: string;

  @IsNotEmpty({ message: 'beginDate不能为空' })
  beginDate?: Date;

  @IsNotEmpty({ message: 'endDate不能为空' })
  endDate?: Date;

  @IsNotEmpty({ message: 'zxhs不能为空' })
  zxhs?: string;

  @IsNotEmpty({ message: 'zxks不能为空' })
  zxks?: string;

  @IsNotEmpty({ message: 'executeType不能为空' })
  executeType?: string;

  @IsOptional()
  newYear?: string;

  @IsOptional()
  medicine?: string;

  @IsOptional()
  mxxh?: number;
}


export class costDto {
  @IsNotEmpty({ message: 'mxxh不能为空' })
  mxxh?: number;

  @IsOptional()
  bzxcs?: number;
}

export class adviceDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  zyid?: string;

  @IsNotEmpty({ message: 'yzlx不能为空' })
  yzlx?: number;

  @IsNotEmpty({ message: 'zxhs不能为空' })
  zxhs?: string;

  @IsNotEmpty({ message: 'mxxhList不能为空' })
  @IsArray()
  mxxhList?: costDto[];

}

