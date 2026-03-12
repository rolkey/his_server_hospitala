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
