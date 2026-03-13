import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h21_brxx } from '../h21_brxx/h21-brxx.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { FeeDetailQueryDto, FeeSummaryQueryDto, MedicalRecordQueryDto } from './views_360.dto';
import { H21Ylzh } from '../h21_ylzh/h21_ylzh.entity';
import { N04_23 } from '../n04-23/n04-23.entity';

@Injectable()
export class Views360Service {
  constructor(
    @InjectRepository(h21_brxx)
    private readonly h21BrxxRepo: Repository<h21_brxx>,
    @InjectRepository(h11_brxx)
    private readonly h11BrxxRepo: Repository<h11_brxx>,
    @InjectRepository(H21Ylzh)
    private readonly h21YlzhRepo: Repository<H21Ylzh>,

    @InjectRepository(N04_23)
    private readonly n04_23Repo: Repository<N04_23>,
  ) {}

  async findMedicalRecord(queryDto: MedicalRecordQueryDto): Promise<any[]> {
    const { ylzh, startDate, endDate } = queryDto;

    // 门诊：h21_brxx
    const mzQuery = await this.h21BrxxRepo
      .createQueryBuilder('h21')
      .leftJoinAndSelect('h21.Jbbmicd10Entity', 'jbbmicd10Entity')
      .leftJoinAndSelect('h21.kfysidEntity', 'ysidEntity')
      .leftJoinAndSelect('h21.ksidEntity', 'ksidEntity')
      .leftJoinAndSelect('h21.fyidEntity', 'fyidEntity')
      .where('h21.ylzh = :ylzh', { ylzh });
    if (startDate) {
      mzQuery.andWhere('h21.jzsj >= :startDate', { startDate: new Date(startDate) });
    }
    if (endDate) {
      mzQuery.andWhere('h21.jzsj <= :endDate', { endDate: new Date(endDate) });
    }
    const mzList = await mzQuery.getMany();

    // 住院：h11_brxx
    const zyQuery = await this.h11BrxxRepo
      .createQueryBuilder('h11')
      .leftJoinAndSelect('h11.cyksidEntity', 'ksidEntity')
      .leftJoinAndSelect('h11.ryzdEntity', 'jbbmicd10Entity')
      .leftJoinAndSelect('h11.sxysEntity', 'ysidEntity')
      .leftJoinAndSelect('h11.fyidEntity', 'fyidEntity')
      .where('h11.ylzh = :ylzh', { ylzh });
    if (startDate) {
      zyQuery.andWhere('h11.rysj >= :startDate', { startDate: new Date(startDate) });
    }
    if (endDate) {
      zyQuery.andWhere('h11.rysj <= :endDate', { endDate: new Date(endDate) });
    }
    const zyList = await zyQuery.getMany();

    // const list = [...mzList, ...zyList].sort((a, b) => {
    //   const t1 = a.就诊时间 ? new Date(a.就诊时间).getTime() : 0;
    //   const t2 = b.就诊时间 ? new Date(b.就诊时间).getTime() : 0;
    //   return t2 - t1;
    // });

    return [
      ...mzList.map((item: any) => ({
        ...item,
        jzsj: item.jzsj,
        jzh: item.mzid,
        type: '1',
        zdmc: item.Jbbmicd10Entity?.bzmc,
        ysmc: item.kfysidEntity?.unam,
        ksmc: item.ksidEntity?.ksmc,
        fymc: item.fyidEntity?.fymc,
        id: item.mzid + '_' + 1,
      })),
      ...zyList.map((item: any) => ({
        ...item,
        jzsj: item.rysj,
        jzh: item.zyid,
        type: '2',
        zdmc: item.ryzdEntity?.bzmc,
        ysmc: item.sxysEntity?.unam,
        ksmc: item.cyksidEntity?.ksmc,
        fymc: item.fyidEntity?.fyname,
        id: item.zyid + '_' + 2,
      })),
    ].sort((a, b) => {
      return new Date(b.jzsj).getTime() - new Date(a.jzsj).getTime();
    });
  }

