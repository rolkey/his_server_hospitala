import { Injectable } from '@nestjs/common';
import {
  ExportDataDto,
  OrderResultDto,
  QueryExecutionDetailsDto,
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
        h12_yzxb.yzlx,
        uc.unam as ksysxm
      FROM h11_brxx
      JOIN h12_yzxb ON h11_brxx.zyid = h12_yzxb.zyid
      LEFT JOIN __usrcat uc ON uc.usid = h12_yzxb.ksys
      WHERE h11_brxx.zyid = @0
        AND h12_yzxb.sjbz <> 0
        AND ((h12_yzxb.ysbz = 1 AND h12_yzxb.tjbz = 1) OR (h12_yzxb.ysbz = 0 AND h12_yzxb.tjbz = 0))
        AND h12_yzxb.fylbid IN (${fylbidParams.map((item) => `'${item}'`).join(',')})
        AND h12_yzxb.yzrq >= @1
        AND h12_yzxb.yzrq <= @2
    `;

    // 构建参数对象
    const params: any = [zyid, startDate, endDate];

    return await this.dataSource.query(query, params);
  }

  /**
   * 中医操作单独执行
   * @param queryDto
   * @returns
   */
  async queryExecutionDetails(queryDto: QueryExecutionDetailsDto): Promise<any[]> {
    const { zyid, fylbid } = queryDto;

    // 处理数组参数
    const fylbidParams = Array.isArray(fylbid) ? fylbid : [fylbid];

    const query = `
      SELECT
        h12_yzxb.zyid,
        h12_yzxb.yzlx,
        h12_yzxb.yzxh,
        h12_yzxb.mxxh,
        h12_yzxb.xmid,
        h12_yzxb.xmmc,
        ((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.jfyl * h13_yzzxcs.kyts) as jfyl,
        h12_yzxb.ksys,
        h12_yzxb.kssxys,
        h12_yzxb.xmdj,
        h12_yzxb.xmdw,
        h12_yzxb.xmgg,
        h12_yzxb.yzzh,
        h12_yzxb.zyid,
        h13_yzzxcs.clbz,
        h12_yzxb.ksid,
        0 as szbz,
        h12_yzxb.bzxx,
        h12_yzxb.zxhs,
        h12_yzxb.zxsj,
        h12_yzxb.cjid,
        h13_yzzxcs.maxid,
        h13_yzzxcs.yjry,
        h13_yzzxcs.yjrq,
        h13_yzzxcs.zxrq
      FROM h12_yzxb
      JOIN h13_yzzxcs ON h12_yzxb.zyid = h13_yzzxcs.zyid
        AND h12_yzxb.yzlx = h13_yzzxcs.yzlx
        AND h12_yzxb.mxxh = h13_yzzxcs.mxxh
        AND h12_yzxb.yzxh = h13_yzzxcs.yzxh
      WHERE h12_yzxb.zyid = @0
        AND h12_yzxb.fylbid IN (${fylbidParams.map((item) => `'${item}'`).join(',')})
        AND (h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) > 0
        AND h12_yzxb.xmzl = 1
    `;

    const params: any = [zyid];

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
