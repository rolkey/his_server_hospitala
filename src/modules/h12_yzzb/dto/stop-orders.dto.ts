import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

// 停止医请求数据接口
export class StopOrdersDto {
  @IsString()
  @IsNotEmpty()
  zyid: string; // 住院ID

  @IsArray()
  @IsNotEmpty()
  mxxhList: number[]; // 医嘱明细序号数组

  @IsNumber()
  @IsNotEmpty()
  yzlx: number; // 医嘱类型

  @IsString()
  @IsNotEmpty()
  u_zcid: string; // 用户操作ID

  @IsString()
  @IsNotEmpty()
  u_userid: string; // 用户ID

  @IsString()
  @IsNotEmpty()
  jsys: string; // 结束医生ID

  @IsString()
  @IsOptional()
  s_datetime?: string; // 服务器时间(可选)
}
