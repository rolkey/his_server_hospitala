import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { h11_brxx } from './h11_brxx.entity';
import dayjs = require('dayjs');
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_zybhService } from '../h11_zybh/h11_zybh.service';
import { h00_fylbService } from '../h00_fylb/h00_fylb.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { N0422 } from '../n04_22/n04_22.entity';
import { N04_23 } from '../n04-23/n04-23.entity';

interface Diags {
  n0422s: N0422[];
  n0423s: N04_23[];
}

@Injectable()
export class h11_brxxService_new {

  constructor(
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
    @InjectRepository(N0422)
    private readonly n0422Repository: Repository<N0422>,
    @InjectRepository(N04_23)
    private readonly n0423Repository: Repository<N04_23>,
    private readonly h11_lshService: h11_lshService,
    private readonly h11_zybhService: h11_zybhService,
    private readonly h00_fylbService: h00_fylbService,
    private readonly paramService: ParamService,
    private dataSource: DataSource,
  ) { }

  async updateBedAllocation(data: {
    cwid: string;
    cwidOld: string;
    zyid: string;
    cwmc: string;
    ksid: string;
    userId: string;
    userName: string;
  }) {
    const lrsj = new Date();
    const { cwid, cwidOld, zyid, cwmc, ksid, userId, userName } = data;
    const ls_cwfpxx = `护士"${userName}"在${dayjs(lrsj).format('yyyy.mm.dd hh:mm')}分配`;

    await this.dataSource.transaction(async (manager) => {
      try {
        // 更新床位提示
        await manager.query(`UPDATE h11_jshztzd1 SET cycw = @0 WHERE zyid = @1`, [cwmc, zyid]);

        // 更新病人信息
        await manager.query(
          `UPDATE h11_brxx SET rycw = @0, cycw = @0, zyzt = 2
         WHERE (zyid = @1 OR mmlsh = @1) AND cyksid = @2`,
          [cwid, zyid, ksid],
        );

        // 更新医嘱表
        await manager.query(
          `UPDATE h12_yzzb SET cwid = @0
         WHERE zyid IN (SELECT zyid FROM h11_brxx WHERE zyid = @1 OR mmlsh = @1)`,
          [cwid, zyid],
        );

        // 释放旧床位
        await manager.query(
          `UPDATE h13_cwsyxx SET cwzt = 1, zyid = '', lryid = '', lrsj = '', cwfpxx = ''
         WHERE cwid = @0`,
          [cwidOld],
        );

        // 分配新床位
        await manager.query(
          `UPDATE h13_cwsyxx SET cwzt = 4, zyid = @0, lryid = @1, lrsj = @2, cwfpxx = @3
         WHERE cwid = @4`,
          [zyid, userId, lrsj, ls_cwfpxx, cwid],
        );
      } catch (error) {
        throw new CustomException(ERR.ERR_40103, '床位分配失败');
      }
    });
  }

  /**
   * 获取未结算费用
   */
  async getUnSettleFee(zyid: string) {
    const [yzList, ssList, fymxList] = await Promise.all([
      this.getYzExecuteList(zyid),
      this.getSsList(zyid),
      this.getFymxList(zyid),
    ])

    const fymxMap = new Map<string, any>(
      fymxList.map((item) => [item.feedetl_sn, item] as [string, any]),
    )

    const yzResult = this.buildYzResult(yzList, fymxMap);
    const ssResult = this.buildSsResult(ssList, fymxMap);

    return [...yzResult, ...ssResult];
  }
  /**
   * 查询医嘱执行原始数据
   */

