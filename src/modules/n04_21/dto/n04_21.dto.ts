import { PartialType } from '@nestjs/mapped-types';
import { Allow, IsOptional, IsString, Length } from 'class-validator';

export class BaseN0421Dto {
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;
}

export class CreateN0421Dto extends PartialType(BaseN0421Dto) {}

export class UpdateN0421Dto extends PartialType(BaseN0421Dto) {}

export class QueryN0421Dto extends PartialType(BaseN0421Dto) {
  @Allow()
  @IsOptional()
  @IsString()
  zybh?: string;

  @Allow()
  @IsOptional()
  @IsString()
  bah?: string;

  @Allow()
  @IsOptional()
  @IsString()
  xm?: string;
}

export class FindByZyidDto {
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;
}
