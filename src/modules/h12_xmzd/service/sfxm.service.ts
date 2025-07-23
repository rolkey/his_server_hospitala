import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ypzd } from '../entity/ypzd.entity';
import { Kcxx } from '../entity/kcxx.entity';
import { Xmzd } from '../entity/xmzd.entity';
import { SfxmQueryDto } from '../sfxm-query.dto';
import { ParamService } from './param.service';
import { SysparNew } from '../entity/__syspar_new.entity';

@Injectable()
export class SfxmService {
  constructor(
    private readonly paramService: ParamService,
    @InjectRepository(Ypzd)
    private readonly ypzdRepository: Repository<Ypzd>,
    @InjectRepository(Xmzd)
    private readonly sysparNewRepository: Repository<SysparNew>,
    @InjectRepository(Xmzd)
    private readonly xmzdRepository: Repository<Xmzd>,
  ) {}

  private async initParams(uKsid: string): Promise<{
    xyksid: string;
    cyksid: string;
    zyksid: string;
    clksid: string;
    qtksid: string;
    zjksid: string;
    ssclksid: string;
  }> {
    const [xyksid, cyksid, zyksid, clksid, qtksid, zjksid] = await Promise.all([
      this.paramService.gfGetPara(13, `xy${uKsid}`, '0603', `西药${uKsid}`),
      this.paramService.gfGetPara(13, `cy${uKsid}`, '0603', `成药${uKsid}`),
      this.paramService.gfGetPara(13, `zy${uKsid}`, '0604', `中药${uKsid}`),
      this.paramService.gfGetPara(13, `cl${uKsid}`, '0603', `材料${uKsid}`),
      this.paramService.gfGetPara(13, `qt${uKsid}`, '0603', `其他${uKsid}`),
      this.paramService.gfGetPara(13, `zj${uKsid}`, '0603', `针剂${uKsid}`),
    ]);

    const ssclksid = await this.paramService.gfGetPara(
      13,
      `sscl${uKsid}`,
      clksid,
      `手术材料${uKsid}`,
    );

    return { xyksid, cyksid, zyksid, clksid, qtksid, zjksid, ssclksid };
  }

  private async getSystemParam(paramName: string): Promise<string> {
    const ypzd = await this.sysparNewRepository.findOne({
      where: { syid: '30', prid: paramName.toUpperCase() },
    });
    return ypzd ? ypzd.pval : '0';
  }

