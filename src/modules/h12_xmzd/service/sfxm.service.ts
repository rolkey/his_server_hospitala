import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SfxmQueryDto } from '../dto/sfxm-query.dto';
import { ConfigReaderService } from './config-reader.service';
import { TempSfxm } from '../entity/temp-sfxm.entity';
import { SysparNew } from '../entity/__syspar_new.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SfxmService {
  constructor(
    @InjectRepository(TempSfxm)
    private readonly tempSfxmRepository: Repository<TempSfxm>,
    @InjectRepository(SysparNew)
    private readonly sysparNewRepository: Repository<SysparNew>,
    private readonly configReaderService: ConfigReaderService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  private async getSystemParam(paramName: string): Promise<string> {
    const ypzd = await this.sysparNewRepository.findOne({
      where: { syid: '30', prid: paramName.toUpperCase() },
    });
    return ypzd ? ypzd.pval : '0';
  }

  buildArrayString(array: string[]): string {
    return array.length > 0 ? `'${array.join("','")}'` : '';
  }

  async getSfxmData(query: SfxmQueryDto) {
    const params = await this.configReaderService.getKsids(query.uKsid);
    const ls_cxsz = await this.getSystemParam('CKFYFS');

    const offset = (query.pageNo - 1) * (query.pageSize || 10);
    const pageSize = query.pageSize || 10;

    const dataQuery = this.buildDataQuery(params, ls_cxsz, query, offset, pageSize);
    const countQuery = this.buildCountQuery(params, ls_cxsz, query);

    const [pageData, total] = await Promise.all([
      this.tempSfxmRepository.query(dataQuery),
      this.tempSfxmRepository.query(countQuery),
    ]);

    return {
      pageData,
      total: total[0].count, // 假设总数的返回字段为 count
    };
  }

  private buildDataQuery(
    params,
    ls_cxsz: string,
    query: SfxmQueryDto,
    offset: number,
    pageSize: number,
  ): string {
    if (query.bz === 1) {
      return `
        SELECT
          h00_xmzd.xmzl,
          h00_xmzd.xmid,
          h00_xmzd.ggxh,
          h00_xmzd.pfjg,
          h00_xmzd.cjid,
          h00_xmzd.scph,
          h00_xmzd.sfdj,
          h00_xmzd.jldw,
          h00_xmzd.xmmc,
          h00_xmzd.szbm,
          UPPER(h00_xmzd.pybm) AS pybm,
          UPPER(h00_xmzd.wbbm) AS wbbm,
          UPPER(h00_xmzd.qtbm) AS qtbm,
          h00_xmzd.tcid,
          h00_xmzd.tcmc,
          h00_xmzd.sfbz,
          h00_xmzd.fybz,
          h00_xmzd.fylbid,
          h00_xmzd.bzxx,
          h00_xmzd.zflx,
          h00_xmzd.ypfl,
          1 AS psbz,
          NULL AS hldw,
          NULL AS hlxs,
          NULL AS ypflbm,
          NULL AS ysxs,
          NULL AS fylbid,
          NULL AS syplid,
          NULL AS pwjj,
          ISNULL(h00_xmzd.syffid, '') AS syffid,
          (SELECT SUM(kc.xsl - ISNULL(kc.dfsl, 0) - ISNULL(kc.mzdfsl, 0) - ISNULL(kc.ssdfsl, 0))
           FROM h31_kcxx kc
           WHERE kc.ksid = h31_kcxx.ksid AND kc.ypid = h31_kcxx.ypid) AS kcsl,
          h31_kcxx.scpc,
          ISNULL(h31_kcxx.mzdfsl, 0) AS mzsl,
          ISNULL(h31_kcxx.dfsl, 0) AS zysl
        FROM
          h00_xmzd
        WHERE
          h00_xmzd.yxbz = 1
          AND ((h00_xmzd.xmzl = 1) OR (h00_xmzd.xmzl = 3 AND h00_xmzd.dwjb = 1))
          AND (ISNULL(h00_xmzd.htzfblid, '') = '' OR h00_xmzd.htzfblid = '2')
        ORDER BY h00_xmzd.scph
        OFFSET ${offset} ROWS
        FETCH NEXT ${pageSize} ROWS ONLY;
      `;
    }

    // 处理 bz != 1 的情况
    return `
      SELECT *
      FROM (
        SELECT DISTINCT
          CASE WHEN h30_ypzd.ypflid IN ('01', '02', '03', '90', '72') THEN 2 ELSE 3 END AS xmzl,
          h30_ypzd.ypid,
          h30_ypzd.ypgg,
          ROUND(h31_kcxx.pfjg / h30_ypzd.ysxs, 4) AS pfjg,
          h31_kcxx.cjid,
          h31_kcxx.scph,
          ROUND(h31_kcxx.lsjg / h30_ypzd.ysxs, 4) AS sfdj,
          h30_ypzd.sjjl,
          h30_ypzd.zwmc,
          h30_ypzd.szbm,
          UPPER(h30_ypzd.pybm) AS pybm,
          UPPER(h30_ypzd.wbbm) AS wbbm,
          UPPER(h30_ypzd.qtbm) AS qtbm,
          h31_kcxx.gsid,
          h31_kcxx.ksid,
          h30_ypzd.jsl1,
          h30_ypzd.cfqj,
          0 AS psbz,
          h30_ypzd.hldw,
          h30_ypzd.hlxs,
          h30_ypzd.ypflbm,
          h30_ypzd.ysxs,
          h30_ypzd.fylbid,
          h30_ypzd.syplid,
          h30_ypzd.pwjj,
          ISNULL(h30_ypzd.syffid, '') AS syffid,
          (SELECT SUM(kc.xsl - ISNULL(kc.dfsl, 0) - ISNULL(kc.mzdfsl, 0) - ISNULL(kc.ssdfsl, 0))
           FROM h31_kcxx kc
           WHERE kc.ksid = h31_kcxx.ksid AND kc.ypid = h31_kcxx.ypid) AS kcsl,
          h31_kcxx.scpc,
          ISNULL(h31_kcxx.mzdfsl, 0) AS mzsl,
          ISNULL(h31_kcxx.dfsl, 0) AS zysl
        FROM
          h30_ypzd, h31_kcxx
        WHERE
          h30_ypzd.ypid = h31_kcxx.ypid
          AND h31_kcxx.yxbz = 1
          AND (
            (h30_ypzd.syplid IN ('3', '1') AND h31_kcxx.ksid IN (${this.buildArrayString([params.xyksid, params.cyksid])}))
            OR (h30_ypzd.syplid = '2' AND h31_kcxx.ksid IN (${this.buildArrayString([params.qtksid])}))
            OR (h30_ypzd.syplid IN ('4') AND h31_kcxx.ksid IN (${this.buildArrayString([params.clksid])}))
            OR (h30_ypzd.syplid IN ('5') AND h31_kcxx.ksid IN (${this.buildArrayString([params.zyksid])}))
          )
          AND ISNULL(h30_ypzd.bz1, '0') = '0'
          AND h30_ypzd.jsl2 = 0
          AND (h30_ypzd.qt6 = 0 OR h30_ypzd.qt6 = 2 OR h30_ypzd.qt6 IS NULL)
          AND (
            (${ls_cxsz} = '0' AND h31_kcxx.scph = (SELECT MIN(kc.scph)
                                                    FROM h31_kcxx kc
                                                    WHERE kc.ypid = h31_kcxx.ypid
                                                    AND kc.ksid = h31_kcxx.ksid
                                                    AND kc.xsl - ABS(ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0)) > 0
                                                    AND kc.yxbz = 1))
            OR (${ls_cxsz} = '1' AND h31_kcxx.scph = (SELECT MIN(kc.scph)
                                                      FROM h31_kcxx kc
                                                      WHERE kc.ypid = h31_kcxx.ypid
                                                      AND kc.ksid = h31_kcxx.ksid
                                                      AND kc.xsl - ABS(ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0)) > 0
                                                      AND kc.yxbz = 1
                                                      AND kc.sxrq = (SELECT MIN(sxrq)
                                                                     FROM h31_kcxx kc1
                                                                     WHERE kc1.ypid = h31_kcxx.ypid
                                                                     AND kc1.ksid = h31_kcxx.ksid
                                                                     AND kc1.xsl - ABS(ISNULL(kc1.mzdfsl, 0) + ISNULL(kc1.dfsl, 0) + ISNULL(kc1.ssdfsl, 0)) > 0
                                                                     AND kc1.yxbz = 1)))
          )
      ) AS result
      ORDER BY result.scph
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY;
    `;
  }

  private buildCountQuery(params, ls_cxsz: string, query: SfxmQueryDto): string {
    if (query.bz === 1) {
      return `
        SELECT COUNT(*) AS count
        FROM h00_xmzd
        WHERE yxbz = 1
          AND (
            (xmzl = 1) OR (xmzl = 3 AND dwjb = 1)
          )
          AND (ISNULL(htzfblid, '') = '' OR htzfblid = '2');
      `;
    }

    return `
      SELECT COUNT(*) AS count
      FROM (
        SELECT DISTINCT
          CASE WHEN h30_ypzd.ypflid IN ('01', '02', '03', '90', '72') THEN 2 ELSE 3 END AS xmzl,
          h30_ypzd.ypid
        FROM
          h30_ypzd, h31_kcxx
        WHERE
          h30_ypzd.ypid = h31_kcxx.ypid
          AND h31_kcxx.yxbz = 1
          AND (
            (h30_ypzd.syplid IN ('3', '1') AND h31_kcxx.ksid IN (${this.buildArrayString([params.xyksid, params.cyksid])}))
            OR (h30_ypzd.syplid = '2' AND h31_kcxx.ksid IN (${this.buildArrayString([params.qtksid])}))
            OR (h30_ypzd.syplid IN ('4') AND h31_kcxx.ksid IN (${this.buildArrayString([params.clksid])}))
            OR (h30_ypzd.syplid IN ('5') AND h31_kcxx.ksid IN (${this.buildArrayString([params.zyksid])}))
          )
          AND ISNULL(h30_ypzd.bz1, '0') = '0'
          AND h30_ypzd.jsl2 = 0
          AND (h30_ypzd.qt6 = 0 OR h30_ypzd.qt6 = 2 OR h30_ypzd.qt6 IS NULL)
          AND (
            (${ls_cxsz} = '0' AND h31_kcxx.scph = (SELECT MIN(kc.scph)
                                                    FROM h31_kcxx kc
                                                    WHERE kc.ypid = h31_kcxx.ypid
                                                    AND kc.ksid = h31_kcxx.ksid
                                                    AND kc.xsl - ABS(ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0)) > 0
                                                    AND kc.yxbz = 1))
            OR (${ls_cxsz} = '1' AND h31_kcxx.scph = (SELECT MIN(kc.scph)
                                                      FROM h31_kcxx kc
                                                      WHERE kc.ypid = h31_kcxx.ypid
                                                      AND kc.ksid = h31_kcxx.ksid
                                                      AND kc.xsl - ABS(ISNULL(mzdfsl, 0) + ISNULL(dfsl, 0) + ISNULL(ssdfsl, 0)) > 0
                                                      AND kc.yxbz = 1
                                                      AND kc.sxrq = (SELECT MIN(sxrq)
                                                                     FROM h31_kcxx kc1
                                                                     WHERE kc1.ypid = h31_kcxx.ypid
                                                                     AND kc1.ksid = h31_kcxx.ksid
                                                                     AND kc1.xsl - ABS(ISNULL(kc1.mzdfsl, 0) + ISNULL(kc1.dfsl, 0) + ISNULL(kc1.ssdfsl, 0)) > 0
                                                                     AND kc1.yxbz = 1)))
          )
      ) AS totalCount;
    `;
  }

  async querySfxm(params: {
    xmzl?: string;
    fylbid?: string;
    value?: string;
    pageNo: number;
    pageSize: number;
    ksid: string;
    ksid1: string;
    ksid2: string;
    ksid3: string;
    ksid4: string;
    ksid5?: string;
    ksid6?: string;
    ksid7?: string;
    ksid8?: string;
  }): Promise<any> {
    const upcaseValue = params.value?.toUpperCase();
    const whereClause = upcaseValue
      ? ` WHERE ypid LIKE '%${upcaseValue}%' or xmmc LIKE '%${upcaseValue}%' or pybm LIKE '%${upcaseValue}%' or wbbm LIKE '%${upcaseValue}%'`
      : '';

    const result = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM dbo.fn_h22_sfxm_xmlr_kcgl_newtcksid_scph_sxrq_bzfl_ksid_wdf(
          @0, @1, @2, @3, @4, @5, @6, @7, @8
        ) as fymx ${whereClause}`,
      [
        params.ksid,
        params.ksid1,
        params.ksid2,
        params.ksid3,
        params.ksid4,
        params.ksid5,
        params.ksid6,
        params.ksid7,
        params.ksid8,
      ],
    );

    const offset = (params.pageNo - 1) * params.pageSize;
    const pageData = await this.dataSource.query(
      `SELECT * FROM dbo.fn_h22_sfxm_xmlr_kcgl_newtcksid_scph_sxrq_bzfl_ksid_wdf(
            @0, @1, @2, @3, @4, @5, @6, @7, @8
        )
        ${whereClause}
        ORDER BY (SELECT NULL) OFFSET ${offset} ROWS FETCH NEXT ${params.pageSize} ROWS ONLY`,
      [
        params.ksid,
        params.ksid1,
        params.ksid2,
        params.ksid3,
        params.ksid4,
        params.ksid5,
        params.ksid6,
        params.ksid7,
        params.ksid8,
      ],
    );

    return {
      total: result[0].total,
      pageData,
    };
  }
}
