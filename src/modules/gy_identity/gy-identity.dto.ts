import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGyIdentityDto {
  @IsNotEmpty()
  tname: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsNumber()
  origin_value?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined)) // 显式转换
  @IsNumber() // 验证转换后的值
  inc_value?: number;
}
