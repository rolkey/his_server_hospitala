import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Allow,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

function emptyToUndefined({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) return undefined;
  return value;
}

/** 1=出院日期, 2=结算日期（对齐 PB al） */
export type ReceiveDateType = 1 | 2;

/** 0=全部, 1=未签收, 2=已签收（对齐 PB ls_drgbz） */
export type ReceiveSignStatus = 0 | 1 | 2;

/** 0=全部类型, 1=自费, 2=市医保, 3=其他医保（对齐 PB lb） */
export type ReceivePatientType = 0 | 1 | 2 | 3;

export class ReceiveListQueryDto {
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
  dateType?: ReceiveDateType;

  @ApiPropertyOptional({ description: '出院科室ID，0 或不传表示全部' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  ksid?: string;

  @ApiPropertyOptional({
    description: '签收状态：0=全部, 1=未签收, 2=已签收',
    enum: [0, 1, 2],
    default: 0,
  })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1, 2])
  signStatus?: ReceiveSignStatus;

  @ApiPropertyOptional({
    description: '患者类别：0=全部类型, 1=自费, 2=市医保, 3=其他医保',
    enum: [0, 1, 2, 3],
    default: 0,
  })
  @Allow()
  @IsOptional()
  @Type(() => Number)
  @IsIn([0, 1, 2, 3])
  patientType?: ReceivePatientType;

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

/** 病案首页接收签收。对齐 PB 签收：insert/update n04_czjl，jsbz=1 */
export class ReceiveSignDto {
  @ApiProperty({ description: '住院ID列表', type: [String], example: ['202608270001'] })
  @Allow()
  @IsArray()
  @ArrayMinSize(1, { message: '请选择要签收的病人' })
  @ArrayMaxSize(500)
  @IsString({ each: true })
  zyids: string[];

  @ApiProperty({ description: '交接人工号（n04_czjl.jjry）' })
  @Allow()
  @IsString()
  @IsNotEmpty({ message: '请选择交接人' })
  jjry: string;

  @ApiPropertyOptional({ description: '签收时间，不传则用服务器当前时间', example: '2026-08-27 22:50:00' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  czsj?: string;

  @ApiPropertyOptional({ description: '迟交天数（n04_czjl.bz1）' })
  @Allow()
  @IsOptional()
  @Transform(({ value }) => (value === null || value === undefined ? '' : String(value)))
  @IsString()
  bz1?: string;

  @ApiPropertyOptional({ description: '接受人/操作人工号。优先用登录用户，缺省时用此字段' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  czry?: string;
}

/** 病案首页接收取消签收。对齐 PB 取消签收：已签收则 czry/jjry 置空、jsbz=0 */
export class ReceiveUnsignDto {
  @ApiProperty({ description: '住院ID列表', type: [String], example: ['202608270001'] })
  @Allow()
  @IsArray()
  @ArrayMinSize(1, { message: '请选择要取消签收的病人' })
  @ArrayMaxSize(500)
  @IsString({ each: true })
  zyids: string[];

  @ApiPropertyOptional({ description: '取消签收时间，不传则用服务器当前时间', example: '2026-08-27 22:50:00' })
  @Allow()
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  czsj?: string;
}