  async h13_sfxm(query: SfxmQueryDto) {
    const params = await this.initParams(query.uKsid);
    const ls_cxsz = await this.getSystemParam('CKFYFS');

    // 创建药品查询
    const ypQuery = this.ypzdRepository
      .createQueryBuilder('yp')
      .innerJoin(
        Kcxx,
        'kc',
        'yp.ypid = kc.ypid AND kc.yxbz = 1 AND ' +
          `((yp.syplid IN ('3','1') AND kc.ksid IN (:...xyksid)) OR ` +
          `(yp.syplid = '2' AND kc.ksid IN (:...qtksid)) OR ` +
          `(yp.syplid IN ('4') AND kc.ksid IN (:...clksid)) OR ` +
          `(yp.syplid IN ('5') AND kc.ksid IN (:...zyksid)) OR ` +
          `(yp.syplid IN ('4') AND kc.ksid IN (:...ssclksid)) OR ` +
          `(yp.syplid IN ('7') AND kc.ksid IN (:...zjksid)) OR ` +
          `(yp.syplid IN ('9') AND kc.ksid IN (:...cyksid))) AND ` +
          `ISNULL(yp.bz1,'0') = '0' AND ` +
          `yp.jsl2 = 0 AND ` +
          `(yp.qt6 = 0 OR yp.qt6 = 2 OR yp.qt6 IS NULL)`,
        {
          xyksid: [params.xyksid],
          qtksid: [params.qtksid || ''],
          clksid: [params.clksid],
          zyksid: [params.zyksid],
          ssclksid: [params.ssclksid],
          zjksid: [params.zjksid],
          cyksid: [params.cyksid],
        },
      )
      .select([
        `(CASE WHEN yp.ypflid IN ('01','02','03','90','72') THEN 2 ELSE 3 END) as xmzl`,
        'yp.ypid as xmid',
        'yp.ypgg as ggxh',
        'ROUND(kc.pfjg/yp.ysxs, 4) as pfjg',
        'kc.cjid as cjid',
        'kc.scph as scph',
        'ROUND(kc.lsjg/yp.ysxs, 4) as sfdj',
        'yp.sjjl as jldw',
        'yp.zwmc as xmmc',
        'yp.szbm as szbm',
        'UPPER(yp.pybm) as pybm',
        'UPPER(yp.wbbm) as wbbm',
        'UPPER(yp.qtbm) as qtbm',
        `'' as tcid`,
        `'' as tcmc`,
        '1 as sfbz',
        `'1' as fybz`,
        'yp.ypflid as fylbid',
        `'' as bzxx`,
        `(CASE WHEN yp.abcfl=0 OR LEN(yp.abcfl)=2 THEN CONVERT(varchar(12),yp.abcfl) ELSE '0' + CONVERT(varchar(10),yp.abcfl) END) as ybfl`,
        'yp.ybfl as nhfl',
        'yp.zzbz as zzfl',
        'yp.zwmc as spmc',
        'kc.gsid as ghid',
        'kc.ksid as ksid',
        'yp.jsl1 as psbz',
        'yp.cfqj as ksbz',
        '0 as qtbz',
        'yp.hldw as hldw',
        'yp.hlxs as hlxs',
        'yp.ypflbm as ypflbm',
        'yp.ysxs as ysxs',
        'yp.fylbid as tjfl',
        'yp.syplid as zflx',
        'yp.pwjj as pwjj',
        "ISNULL(yp.syffid, '') as syffid",
        `(SELECT SUM(kc2.xsl - ISNULL(kc2.dfsl,0) - ISNULL(kc2.mzdfsl,0) - ISNULL(kc2.ssdfsl,0))
          FROM h31_kcxx kc2
          WHERE kc2.ksid=kc.ksid AND kc2.ypid=kc.ypid) as kcsl`,
        'kc.scpc as scpc',
        'ISNULL(kc.mzdfsl,0) as mzsl',
        'ISNULL(kc.dfsl,0) as zysl',
        `'' as bz2`,
        `'' as bz3`,
        `'' as bz4`,
        `'' as bz5`,
        'kc.sxrq as sxrq',
        'yp.gjybbm as bz6',
        'yp.zysx as bz7',
        'yp.gjybmc as bz9',
        `'' as bz10`,
        `'' as bz11`,
        `'' as bz12`,
        'yp.qt7 as zbbz',
      ]);

    if (ls_cxsz === '0') {
      ypQuery.andWhere(
        `kc.scph = (SELECT MIN(kc3.scph) FROM h31_kcxx kc3
          WHERE kc3.ypid=kc.ypid AND
          kc3.ksid=kc.ksid AND
          kc3.xsl - ABS(ISNULL(kc3.mzdfsl,0)+ISNULL(kc3.dfsl,0)+ISNULL(kc3.ssdfsl,0)) >0 AND kc3.yxbz=1)`,
      );
    } else if (ls_cxsz === '1') {
      ypQuery.andWhere(
        `kc.scph = (SELECT MIN(kc3.scph) FROM h31_kcxx kc3
          WHERE kc3.ypid=kc.ypid AND
          kc3.ksid=kc.ksid AND
          kc3.xsl - ABS(ISNULL(kc3.mzdfsl,0)+ISNULL(kc3.dfsl,0)+ISNULL(kc3.ssdfsl,0)) >0 AND kc3.yxbz=1 AND
          kc3.sxrq = (SELECT MIN(sxrq) FROM h31_kcxx kc4
            WHERE kc4.ypid=kc.ypid AND
            kc4.ksid=kc.ksid AND
            kc4.xsl - ABS(ISNULL(kc4.mzdfsl,0)+ISNULL(kc4.dfsl,0)+ISNULL(kc4.ssdfsl,0)) >0 AND kc4.yxbz=1))`,
      );
    } else {
      ypQuery.andWhere(`yp.ypfl = '17'`);
    }

    // 创建项目查询（当bz=1时）
    let unionQuery = ypQuery.getQuery();
    const ypParameters = ypQuery.getParameters();

    if (query.bz === 1) {
      const xmQuery = this.xmzdRepository
        .createQueryBuilder('xm')
        .where('xm.yxbz = 1')
        .andWhere('(xm.xmzl = 1 OR (xm.xmzl = 3 AND xm.dwjb = 1))')
        .andWhere("(ISNULL(xm.htzfblid, '') = '' OR xm.htzfblid = '2')")
        .select([
          'xm.xmzl as xmzl',
          'xm.xmid as xmid',
          'xm.ggxh as ggxh',
          'xm.pfjg as pfjg',
          'xm.cjid as cjid',
          'xm.scph as scph',
          'xm.sfdj as sfdj',
          'xm.jldw as jldw',
          'xm.xmmc as xmmc',
          'xm.szbm as szbm',
          'UPPER(xm.pybm) as pybm',
          'UPPER(xm.wbbm) as wbbm',
          'UPPER(xm.qtbm) as qtbm',
          'xm.tcid as tcid',
          'xm.tcmc as tcmc',
          'xm.sfbz as sfbz',
          'xm.fybz as fybz',
          'xm.fylbid as fylbid',
          'xm.bzxx as bzxx',
          'xm.zflx as ybfl',
          'xm.ypfl as nhfl',
          '1 as zzfl',
          'xm.xmmc as spmc',
          `'' as ghid`,
          'xm.tczfblid as ksid',
          '0 as psbz',
          `'' as ksbz`,
          '0 as qtbz',
          'LEFT(xm.sfdw, 4) as hldw',
          '1 as hlxs',
          `'' as ypflbm`,
          '1 as ysxs',
          `'' as tjfl`,
          `'' as zflx`,
          '0 as pwjj',
          `'' as syffid`,
          '0 as kcsl',
          `'' as scpc`,
          '0 as mzsl',
          '0 as zysl',
          'xm.tczfblid as bz2',
          'xm.sgfzfblid as bz3',
          'xm.qgfzfblid as bz4',
          'xm.cwflid as bz5',
          'NULL as sxrq',
          'xm.gjybbm as bz6',
          'xm.sm as bz7',
          'xm.gjybmc as bz9',
          `'' as bz10`,
          `'' as bz11`,
          `'' as bz12`,
          '0 as zbbz',
        ]);

      const xmQueryString = xmQuery.getQuery();
      unionQuery = `(${unionQuery}) UNION ALL (${xmQueryString})`;
    }

    // 获取总数
    const countQuery = `SELECT COUNT(*) as total FROM (${unionQuery}) as union_table`;
    const totalResult = await this.ypzdRepository.query(countQuery, Object.values(ypParameters));
    const total = parseInt(totalResult[0].total, 10);

    // 分页查询
    const pageSize = query.pageSize || 10;
    const pageNo = query.pageNo || 1;
    const offset = (pageNo - 1) * pageSize;

    const resultQuery = `
      SELECT * FROM (${unionQuery}) as union_table
      ORDER BY xmmc
      OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
    `;

    const pageData = await this.ypzdRepository.query(resultQuery, Object.values(ypParameters));

    return { pageData, total };
  }
}
