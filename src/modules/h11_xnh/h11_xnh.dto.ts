import { IsNotEmpty, IsOptional, IsNumber, IsString, MaxLength, IsInt } from 'class-validator';

export class CreateH11XnhDto {
  @IsNotEmpty({ message: '发票号码不能为空' })
  @IsString()
  @MaxLength(15)
  fphm: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zyid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zyh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  brxm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  ylzh?: string;

  @IsOptional()
  @IsNumber()
  fyhj?: number;

  @IsOptional()
  @IsNumber()
  kbhj?: number;

  @IsOptional()
  @IsNumber()
  sjhj?: number;

  @IsOptional()
  @IsNumber()
  bsbl?: number;

  @IsOptional()
  @IsNumber()
  ljfyhj?: number;

  @IsOptional()
  @IsNumber()
  ljfykb?: number;

  @IsOptional()
  @IsNumber()
  ljsjhj?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  lxdz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jgmc?: string;

  @IsOptional()
  @IsNumber()
  sfje?: number;

  @IsOptional()
  @IsNumber()
  dbje?: number;

  @IsOptional()
  @IsNumber()
  yhje?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  yhkh?: string;

  @IsOptional()
  @IsNumber()
  je1?: number;

  @IsOptional()
  @IsNumber()
  je2?: number;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  bz1?: string;

  @IsOptional()
  @IsNumber()
  xnhj?: number;

  @IsOptional()
  @IsNumber()
  je3?: number;

  @IsOptional()
  @IsInt()
  szbz?: number;

  @IsOptional()
  @IsNumber()
  mzbc?: number;

  @IsOptional()
  @IsNumber()
  qtje1?: number;

  @IsOptional()
  @IsNumber()
  qtje2?: number;

  @IsOptional()
  @IsNumber()
  qtje3?: number;

  @IsOptional()
  @IsNumber()
  qtje4?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx?: string;

  @IsOptional()
  @IsNumber()
  zfje?: number;

  @IsOptional()
  @IsNumber()
  qt1?: number;

  @IsOptional()
  @IsNumber()
  qt2?: number;

  @IsOptional()
  @IsNumber()
  qt3?: number;

  @IsOptional()
  @IsNumber()
  qt4?: number;

  @IsOptional()
  @IsNumber()
  yfje?: number;

  @IsOptional()
  @IsNumber()
  yfje1?: number;

  @IsOptional()
  @IsNumber()
  yfje2?: number;

  @IsOptional()
  @IsNumber()
  yfje3?: number;

  @IsOptional()
  @IsNumber()
  yfje4?: number;
}

export class UpdateH11XnhDto {
  @IsOptional()
  @IsString()
  @MaxLength(12)
  zyid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  zyh?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  brxm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  ylzh?: string;

  @IsOptional()
  @IsNumber()
  fyhj?: number;

  @IsOptional()
  @IsNumber()
  kbhj?: number;

  @IsOptional()
  @IsNumber()
  sjhj?: number;

  @IsOptional()
  @IsNumber()
  bsbl?: number;

  @IsOptional()
  @IsNumber()
  ljfyhj?: number;

  @IsOptional()
  @IsNumber()
  ljfykb?: number;

  @IsOptional()
  @IsNumber()
  ljsjhj?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  lxdz?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  jgmc?: string;

  @IsOptional()
  @IsNumber()
  sfje?: number;

  @IsOptional()
  @IsNumber()
  dbje?: number;

  @IsOptional()
  @IsNumber()
  yhje?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  yhkh?: string;

  @IsOptional()
  @IsNumber()
  je1?: number;

  @IsOptional()
  @IsNumber()
  je2?: number;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  bz1?: string;

  @IsOptional()
  @IsNumber()
  xnhj?: number;

  @IsOptional()
  @IsNumber()
  je3?: number;

  @IsOptional()
  @IsInt()
  szbz?: number;

  @IsOptional()
  @IsNumber()
  mzbc?: number;

  @IsOptional()
  @IsNumber()
  qtje1?: number;

  @IsOptional()
  @IsNumber()
  qtje2?: number;

  @IsOptional()
  @IsNumber()
  qtje3?: number;

  @IsOptional()
  @IsNumber()
  qtje4?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  bzxx?: string;

  @IsOptional()
  @IsNumber()
  zfje?: number;

  @IsOptional()
  @IsNumber()
  qt1?: number;

  @IsOptional()
  @IsNumber()
  qt2?: number;

  @IsOptional()
  @IsNumber()
  qt3?: number;

  @IsOptional()
  @IsNumber()
  qt4?: number;

  @IsOptional()
  @IsNumber()
  yfje?: number;

  @IsOptional()
  @IsNumber()
  yfje1?: number;

  @IsOptional()
  @IsNumber()
  yfje2?: number;

  @IsOptional()
  @IsNumber()
  yfje3?: number;

  @IsOptional()
  @IsNumber()
  yfje4?: number;
}

export class H11XnhQueryDto {
  @IsOptional()
  @IsString()
  fphm?: string;

  @IsOptional()
  @IsString()
  zyid?: string;

  @IsOptional()
  @IsString()
  zyh?: string;

  @IsOptional()
  @IsString()
  brxm?: string;

  @IsOptional()
  @IsString()
  ylzh?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;
}
