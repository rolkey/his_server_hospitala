import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Allow, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

function emptyToUndefined({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) return undefined;
  return value;
}

/** 首页解锁列表查询。对齐 PB dw_1 查询条件 + dw_cybr / dw_2 */
export class UnlockListQueryDto {
  @ApiPropertyOptional({ description: '起始时间（出院日期，含当天 00:00:00）。按住院ID查解锁记录时可省略', example: '2026-07-30' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束时间（出院日期，含当天 23:59:59）。按住院ID查解锁记录时可省略', example: '2026-08-29' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: '住院ID。传入时解锁记录只查该病人' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  zyid?: string;

  @ApiPropertyOptional({ description: '病人类型 brlxid，空或不传表示全部' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  brlxid?: string;

  @ApiPropertyOptional({ description: '患者姓名（模糊匹配 h11_brxx.brxm）' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  xm?: string;

  @ApiPropertyOptional({ description: '住院号（模糊匹配 h11_brxx.zybh）' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  zybh?: string;

  @ApiPropertyOptional({ description: '出院科室ID，0 或不传表示全部' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  ksid?: string;

  @ApiPropertyOptional({ description: '电话号码（精确匹配 h11_brxx.lxdh）' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  dhhm?: string;

  @ApiPropertyOptional({ description: '身份证号（精确匹配 h11_brxx.sfzh）' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  sfzh?: string;

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