  async getYzExecuteList(zyid: string) {
    return this.dataSource
      .createQueryBuilder()
      .from('h13_yzzxcs', 'zx')
      .innerJoin(
        'h12_yzxb',
        'yz',
        `
        zx.zyid = yz.zyid
        AND zx.yzlx = yz.yzlx
        AND zx.yzxh = yz.yzxh
        AND zx.mxxh = yz.mxxh
        `,
      )
      .leftJoin('h00_fylb', 'fylb', 'zx.fylbid = fylb.fylbid')
      .leftJoin('h30_ypzd', 'yp', 'zx.xmid = yp.ypid')
      .leftJoin('h00_xmzd', 'xmzd', 'xmzd.xmid = zx.xmid')
      .leftJoin('G00_dyzd', 'dyzd', 'dyzd.xmid = zx.xmid')
      .select([
        'yz.yzlx as yzlx',
        'yz.yzxh as yzxh',
        'yz.mxxh as mxxh',
        'yz.xmmc as xmmc',
        'yz.xmgg as xmgg',
        'yz.jldw as jldw',
        'yz.fylbid as yz_fylbid',
        'yz.syffid as syffid',
        'yz.syplid as syplid',
        'yz.yzrq as yzrq',
        'yz.xmdw as xmdw',
        'yz.ybbz as ybbz',
        'yz.bzxx as bzxx',
        'yz.xmzl as xmzl',

        'zx.xmid as xmid',
        'zx.jfyl as jfyl',
        'zx.zxcs as zxcs',
        'zx.bzxcs as bzxcs',
        'zx.kyts as kyts',
        'zx.xmdj as xmdj',
        'zx.zyid as zyid',
        'zx.maxid as maxid',
        'zx.zxrq as zxrq',
        'zx.xnhbz as xnhbz',
        'zx.fylbid as zx_fylbid',

        'yp.qt3 as qt3',
        'yp.qt8 as qt8',
        'yp.gjybbm as yp_gjybbm',
        'yp.gjybmc as yp_gjybmc',

        'dyzd.gjybbm as dyzd_gjybbm',
        'dyzd.gjybmc as dyzd_gjybmc',

        'xmzd.gjybbm as xmzd_gjybbm',
        'xmzd.gjybmc as xmzd_gjybmc',

        'fylb.fylbmc as fylbmc',

        'zx.maxid as bz1',
        'zx.xmid as bz2',
        'yz.ybbz as bz3',
      ])
      .where('yz.zyid = :zyid', { zyid })
      .andWhere('zx.xmdj > 0')
      .andWhere('zx.jfyl > 0')
      .andWhere('(zx.zxcs - zx.bzxcs) <> 0')
      .andWhere('zx.jsbz = 0')
      .andWhere('COALESCE(zx.xnhbz,0) = 0')
      .andWhere('zx.sfbz = 1')
      .getRawMany();
  }

  /**
   * 查询手术原始数据
   */
  async getSsList(zyid: string) {
    return this.dataSource
      .createQueryBuilder()
      .from('h15_ssxb', 'ss')
      .leftJoin('h00_fylb', 'fylb', 'ss.fylbid = fylb.fylbid')
      .leftJoin('h30_ypzd', 'yp', 'ss.xmid = yp.ypid')
      .leftJoin('h00_xmzd', 'xmzd', 'xmzd.xmid = ss.xmid')
      .leftJoin('G00_dyzd', 'dyzd', 'dyzd.xmid = ss.xmid')
      .select([
        'ss.xmid as xmid',
        'ss.xmmc as xmmc',
        'ss.xmgg as xmgg',
        'ss.xmdw as xmdw',
        'ss.jfyl as jfyl',
        'ss.xmdj as xmdj',
        'ss.zyid as zyid',
        'ss.fylbid as fylbid',
        'ss.maxid as maxid',
        'ss.ssrq as ssrq',
        'ss.xnhbz as xnhbz',
        'ss.ybbz as ybbz',
        'ss.xmzl as xmzl',

        'yp.qt3 as qt3',
        'yp.qt8 as qt8',
        'yp.gjybbm as yp_gjybbm',
        'yp.gjybmc as yp_gjybmc',

        'dyzd.gjybbm as dyzd_gjybbm',
        'dyzd.gjybmc as dyzd_gjybmc',

        'xmzd.gjybbm as xmzd_gjybbm',
        'xmzd.gjybmc as xmzd_gjybmc',

        'fylb.fylbmc as fylbmc',

        'ss.maxid as bz1',
        'ss.xmid as bz2',
        'ss.ybbz as bz3',
      ])
      .where('ss.zyid = :zyid', { zyid })
      .andWhere('ss.jsbz = 0')
      .andWhere('ss.xmdj > 0')
      .andWhere('COALESCE(ss.xnhbz,0) = 0')
      .andWhere('ss.jfyl <> 0')
      .getRawMany();
  }

