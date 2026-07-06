import { PartialType } from '@nestjs/mapped-types';
import { Allow, IsString, Length } from 'class-validator';

export class BaseN0425Dto {
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;
}

export class CreateN0425Dto extends PartialType(BaseN0425Dto) {}

export class UpdateN0425Dto extends PartialType(BaseN0425Dto) {}

export class QueryN0425Dto extends PartialType(BaseN0425Dto) {}

export class FindByZyidDto {
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;
}
