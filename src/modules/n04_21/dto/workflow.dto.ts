import { Allow, IsArray, IsIn, IsObject, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** 0=取消归档, 1=提交, 2=归档, 3=病案室审核, 4=取消审核, 9=取消提交 */
export type WorkflowActionCode = 0 | 1 | 2 | 3 | 4 | 9;

export class PatientCaseWorkflowDto {
  @ApiProperty({ description: '住院ID' })
  @Allow()
  @IsString()
  @Length(1, 12)
  zyid: string;

  @ApiProperty({
    description: '操作码：0=取消归档, 1=提交, 2=归档, 3=病案室审核, 4=取消审核, 9=取消提交',
    enum: [0, 1, 2, 3, 4, 9],
  })
  @Allow()
  @IsIn([0, 1, 2, 3, 4, 9])
  action: WorkflowActionCode;

  @ApiPropertyOptional({ description: '审核人员（病案室审核时写入 shry，优先取登录用户）' })
  @Allow()
  @IsOptional()
  @IsString()
  shry?: string;

  /** 基本信息业务数据（可选，任意操作均可携带；状态字段由服务端写入） */
  @ApiPropertyOptional({ description: 'N04_21 基本信息' })
  @Allow()
  @IsOptional()
  @IsObject()
  basic?: Record<string, unknown>;

  /** 诊断列表 */
  @ApiPropertyOptional({ description: 'N04_22 诊断列表' })
  @Allow()
  @IsOptional()
  @IsArray()
  diagnosis?: Record<string, unknown>[];

  /** 手术列表 */
  @ApiPropertyOptional({ description: 'N04_23 手术列表' })
  @Allow()
  @IsOptional()
  @IsArray()
  surgery?: Record<string, unknown>[];

  /** 费用信息 */
  @ApiPropertyOptional({ description: 'N04_24 费用信息' })
  @Allow()
  @IsOptional()
  @IsObject()
  fee?: Record<string, unknown>;

  /** 婴儿信息（有记录时传入） */
  @ApiPropertyOptional({ description: 'N04_25 婴儿信息' })
  @Allow()
  @IsOptional()
  @IsObject()
  newborn?: Record<string, unknown>;
}
