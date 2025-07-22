import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

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
  @IsNumber()
  inc_value?: number;
}
