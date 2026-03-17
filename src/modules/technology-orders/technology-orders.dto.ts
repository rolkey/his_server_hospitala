export class QueryOrdersDto {
  hospitalId?: string;
  patientId?: string;
  orderType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export class UpdateExecuteStatusDto {
  orderId: string;
  executeStatus: number;
  executorId: string;
  executeTime?: string;
  remark?: string;
}

export class ExportDataDto {
  hospitalId?: string;
  patientId?: string;
  orderType?: string;
  startDate?: string;
  endDate?: string;
}
