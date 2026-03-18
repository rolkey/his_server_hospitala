import { Allow, IsArray, IsString } from 'class-validator';

export class QueryOrdersDto {
  @Allow()
  zyid?: string; // 对应JSON中的"zyid"
  @Allow()
  startDate?: string; // 对应JSON中的"startDate"
  @Allow()
  types?: string[]; // 对应JSON中的"types"数组
  @Allow()
  endDate?: string; // 对应JSON中的"endDate"
}

export class UpdateExecuteStatusDto {
  @Allow()
  orderId: string;
  @Allow()
  executeStatus: number;
  @Allow()
  executorId: string;
  @Allow()
  executeTime?: string;
  @Allow()
  remark?: string;
}

export class ExportDataDto {
  hospitalId?: string;
  patientId?: string;
  orderType?: string;
  startDate?: string;
  endDate?: string;
}

export class OrderResultDto {
  zyid: string; // 住院ID
  zybh: string; // 住院编号
  brxm: string; // 病人姓名
  ysid: string; // 医师ID
  xmid: string; // 项目ID
  xmmc: string; // 项目名称
  zt: number; // 状态
  yzrq: Date; // 医嘱日期
  sflbdh: string; // 收费类别代码
  bzxx: string; // 备注信息
  mxxh: string; // 明细序号
  yzlx: string; // 医嘱类型
  ksysxm: string; // 开嘱医生姓名
}

export class QueryExecutionDetailsDto {
  @IsString()
  zyid: string;

  @IsArray()
  @IsString({ each: true })
  fylbid: string[];
}
