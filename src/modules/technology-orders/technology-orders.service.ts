import { Injectable } from '@nestjs/common';
import {
  ExportDataDto,
  OrderResultDto,
  QueryOrdersDto,
  UpdateExecuteStatusDto,
} from './technology-orders.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { decodeSQLs } from '@/utils/sql-utils';

@Injectable()
export class TechnologyOrdersService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async queryOrders(queryOrdersDto: QueryOrdersDto): Promise<OrderResultDto[]> {
    const { zyid, types, startDate, endDate } = queryOrdersDto;

    // 处理数组参数
    const fylbidParams = Array.isArray(types) ? types : [types];

    const query = `
      SELECT
        h11_brxx.zyid,
        h11_brxx.zybh,
        h11_brxx.brxm,
        h12_yzxb.ksys as ysid,
        h12_yzxb.xmid,
        h12_yzxb.xmmc,
        1 as zt,
        h12_yzxb.yzrq,
        '' as sflbdh,
        h12_yzxb.bzxx,
        h12_yzxb.mxxh,
        h12_yzxb.yzlx
      FROM h11_brxx
      JOIN h12_yzxb ON h11_brxx.zyid = h12_yzxb.zyid
      WHERE h11_brxx.zyid = @0
        AND h12_yzxb.sjbz <> 0
        AND ((h12_yzxb.ysbz = 1 AND h12_yzxb.tjbz = 1) OR (h12_yzxb.ysbz = 0 AND h12_yzxb.tjbz = 0))
        AND h12_yzxb.fylbid IN (${fylbidParams.map((item) => `'${item}'`).join(',')})
        AND h12_yzxb.yzrq >= @1
        AND h12_yzxb.yzrq <= @2
    `;

    // 构建参数对象
    const params: any = [zyid, startDate, endDate];

    console.log(decodeSQLs(query, params));

    return await this.dataSource.query(query, params);
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