  async getFymxList(zyid: string) {
    return this.dataSource
      .createQueryBuilder()
      .from('G60_fymx', 'fymx')
      .select([
        'fymx.lsh as lsh',
        'fymx.mxxh as mxxh',
        'fymx.lshxh as lshxh',
        'fymx.setl_id as setl_id',
        'fymx.feedetl_sn as feedetl_sn',
        'fymx.det_item_fee_sumamt as det_item_fee_sumamt',
        'fymx.cnt as cnt',
        'fymx.pric as pric',
        'fymx.pric_uplmt_amt as pric_uplmt_amt',
        'fymx.selfpay_prop as selfpay_prop',
        'fymx.fulamt_ownpay_amt as fulamt_ownpay_amt',
        'fymx.overlmt_amt as overlmt_amt',
        'fymx.preselfpay_amt as preselfpay_amt',
        'fymx.inscp_scp_amt as inscp_scp_amt',
        'fymx.chrgitm_lv as chrgitm_lv',
        'fymx.med_chrgitm_type as med_chrgitm_type',
      ])
      .where('fymx.lsh = :zyid', { zyid })
      .getRawMany();
  }
  /**
   * 医嘱费用组装
   */

  private buildYzResult(list: any[], fymxMap: Map<string, any>) {
    const map = new Map();

    for (const r of list) {
      const sl = Number(r.jfyl) * (Number(r.zxcs) - Number(r.bzxcs)) * Number(r.kyts);

      const je = this.safeMoney(sl * Number(r.xmdj));

      const key = [r.zyid, r.yzlx, r.maxid].join('_');

      if (!map.has(key)) {
        map.set(key, {
          lx: r.yzlx,
          xh: r.yzxh,
          mxxh: r.mxxh,
          xmid: r.xmid,
          xmmc: r.xmmc,
          xmgg: r.xmgg,
          jldw: r.jldw,
          sl: 0,
          xmdj: Number(r.xmdj),
          je: 0,
          zyid: r.zyid,
          ybid: '',
          kyts: r.kyts || '',
          fylbid: r.yz_fylbid,
          syffid: r.syffid,
          syplid: r.syplid,
          maxid: r.maxid,
          yzrq: dayjs(r.yzrq).format('YYYY-MM-DD HH:mm:ss'),
          jb: '',
          zflx: '',
          zfje: 0,
          czfje: 0,
          yzlx: r.yzlx === 1 || r.yzlx === 5 ? '1' : '2',
          zxrq: dayjs(r.zxrq).format('YYYY-MM-DD HH:mm:ss'),
          xnhbz: r.xnhbz ?? 0,
          xmdw: r.xmdw,
          mxid: 'Y' + r.maxid,
          ybbz: r.ybbz,
          cydy: r.bzxx?.includes('出院') ? 1 : 0,
          ypsl: 0,
          clsl: 0,
          fylbmc: r.fylbmc,
          gjybbm: r.dyzd_gjybbm ? r.dyzd_gjybbm : (r.xmzd_gjybbm ?? r.yp_gjybbm),
          gjybmc: r.dyzd_gjybmc ? r.dyzd_gjybmc : (r.xmzd_gjybmc ?? r.yp_gjybmc),
          inscp_scp_amt: fymxMap.get(`Y${r.maxid}`)?.inscp_scp_amt,
          fulamt_ownpay_amt: fymxMap.get(`Y${r.maxid}`)?.fulamt_ownpay_amt,
          overlmt_amt: fymxMap.get(`Y${r.maxid}`)?.overlmt_amt,

          bz1: String(r.bz1),
          bz2: r.bz2,
          bz3: String(r.bz3),
        });
      }

      const row = map.get(key);

      row.sl += sl;
      row.je = this.safeMoney(row.je + je);

      row.ypsl += this.calcYpsl(r, sl);
      row.clsl += this.calcClsl(r, sl);
    }

    return Array.from(map.values());
  }

  /**
   * 手术费用组装
   */

