import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

/** 按住院ID查询 */
export class QueryByZyidDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  @IsString()
  @MaxLength(12, { message: 'zyid长度不能超过12' })
  zyid: string;

  /** 科室ID，可选，按科室筛选 */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ksid?: string;
}

/** 创建/录入转科情况 */
export class CreateBrzkqkDto {
  /** 转科科室ID */
  @IsNotEmpty({ message: 'zkksid不能为空' })
  @IsString()
  @MaxLength(10)
  zkksid: string;

  /** 转科时间 */
  @IsNotEmpty({ message: 'zksj不能为空' })
  @IsDateString()
  zksj: string;

  /** 住院ID */
  @IsNotEmpty({ message: 'zyid不能为空' })
  @IsString()
  @MaxLength(12)
  zyid: string;

  /** 录入时间 */
  @IsNotEmpty({ message: 'lrsj不能为空' })
  @IsDateString()
  lrsj: string;

  /** 录入人ID */
  @IsNotEmpty({ message: 'lryid不能为空' })
  @IsString()
  @MaxLength(10)
  lryid: string;

  /** 确认时间 */
  @IsOptional()
  @IsDateString()
  qrsj?: string;

  /** 确认人ID */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  qrrid?: string;

  /** 科室ID */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  ksid?: string;
}

/** 确认转科（更新 qrsj、qrrid）或放弃转科 */
export class ConfirmBrzkqkDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  @IsString()
  @MaxLength(12)
  zyid: string;

  /** 确认人ID（确认转科时必填；放弃转科时可为空） */
  @ValidateIf((o) => o.abandon !== true)
  @IsNotEmpty({ message: '确认转科时qrrid不能为空' })
  @IsString()
  @MaxLength(10)
  qrrid?: string;
}


/** 放弃转科 */
export class AbandonBrzkqkDto {
  @IsNotEmpty({ message: 'zyid不能为空' })
  @IsString()
  @MaxLength(12)
  zyid: string;


  /** 作废人ID */
  @IsNotEmpty({ message: 'zflryid不能为空' })
  @IsString()
  @MaxLength(10)
  zflryid: string;
}
