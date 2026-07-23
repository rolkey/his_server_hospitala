import {
  IsNumber,
  IsOptional,
  Min,
  Max,
  Allow,
  IsNotEmpty,
  ValidateIf,
  ValidateBy,
  ValidationArguments,
  Length,
  IsString,
} from 'class-validator';

export class CreateDto {}

export class QueryDto {
  @Allow()
  value?: string;
  // @Allow()
  // @ValidateIf((o) => o.pybm !== undefined && o.pybm !== '')
  // @Length(2, 10, { message: '拼音编码长度必须在2-10个字符之间' })
  // pybm?: string;

  // @Allow()
  // @ValidateIf((o) => o.wbbm !== undefined && o.wbbm !== '')
  // @Length(2, 10, { message: '五笔编码长度必须在2-10个字符之间' })
  // wbbm?: string;

  // @Allow()
  // @ValidateIf((o) => o.qtbm !== undefined && o.qtbm !== '')
  // @Length(2, 10, { message: '其他编码长度必须在2-10个字符之间' })
  // qtbm?: string;
}

export class Queryjbbmicd10Dto extends QueryDto {
  @Allow()
  pageSize?: number;

  @Allow()
  pageNo?: number;

  @Allow()
  value?: string;

  /** 诊断类型，支持逗号分隔多值，如 1 或 0,1,2,3,4,5,6,9 */
  @Allow()
  lx?: string;
}

export class UpdateDto extends CreateDto {}
