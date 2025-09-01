import { IsNotEmpty, IsOptional, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateH11FpxbDto {
  @IsNotEmpty({ message: '发票号码不能为空' })
  @IsString()
  @MaxLength(10)
  fphm: string;

  @IsNotEmpty({ message: '发票项目ID不能为空' })
  @IsString()
  @MaxLength(10)
  fpxmid: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  fpxmmc?: string;

  @IsOptional()
  @IsNumber()
  fpxmje?: number;

  @IsOptional()
  @IsNumber()
  fpxmqtje?: number;
}

export class UpdateH11FpxbDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  fpxmmc?: string;

  @IsOptional()
  @IsNumber()
  fpxmje?: number;

  @IsOptional()
  @IsNumber()
  fpxmqtje?: number;
}

export class H11FpxbQueryDto {
  @IsOptional()
  @IsString()
  fphm?: string;

  @IsOptional()
  @IsString()
  fpxmid?: string;

  @IsOptional()
  @IsString()
  fpxmmc?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
