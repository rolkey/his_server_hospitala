import { IsNotEmpty, IsOptional, IsString, IsInt, IsDate, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MedicalRecordQueryDto {
  @IsString()
  @IsNotEmpty()
  ylzh: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class FeeSummaryQueryDto {
  @IsString()
  @IsNotEmpty()
  type: string; // 1 门诊 2 住院

  @IsString()
  @IsNotEmpty()
  id: string; // 1 门诊 2 住院

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}

export class FeeDetailQueryDto {
  @IsString()
  @IsNotEmpty()
  type: string; // 1 门诊 2 住院

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  isMerge?: string; // 是否明细合并 1 是 0 否

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}
