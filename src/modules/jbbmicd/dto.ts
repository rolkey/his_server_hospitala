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
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000, { message: 'pageSize必须大于零,最大值1000' })
  pageSize?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'pageNo必须大于零' })
  pageNo?: number;

  @Allow()
  value?: string;
}

export class UpdateDto extends CreateDto {}
