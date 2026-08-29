import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Allow, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

function emptyToUndefined({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) return undefined;
  return value;
}

/** 病案首页解锁表单查询 */
export class UnlockFormQueryDto {
  @ApiProperty({ description: '住院ID' })
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;
}

/** 病案首页解锁保存。对齐 PB w_basy_edit：写入 h12_bljs，yxbz=1 */
export class UnlockSaveDto {
  @ApiProperty({ description: '住院ID', example: '000000034949' })
  @Allow()
  @IsString()
  @IsNotEmpty({ message: '请输入证号!' })
  @Length(1, 12)
  zyid: string;

  @ApiProperty({ description: '解锁期限（允许最迟完成期限）', example: '2026-08-30 23:59:59' })
  @Allow()
  @IsString()
  @IsNotEmpty({ message: '请选择解锁期限' })
  yxsj: string;

  @ApiPropertyOptional({ description: '说明' })
  @Allow()
  @IsOptional()
  @Transform(({ value }) => (value === null || value === undefined ? '' : String(value)))
  @IsString()
  sm?: string;

  @ApiPropertyOptional({ description: '操作人工号。优先用登录用户，缺省时用此字段' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  czry?: string;
}
