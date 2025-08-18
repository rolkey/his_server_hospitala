import { Allow, IsNotEmpty } from 'class-validator';

export class SysparDto {
  @Allow()
  @IsNotEmpty({ message: '系统识别不能为空' })
  xtsb: number;

  @Allow()
  @IsNotEmpty({ message: '参数名称不能为空' })
  csmc: string;

  @Allow()
  default: string;

  @Allow()
  bz: string;
}
