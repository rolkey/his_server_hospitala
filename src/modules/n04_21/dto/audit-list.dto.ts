import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Allow, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

function emptyToUndefined({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) return undefined;
  return value;
}

/** 1=出院日期, 2=结算日期（对齐 PB al / ddlb_rq） */
export type AuditDateType = 1 | 2;

/** 0=全部类型, 1=自费, 2=市医保, 3=其他医保（对齐 PB lb / ddlb_brlx） */
export type AuditPatientType = 0 | 1 | 2 | 3;

/**
 * 对齐 PB ddlb_zt：
 * 1=全部, 2=未写首页, 3=未提交, 4=未审核, 5=已审核, 6=drg未审, 7=drg已审
 */
export type AuditStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export class AuditListQueryDto {
  @ApiProperty({ description: '开始日期（含当天 00:00:00）', example: '2026-08-01' })
  @Allow()
  @IsString()
  @IsNotEmpty({ message: '开始日期不能为空' })
  startDate: string;

  @ApiProperty({ description: '结束日期（含当天 23:59:59）', example: '2026-08-27' })
  @Allow()
  @IsString()
  @IsNotEmpty({ message: '结束日期不能为空' })
  endDate: string;

  @ApiPropertyOptional({
    description: '日期类型：1=出院日期, 2=结算日期',
    enum: [1, 2],
    default: 1,
  })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsIn([1, 2])
  dateType?: AuditDateType;

  @ApiPropertyOptional({ description: '出院科室ID，0 或不传表示全部' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  ksid?: string;

  @ApiPropertyOptional({
    description: '患者类别：0=全部类型, 1=自费(brlxid=0201), 2=市医保, 3=其他医保',
    enum: [0, 1, 2, 3],
    default: 0,
  })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1, 2, 3])
  patientType?: AuditPatientType;

  @ApiPropertyOptional({
    description:
      '审核状态：1=全部, 2=未写首页, 3=未提交, 4=未审核, 5=已审核, 6=drg未审, 7=drg已审',
    enum: [1, 2, 3, 4, 5, 6, 7],
    default: 4,
  })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsIn([1, 2, 3, 4, 5, 6, 7])
  auditStatus?: AuditStatus;

  @ApiPropertyOptional({ description: '主管医师工号（h11_brxx.mzys）' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  mzys?: string;

  @ApiPropertyOptional({ description: '住院号' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  zybh?: string;

  @ApiPropertyOptional({ description: '病案号' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  bah?: string;

  @ApiPropertyOptional({ description: '姓名（模糊）' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  xm?: string;

  @ApiPropertyOptional({
    description: '参保地区匹配（g10_djxx.bz2 LIKE），默认 %。市医保/其他医保用',
    default: '%',
  })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  ssdq?: string;

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNo?: number;

  @ApiPropertyOptional({ description: '每页条数', default: 100 })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize?: number;
}