  async findPatientInfo(ylzh: string) {
    const patientInfo = await this.h21YlzhRepo.findOne({ where: { ylzh } });
    // 取门诊病人信息
    const mzPatientInfo = await this.h21BrxxRepo.findOne({
      where: { ylzh },
      order: { jzsj: 'DESC' },
    });

    // 门诊次数
    const mzCount = await this.h21BrxxRepo.count({ where: { ylzh } });
    // 住院次数
    const zyCount = await this.h11BrxxRepo.count({ where: { ylzh } });

    // 检验次数：v_his_yh_liszb 与 V_BRXX 关联，按就诊号匹配，按医疗账户过滤
    // 对应 SQL：
    // select count(*)
    // from v_his_yh_liszb lis
    // join V_BRXX v on lis.brdh = v.jzbh
    // where v.ylzh = @ylzh
    // const jyCount = await this.h21BrxxRepo.manager
    //   .createQueryBuilder()
    //   .from('V_BRXX', 'v')
    //   .innerJoin('v_his_yh_liszb', 'lis', 'lis.brdh = v.jzbh')
    //   .where('v.ylzh = :ylzh', { ylzh })
    //   .getCount();

    // 检查次数：pacs_report(T_STUDY_REPORT) 与 V_BRXX 关联，门诊号 / 住院号任一匹配
    // 对应 SQL：
    // select count(*)
    // from V_BRXX v
    // join pacs_report T_STUDY_REPORT
    //   on v.jzbh = T_STUDY_REPORT.门诊号
    //   or v.jzbh = T_STUDY_REPORT.住院号
    // where v.ylzh = @ylzh
    // const jcCount = await this.h21BrxxRepo.manager
    //   .createQueryBuilder()
    //   .from('V_BRXX', 'v')
    //   .innerJoin(
    //     'pacs_report',
    //     'T_STUDY_REPORT',
    //     'v.jzbh = T_STUDY_REPORT.门诊号 OR v.jzbh = T_STUDY_REPORT.住院号',
    //   )
    //   .where('v.ylzh = :ylzh', { ylzh })
    //   .getCount();
    let surgeryHistory = [];

    // 手术史
    // 先找住院id, 然后找手术史
    const zyInfo = await this.h11BrxxRepo.findOne({ where: { ylzh } });
    if (zyInfo) {
      surgeryHistory = await this.n04_23Repo.find({ where: { zyid: zyInfo.zyid } });
    }
    return {
      ...patientInfo,
      mzCount: mzCount,
      zyCount: zyCount,
      // jyCount,
      // jcCount,
      tw: mzPatientInfo?.tw,
      tzxx: mzPatientInfo?.tzxx,
      ywfy: mzPatientInfo?.ywfy,
      surgeryHistory: surgeryHistory.map((item) => item.ssjczmc),
    };
  }

  async findFeeSummary(feeSummaryQueryDto: FeeSummaryQueryDto) {
    const { type, id } = feeSummaryQueryDto;
    //     --门诊费用汇总
    // select h23_cfmx.fylbid ,SUM(round(h23_cfzb.cyfs *h23_cfmx.sl * h23_cfmx.zfje,2)) '应收费用',
    // SUM(round(h23_cfzb.cyfs *h23_cfmx.sl * h23_cfmx.dj,2)) '实收费用'
    //   from h23_cfzb, h23_cfmx where h23_cfzb.cfid= h23_cfmx.cfid
    //    and h23_cfmx.sfbz=1  and h23_cfzb.mzid='就诊号' group by h23_cfmx.fylbid

    //     --住院费用汇总
    // select t.fylbid , sum(t.应收费用) 应收费用, sum(t.实收费用) 实收费用
    // from (
    // select h13_yzzxcs.fylbid ,SUM(round(h13_yzzxcs.jfyl * (h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.xmdj,2)) '应收费用',
    // SUM(round(h13_yzzxcs.jfyl * (h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.xmdj,2)) '实收费用'
    //   from h12_yzxb, h13_yzzxcs where h12_yzxb.zyid= h13_yzzxcs.zyid  and h12_yzxb.yzxh= h13_yzzxcs.yzxh
    //   and h12_yzxb.yzlx= h13_yzzxcs.yzlx and h12_yzxb.mxxh= h13_yzzxcs.mxxh
    //    and h13_yzzxcs.sfbz=1  and h13_yzzxcs.zyid='就诊号' group by h13_yzzxcs.fylbid
    //   union all
    //   select h15_ssxb.fylbid ,SUM(round(h15_ssxb.jfyl  * h15_ssxb.xmdj,2)) '应收费用',
    // SUM(round(h15_ssxb.jfyl  * h15_ssxb.xmdj,2)) '实收费用'
    //   from h15_ssxb where     h15_ssxb.zyid='就诊号' group by h15_ssxb.fylbid) t  group by t.fylbid

    const manager = this.h21BrxxRepo.manager;

    // type: 1=门诊；2=住院
    if (type === '1') {
      // 门诊费用按照费用类别汇总
      const sql = `
        SELECT
          h23_cfmx.fylbid                                       AS fylbid,
          SUM(ROUND(h23_cfzb.cyfs * h23_cfmx.sl * h23_cfmx.zfje, 2)) AS ysfy,
          SUM(ROUND(h23_cfzb.cyfs * h23_cfmx.sl * h23_cfmx.dj, 2))   AS ssfy
        FROM h23_cfzb
        JOIN h23_cfmx ON h23_cfzb.cfid = h23_cfmx.cfid
        WHERE h23_cfmx.sfbz = 1
          AND h23_cfzb.mzid = @0
        GROUP BY h23_cfmx.fylbid
      `;

      const result = await manager.query(sql, [id]);
      return result;
    }

    if (type === '2') {
      // 住院费用按照费用类别汇总
      const sql = `
        SELECT
          t.fylbid                         AS fylbid,
          SUM(t.ysfy)                      AS ysfy,
          SUM(t.ssfy)                      AS ssfy
        FROM (
          SELECT
            h13_yzzxcs.fylbid                                                 AS fylbid,
            SUM(ROUND(h13_yzzxcs.jfyl * (h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.xmdj, 2)) AS ysfy,
            SUM(ROUND(h13_yzzxcs.jfyl * (h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.xmdj, 2)) AS ssfy
          FROM h12_yzxb
          JOIN h13_yzzxcs
            ON h12_yzxb.zyid = h13_yzzxcs.zyid
           AND h12_yzxb.yzxh = h13_yzzxcs.yzxh
           AND h12_yzxb.yzlx = h13_yzzxcs.yzlx
           AND h12_yzxb.mxxh = h13_yzzxcs.mxxh
          WHERE h13_yzzxcs.sfbz = 1
            AND h13_yzzxcs.zyid = @0
          GROUP BY h13_yzzxcs.fylbid

          UNION ALL

          SELECT
            h15_ssxb.fylbid                                                  AS fylbid,
            SUM(ROUND(h15_ssxb.jfyl * h15_ssxb.xmdj, 2))                     AS ysfy,
            SUM(ROUND(h15_ssxb.jfyl * h15_ssxb.xmdj, 2))                     AS ssfy
          FROM h15_ssxb
          WHERE h15_ssxb.zyid = @1
          GROUP BY h15_ssxb.fylbid
        ) t
        GROUP BY t.fylbid
      `;

      const result = await manager.query(sql, [id, id]);
      return result;
    }

    return [];
  }