  private buildSsResult(list: any[], fymxMap: Map<string, any>) {
    const map = new Map();

    for (const r of list) {
      const sl = Number(r.jfyl);
      const je = this.safeMoney(sl * Number(r.xmdj));

      const key = [r.zyid, r.xmid, r.maxid].join('_');

      if (!map.has(key)) {
        map.set(key, {
          lx: 10,
          xh: 0,
          mxxh: 0,
          xmid: r.xmid,
          xmmc: r.xmmc,
          xmgg: r.xmgg,
          jldw: r.xmdw,
          sl: 0,
          xmdj: Number(r.xmdj),
          je: 0,
          zyid: r.zyid,
          kyts: r.kyts || '',
          ybid: '',
          fylbid: r.fylbid,
          syffid: '',
          syplid: 'QD',
          maxid: r.maxid,
          yzrq: dayjs(r.ssrq).format('YYYY-MM-DD HH:mm:ss'),
          jb: '',
          zflx: '',
          zfje: 0,
          czfje: 0,
          yzlx: '10',
          zxrq: dayjs(r.ssrq).format('YYYY-MM-DD HH:mm:ss'),
          xnhbz: r.xnhbz ?? 0,
          xmdw: r.xmdw,
          mxid: 'S' + r.maxid,
          ybbz: r.ybbz,
          cydy: 0,
          ypsl: 0,
          clsl: 0,
          fylbmc: r.fylbmc,
          gjybbm: r.dyzd_gjybbm ? r.dyzd_gjybbm : (r.xmzd_gjybbm ?? r.yp_gjybbm),
          gjybmc: r.dyzd_gjybmc ? r.dyzd_gjybmc : (r.xmzd_gjybmc ?? r.yp_gjybmc),
          inscp_scp_amt: fymxMap.get(`S${r.maxid}`)?.inscp_scp_amt,
          fulamt_ownpay_amt: fymxMap.get(`S${r.maxid}`)?.fulamt_ownpay_amt,
          overlmt_amt: fymxMap.get(`S${r.maxid}`)?.overlmt_amt,

          bz1: String(r.bz1),
          bz2: r.bz2,
          bz3: String(r.bz3),
        });
      }
      const row = map.get(key);

      row.sl += sl;
      row.je = this.safeMoney(row.je + je);

      row.ypsl += this.calcYpsl(r, sl);
      row.clsl += this.calcClsl(r, sl);
    }

    return Array.from(map.values());
  }

  /**
   * 药品数量计算
   */
  private calcYpsl(r: any, sl: number) {
    if (r.xmzl === 2 && r.qt3 === 0 && r.qt8 > 0 && ['01', '03', '72'].includes(r.fylbid)) {
      return Math.floor(sl / r.qt8);
    }

    return 0;
  }

  /**
   * 材料数量计算
   */
  private calcClsl(r: any, sl: number) {
    if (r.xmzl === 3 && r.qt3 === 0 && r.qt8 > 0 && ['15'].includes(r.fylbid)) {
      return Math.floor(sl / r.qt8);
    }

    return 0;
  }

  /**
   * 金额安全计算
   */
  private safeMoney(v: number) {
    return Math.round(v * 100) / 100;
  }

  async getDiags(zyid: string): Promise<Diags> {
    const h11Brxx = await this.h11_brxxRepo.findOne({
      where: { zyid },
      relations: ['ryzdEntity'],
      select: {
        // 不指定 h11_brxx 的字段，这样会默认选择所有字段
        ryzdEntity: {
          zwmc: true, // 只选择诊断名称字段
        },
      },
    });

    const diags: Diags = { n0422s: [], n0423s: [] };
    // 进行审核
    diags.n0422s = await this.n0422Repository.find({
      where: { zyid: zyid },
    });
    diags.n0423s = await this.n0423Repository.find({
      where: { zyid: zyid },
    });

    // 如果没有诊断要从h11_brxx.ryzd中取
    if (diags.n0422s.length === 0 && h11Brxx.ryzdEntity) {
      diags.n0422s.push({
        zyid: zyid,
        zdxh: 1,
        zdmc: h11Brxx.ryzdEntity.zwmc,
        zdbm: h11Brxx.ryzd,
        maindiag_flag: '1',
      } as N0422);
    }
    return diags;
  }

  async getZycs(data: { ylzh?: string; sfzh?: string; zybh?: string; }) {
    const maxZycs = await this.h11_brxxRepo
      .createQueryBuilder('brxx')
      .select('MAX(brxx.zycs)', 'maxZycs')
      .where('brxx.ylzh = :ylzh', { ylzh: data?.ylzh || '' })
      .getRawOne().then((res) => res?.maxZycs ? res?.maxZycs + 1 : 1);
    return maxZycs
  }
}
