import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGyIdentityDto {
  @IsNotEmpty()
  @IsString()
  tname: string;

  @IsOptional()
  value?: number;

  @IsOptional()
  origin_value?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined)) // 显式转换
  inc_value?: number;
}