  async findFeeDetail(feeDetailQueryDto: FeeDetailQueryDto) {
    const { type, id, isMerge } = feeDetailQueryDto;
    const manager = this.h21BrxxRepo.manager;

    //     --门诊费用明细（合并，不合并都一样）
    // select h23_cfmx.cfid, h23_cfmx.xmid, h23_cfmx.xmmc,h23_cfmx.gg,h23_cfmx.ypfl,
    // h23_cfmx.fylbid ,h23_cfzb.kfysid,(h23_cfmx.sl * h23_cfzb.cyfs) sl,h23_cfmx.dw,
    // (h23_cfmx.sl * h23_cfzb.cyfs * h23_cfmx.dj) je,h23_cfmx.gjybbm
    //   from h23_cfzb, h23_cfmx where h23_cfzb.cfid= h23_cfmx.cfid
    //    and h23_cfmx.sfbz=1  and h23_cfzb.mzid='就诊号'
    //    order by h23_cfmx.cfid , h23_cfmx.mxxh
    //     --门诊费用明细（合并）
    // select t.xmid,t.xmmc,t.xmgg,t.ybfl,t.fylbid,t.ksys,sum(t.sl) sl, t.xmdw,sum(t.je) je , t.gjybbm  from
    // (
    // select   h13_yzzxcs.xmid, h12_yzxb.xmmc,h12_yzxb.xmgg,h12_yzxb.jssj as ybfl,
    // h13_yzzxcs.fylbid ,h12_yzxb.ksys,((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs)*h13_yzzxcs.jfyl * h13_yzzxcs.kyts) sl,h12_yzxb.xmdw,
    // ((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs)*h13_yzzxcs.jfyl * h13_yzzxcs.kyts *h13_yzzxcs.xmdj) je,h12_yzxb.gjybbm
    //   from h12_yzxb, h13_yzzxcs where h12_yzxb.zyid= h13_yzzxcs.zyid  and h12_yzxb.yzxh= h13_yzzxcs.yzxh
    //   and h12_yzxb.yzlx= h13_yzzxcs.yzlx and h12_yzxb.mxxh= h13_yzzxcs.mxxh
    //    and h13_yzzxcs.sfbz=1  and h13_yzzxcs.zyid='就诊号'
    // union all
    // select   h15_ssxb.xmid, h15_ssxb.xmmc,h15_ssxb.xmgg,h15_ssxb.ybfl,
    // h15_ssxb.fylbid ,h15_ssxb.ksys,(h15_ssxb.jfyl ) sl,h15_ssxb.jldw,
    // (h15_ssxb.jfyl  *h15_ssxb.xmdj) je,h15_ssxb.gjybbm
    //   from h15_ssxb where
    //    h15_ssxb.sfbz=1  and h15_ssxb.zyid='就诊号' ) t
    //    group by t.xmid,t.xmmc,t.xmgg,t.ybfl,t.fylbid,t.ksys, t.xmdw, t.gjybbm
    // --门诊费用明细（不合并）
    // select t.zxrq,t.xmid,t.xmmc,t.xmgg,t.ybfl,t.fylbid,t.ksys,sum(t.sl) sl, t.xmdw,sum(t.je) je , t.gjybbm  from
    // (
    // select  h13_yzzxcs.zxrq , h13_yzzxcs.xmid, h12_yzxb.xmmc,h12_yzxb.xmgg,h12_yzxb.jssj as ybfl,
    // h13_yzzxcs.fylbid ,h12_yzxb.ksys,((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs)*h13_yzzxcs.jfyl * h13_yzzxcs.kyts) sl,h12_yzxb.xmdw,
    // ((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs)*h13_yzzxcs.jfyl * h13_yzzxcs.kyts *h13_yzzxcs.xmdj) je,h12_yzxb.gjybbm
    //   from h12_yzxb, h13_yzzxcs where h12_yzxb.zyid= h13_yzzxcs.zyid  and h12_yzxb.yzxh= h13_yzzxcs.yzxh
    //   and h12_yzxb.yzlx= h13_yzzxcs.yzlx and h12_yzxb.mxxh= h13_yzzxcs.mxxh
    //    and h13_yzzxcs.sfbz=1  and h13_yzzxcs.zyid='就诊号'
    // union all
    // select  h15_ssxb.ssrq, h15_ssxb.xmid, h15_ssxb.xmmc,h15_ssxb.xmgg,h15_ssxb.ybfl,
    // h15_ssxb.fylbid ,h15_ssxb.ksys,(h15_ssxb.jfyl ) sl,h15_ssxb.jldw,
    // (h15_ssxb.jfyl  *h15_ssxb.xmdj) je,h15_ssxb.gjybbm
    //   from h15_ssxb where
    //    h15_ssxb.sfbz=1  and h15_ssxb.zyid='就诊号' ) t
    //    group by t.zxrq,t.xmid,t.xmmc,t.xmgg,t.ybfl,t.fylbid,t.ksys, t.xmdw, t.gjybbm

    // type: 1=门诊；2=住院
    if (type === '1') {
      // 门诊费用明细（合并、不合并结果相同）
      const sql = `
        SELECT
          h23_cfmx.cfid,
          h23_cfmx.xmid,
          h23_cfmx.xmmc,
          h23_cfmx.gg,
          h23_cfmx.ypfl,
          h23_cfmx.fylbid,
          h23_cfzb.kfysid,
          (h23_cfmx.sl * h23_cfzb.cyfs)                         AS sl,
          h23_cfmx.dw                                           AS xmdw,
          (h23_cfmx.sl * h23_cfzb.cyfs * h23_cfmx.dj)           AS je,
          h23_cfmx.gjybbm
        FROM h23_cfzb
        JOIN h23_cfmx ON h23_cfzb.cfid = h23_cfmx.cfid
        WHERE h23_cfmx.sfbz = 1
          AND h23_cfzb.mzid = @0
        ORDER BY h23_cfmx.cfid, h23_cfmx.mxxh
      `;

      return manager.query(sql, [id]);
    }

    if (type === '2') {
      // 住院费用明细
      // isMerge: 1=合并；0 或其他=不合并
      if (isMerge === '1') {
        // 合并
        const sql = `
          SELECT
            t.xmid,
            t.xmmc,
            t.gg,
            t.ybfl,
            t.fylbid,
            t.kfysid,
            SUM(t.sl)                       AS sl,
            t.xmdw,
            SUM(t.je)                       AS je,
            t.gjybbm
          FROM (
            SELECT
              h13_yzzxcs.xmid                                       AS xmid,
              h12_yzxb.xmmc                                         AS xmmc,
              h12_yzxb.xmgg                                         AS gg,
              h12_yzxb.jssj                                         AS ybfl,
              h13_yzzxcs.fylbid                                     AS fylbid,
              h12_yzxb.ksys                                         AS kfysid,
              ((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.jfyl * h13_yzzxcs.kyts) AS sl,
              h12_yzxb.xmdw                                         AS xmdw,
              ((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.jfyl * h13_yzzxcs.kyts * h13_yzzxcs.xmdj) AS je,
              h12_yzxb.gjybbm                                       AS gjybbm
            FROM h12_yzxb, h13_yzzxcs
            WHERE h12_yzxb.zyid = h13_yzzxcs.zyid
              AND h12_yzxb.yzxh = h13_yzzxcs.yzxh
              AND h12_yzxb.yzlx = h13_yzzxcs.yzlx
              AND h12_yzxb.mxxh = h13_yzzxcs.mxxh
              AND h13_yzzxcs.sfbz = 1
              AND h13_yzzxcs.zyid = @0

            UNION ALL

            SELECT
              h15_ssxb.xmid                                        AS xmid,
              h15_ssxb.xmmc                                        AS xmmc,
              h15_ssxb.xmgg                                        AS gg,
              h15_ssxb.ybfl                                        AS ybfl,
              h15_ssxb.fylbid                                      AS fylbid,
              h15_ssxb.ksys                                        AS kfysid,
              (h15_ssxb.jfyl)                                      AS sl,
              h15_ssxb.jldw                                        AS xmdw,
              (h15_ssxb.jfyl * h15_ssxb.xmdj)                      AS je,
              h15_ssxb.gjybbm                                      AS gjybbm
            FROM h15_ssxb
            WHERE h15_ssxb.sfbz = 1
              AND h15_ssxb.zyid = @0
          ) t
          GROUP BY
            t.xmid,
            t.xmmc,
            t.gg,
            t.ybfl,
            t.fylbid,
            t.kfysid,
            t.xmdw,
            t.gjybbm
        `;

        return manager.query(sql, [id]);
      } else {
        // 不合并：按执行日期分组
        const sql = `
          SELECT
            t.zxrq,
            t.xmid,
            t.xmmc,
            t.gg,
            t.ybfl,
            t.fylbid,
            t.kfysid,
            SUM(t.sl)                       AS sl,
            t.xmdw,
            SUM(t.je)                       AS je,
            t.gjybbm
          FROM (
            SELECT
              h13_yzzxcs.zxrq                                      AS zxrq,
              h13_yzzxcs.xmid                                      AS xmid,
              h12_yzxb.xmmc                                        AS xmmc,
              h12_yzxb.xmgg                                        AS gg,
              h12_yzxb.jssj                                        AS ybfl,
              h13_yzzxcs.fylbid                                    AS fylbid,
              h12_yzxb.ksys                                        AS kfysid,
              ((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.jfyl * h13_yzzxcs.kyts) AS sl,
              h12_yzxb.xmdw                                        AS xmdw,
              ((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.jfyl * h13_yzzxcs.kyts * h13_yzzxcs.xmdj) AS je,
              h12_yzxb.gjybbm                                      AS gjybbm
            FROM h12_yzxb, h13_yzzxcs
            WHERE h12_yzxb.zyid = h13_yzzxcs.zyid
              AND h12_yzxb.yzxh = h13_yzzxcs.yzxh
              AND h12_yzxb.yzlx = h13_yzzxcs.yzlx
              AND h12_yzxb.mxxh = h13_yzzxcs.mxxh
              AND h13_yzzxcs.sfbz = 1
              AND h13_yzzxcs.zyid = @0

            UNION ALL

            SELECT
              h15_ssxb.ssrq                                       AS zxrq,
              h15_ssxb.xmid                                       AS xmid,
              h15_ssxb.xmmc                                       AS xmmc,
              h15_ssxb.xmgg                                       AS gg,
              h15_ssxb.ybfl                                       AS ybfl,
              h15_ssxb.fylbid                                     AS fylbid,
              h15_ssxb.ksys                                       AS kfysid,
              (h15_ssxb.jfyl)                                     AS sl,
              h15_ssxb.jldw                                       AS xmdw,
              (h15_ssxb.jfyl * h15_ssxb.xmdj)                     AS je,
              h15_ssxb.gjybbm                                     AS gjybbm
            FROM h15_ssxb
            WHERE h15_ssxb.sfbz = 1
              AND h15_ssxb.zyid = @0
          ) t
          GROUP BY
            t.zxrq,
            t.xmid,
            t.xmmc,
            t.gg,
            t.ybfl,
            t.fylbid,
            t.kfysid,
            t.xmdw,
            t.gjybbm
          ORDER BY t.zxrq
        `;

        return manager.query(sql, [id]);
      }
    }

    return [];
  }
}
