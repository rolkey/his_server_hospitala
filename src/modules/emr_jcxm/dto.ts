import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsNotEmpty,
  Allow,
  ValidateIf,
  Matches,
  IsArray,
} from 'class-validator';

export class Jcbw {
  @IsNotEmpty()
  @IsString()
  bwid: string;
}

export class Jcff {
  @IsNotEmpty()
  ffid: string;
}
export class QueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000, { message: 'pageSize必须大于零,最大值1000' })
  pageSize?: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'pageNo必须大于零' })
  pageNo?: number;

  @IsOptional()
  zt?: string;

  @IsOptional()
  jcxmmc?: string;

  @IsOptional()
  flid?: string;
}

export class CreateDto {
  @IsOptional()
  zt?: string;

  @IsOptional()
  jcxmmc?: string;

  @IsOptional()
  bzxx?: string;

  @IsOptional()
  pybm?: string;

  @IsOptional()
  wbbm?: string;

  @IsOptional()
  qtbm?: string;

  // @IsNotEmpty({ message: '分类ID不能为空' })
  @IsOptional()
  flid?: string;
}

export class UpdateDto extends CreateDto {
  @IsString()
  @IsNotEmpty({ message: '检查项目ID不能为空' })
  jcxmid?: string;

  @IsOptional()
  @IsArray()
  jcbwList?: Jcbw[];

  @IsOptional()
  @IsArray()
  jcffList?: Jcff[];
}
