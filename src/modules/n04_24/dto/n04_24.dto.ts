import { PartialType } from '@nestjs/mapped-types';
import { Allow, IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class BaseN0424Dto {
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;
}

export class CreateN0424Dto extends PartialType(BaseN0424Dto) {}

export class UpdateN0424Dto extends PartialType(BaseN0424Dto) {}

export class QueryN0424Dto extends PartialType(BaseN0424Dto) {}

export class FindByZyidDto {
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;
}

export class ReadFyxxDto {
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;

  /** 费用统计开始时间，不传则取入院时间 */
  @Allow()
  @IsOptional()
  @IsString()
  date1?: string;

  /** 费用统计结束时间，不传则取出院时间（在院则取当前时间） */
  @Allow()
  @IsOptional()
  @IsString()
  date2?: string;

  /** 已有费用时是否强制重新读取 */
  @Allow()
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}
