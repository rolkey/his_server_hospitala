import { IsNotEmpty, IsOptional, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateH11JsxbDto {
  @IsNotEmpty({ message: '结算单号不能为空' })
  @IsString()
  @MaxLength(10)
  jsdh: string;

  @IsNotEmpty({ message: '费用类别ID不能为空' })
  @IsString()
  @MaxLength(10)
  fylbid: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  fylbmc?: string;

  @IsOptional()
  @IsNumber()
  jsje?: number;

  @IsOptional()
  @IsNumber()
  zfje?: number;

  @IsOptional()
  @IsNumber()
  gfje?: number;

  @IsOptional()
  @IsNumber()
  jmje?: number;

  @IsOptional()
  @IsNumber()
  qfje?: number;

  @IsOptional()
  @IsNumber()
  ssje?: number;
}

export class UpdateH11JsxbDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  fylbmc?: string;

  @IsOptional()
  @IsNumber()
  jsje?: number;

  @IsOptional()
  @IsNumber()
  zfje?: number;

  @IsOptional()
  @IsNumber()
  gfje?: number;

  @IsOptional()
  @IsNumber()
  jmje?: number;

  @IsOptional()
  @IsNumber()
  qfje?: number;

  @IsOptional()
  @IsNumber()
  ssje?: number;
}

export class H11JsxbQueryDto {
  @IsOptional()
  @IsString()
  jsdh?: string;

  @IsOptional()
  @IsString()
  fylbid?: string;

  @IsOptional()
  @IsString()
  fylbmc?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
