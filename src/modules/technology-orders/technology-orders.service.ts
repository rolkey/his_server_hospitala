import { Injectable } from '@nestjs/common';
import { ExportDataDto, QueryOrdersDto, UpdateExecuteStatusDto } from './technology-orders.dto';

@Injectable()
export class TechnologyOrdersService {
  queryOrders(queryOrdersDto: QueryOrdersDto) {
    throw new Error('Method not implemented.');
  }
  getPrintData(params: any) {
    throw new Error('Method not implemented.');
  }
  updateExecuteStatus(updateExecuteStatusDto: UpdateExecuteStatusDto) {
    throw new Error('Method not implemented.');
  }
  getSignatureImage(usid: string) {
    throw new Error('Method not implemented.');
  }
  exportData(exportDataDto: ExportDataDto) {
    throw new Error('Method not implemented.');
  }
  getSystemConfig(hospitalId: string) {
    throw new Error('Method not implemented.');
  }
  getUserInfo() {
    throw new Error('Method not implemented.');
  }
}
