import { IsNotEmpty, IsOptional, IsNumber, IsString, MaxLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateH11ZypjDto {
  @IsNotEmpty({ message: '票据类型ID不能为空' })
  @IsString()
  @MaxLength(10)
  pjlxid: string;

  @IsNotEmpty({ message: '当前号码不能为空' })
  @IsNumber()
  dqhm: number;

  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsString()
  @MaxLength(10)
  usid: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  pjlxmc?: string;

  @IsNotEmpty({ message: '终止号码不能为空' })
  @IsNumber()
  zzhm: number;

  @IsOptional()
  @IsInt()
  pjcd?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  kshm?: string;

  @IsNotEmpty({ message: '费用ID不能为空' })
  @IsString()
  @MaxLength(10)
  fyid: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz1?: string;
}

export class UpdateH11ZypjDto {
  @IsOptional()
  @IsNumber()
  dqhm?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  pjlxmc?: string;

  @IsOptional()
  @IsNumber()
  zzhm?: number;

  @IsOptional()
  @IsInt()
  pjcd?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  kshm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  bz1?: string;
}

export class H11ZypjQueryDto {
  @IsOptional()
  @IsString()
  pjlxid?: string;

  @IsOptional()
  @IsString()
  usid?: string;

  @IsOptional()
  @IsString()
  fyid?: string;

  @IsOptional()
  @IsString()
  pjlxmc?: string;

  @IsOptional()
  @IsString()
  kshm?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}

export class H11ZypjPrimaryDto {
  @IsNotEmpty()
  pjlxid: string;

  @IsNotEmpty()
  usid?: string;

  @IsNotEmpty()
  fyid?: string;
}
