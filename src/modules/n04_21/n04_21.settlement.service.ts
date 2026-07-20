import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ParamService } from '@/modules/h12_xmzd/service/param.service';
import { N0421 } from './n04_21.entity';
import { N0422 } from '../n04_22/n04_22.entity';
import { N04_23 } from '../n04-23/n04-23.entity';

/** 医保结算单 - 费用明细分类（G60_fymx.med_chrgitm_type） */
const FEE_CATEGORIES: { type: string; name: string }[] = [
  { type: '01', name: '床位费' },
  { type: '02', name: '诊察费' },
  { type: '03', name: '检查费' },
  { type: '04', name: '化验费' },
  { type: '05', name: '治疗费' },
  { type: '06', name: '手术费' },
  { type: '07', name: '护理费' },
  { type: '08', name: '卫生材料费' },
  { type: '09', name: '西药费' },
  { type: '10', name: '中药饮片费' },
  { type: '11', name: '中成药费' },
  { type: '12', name: '一般诊疗费' },
  { type: '13', name: '挂号费' },
  { type: '14', name: '其他费' },
];

export interface SettlementFeeRow {
  name: string;
  /** 金额（分类小计） */
  total: number;
  /** 甲类（chrgitm_lv=01） */
  jia: number;
  /** 乙类（chrgitm_lv=02） */
  yi: number;
  /** 自费（chrgitm_lv=03） */
  zifei: number;
  /** 其他（chrgitm_lv=04 全自费金额） */
  other: number;
}

export interface SettlementDiagnosisRow {
  zdmc: string;
  zdbm: string;
  /** 入院病情（已转换为中文） */
  rybq: string;
}

export interface SettlementSurgeryRow {
  ssjczmc: string;
  ssjczbm: string;
  mzfs: string;
  /** 术者医师姓名 */
  sz: string;
  /** 术者医师代码 */
  szdm: string;
  /** 麻醉医师姓名 */
  mzys: string;
  /** 麻醉医师代码 */
  mzysdm: string;
  /** 手术及操作起止时间 */
  ssqzsj: string;
  /** 麻醉起止时间 */
  mzqzsj: string;
}

function toDecimal(value: unknown): number {
  if (value == null || value === '') return 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

/** 入院病情：1 有 2 临床未确定 3 情况未明 其他 无（对齐 PB） */
function mapRybq(value: unknown): string {
  const v = String(value ?? '').trim();
  if (v === '1') return '有';
  if (v === '2') return '临床未确定';
  if (v === '3') return '情况未明';
  return v === '' ? '' : '无';
}

function formatDateTime(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

function formatRange(begin: unknown, end: unknown): string {
  const b = formatDateTime(begin);
  const e = formatDateTime(end);
  if (!b && !e) return '';
  return `${b || '-'} — ${e || '-'}`;
}

@Injectable()
export class N0421SettlementService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(N0421)
    private readonly n0421Repository: Repository<N0421>,
    @InjectRepository(N0422)
    private readonly n0422Repository: Repository<N0422>,
    @InjectRepository(N04_23)
    private readonly n0423Repository: Repository<N04_23>,
    private readonly paramService: ParamService,
  ) {}

  /**
   * 医保结算单打印数据（对齐 PB 医保结算单打印按钮逻辑）
   * 汇总：N04_21 基本信息 + N04_22 诊断 + N04_23 手术 +
   *      __fyxx 机构信息 + __usrcat 国家编码 + G60_JSXX/G60_fymx/G10_djxx 结算与费用
   */
  async getSettlementSheet(zyid: string) {
    const basic = await this.n0421Repository.findOne({ where: { zyid } });
    if (!basic) {
      throw new NotFoundException('首页未保存，不能打印！');
    }

    const warnings: string[] = [];

    // 机构信息（__fyxx：fymc 名称 / fy2 级别 / fy4 参保地 / fy6 医保代码 / fy7 组织代码）
    const fyxxRows: {
      fymc?: string;
      fy2?: string;
      fy3?: string;
      fy4?: string;
      fy5?: string;
      fy6?: string;
      fy7?: string;
    }[] = await this.dataSource.query(
      `SELECT TOP 1 ISNULL(fymc,'') fymc, ISNULL(fy2,'') fy2, ISNULL(fy3,'') fy3,
              ISNULL(fy4,'') fy4, ISNULL(fy5,'') fy5, ISNULL(fy6,'') fy6, ISNULL(fy7,'') fy7
       FROM dbo.__fyxx`,
    );
    const fyxx = fyxxRows?.[0] || {};
    if (!String(fyxx.fy4 || '').trim()) {
      warnings.push('请管理员设置好参保地！');
    }
    if (!String(fyxx.fy2 || '').trim()) {
      warnings.push('请管理员设置机构级别！');
    }

    // 系统参数
    const [jgdepart, ybjgmc, ybjgdm, ybjgrymc, ybjgrydm, jsmc] = await Promise.all([
      this.paramService.gfGetParaNew(0, 'jgdepart', '', '定点医疗机构填报部门'),
      this.paramService.gfGetParaNew(0, 'ybjgmc', '', '结算清单医保机构名称'),
      this.paramService.gfGetParaNew(0, 'ybjgdm', '', '结算清单医保机构代码'),
      this.paramService.gfGetParaNew(0, 'ybjgrymc', '', '结算清单医保机构经办人名称'),
      this.paramService.gfGetParaNew(0, 'ybjgrydm', '', '结算清单医保机构经办人代码'),
      this.paramService.gfGetParaNew(
        1,
        'xyb_jsmc',
        '广西壮族自治区南宁市医疗保障基金结算清单',
        '医疗保障基金结算清单',
      ),
    ]);

    // 主诊医师 / 责任护士国家编码（对齐 PB：缺编码禁止打印）
    const zzys = String(basic.zzys || '').trim();
    const zrhs = String(basic.zrhs || '').trim();
    const zyysdm = zzys ? await this.findYbry(zzys) : '';
    const zrhsdm = zrhs ? await this.findYbry(zrhs) : '';
    if (!zyysdm) {
      throw new BadRequestException(`主治医师：${zzys}，未对照国家编码，不能打印结算单！`);
    }
    if (!zrhsdm) {
      throw new BadRequestException(`责任护士：${zrhs}，未对照国家编码，不能打印结算单！`);
    }

    // 诊断（西医 zdlx in 2/3；中医主病 zdlx=4、主证 zdlx=1）
    const diagnosisAll = await this.n0422Repository.find({
      where: { zyid },
      order: { zdxh: 'ASC' },
    });
    const westDiagnosis: SettlementDiagnosisRow[] = diagnosisAll
      .filter((row) => ['2', '3'].includes(String(row.zdlx ?? '').trim()))
      .slice(0, 20)
      .map((row) => ({
        zdmc: row.zdmc || '',
        zdbm: row.zdbm || '',
        rybq: mapRybq(row.zdbq),
      }));
    const tcmMain = diagnosisAll.find((row) => String(row.zdlx ?? '').trim() === '4');
    const tcmSymptom = diagnosisAll.find((row) => String(row.zdlx ?? '').trim() === '1');

    // 手术（对齐 PB：过滤 oprn_optn_part_code='1'，最多取 2 条）
    const surgeryAll = await this.n0423Repository.find({
      where: { zyid },
      order: { ssxh: 'ASC' },
    });
    const surgeryRows = surgeryAll.filter(
      (row) => String((row as any).oprn_optn_part_code ?? '').trim() !== '1',
    );
    const surgeries: SettlementSurgeryRow[] = [];
    for (const row of surgeryRows.slice(0, 2)) {
      const sz = String(row.sz || '').trim();
      const mzys = String(row.mzys || '').trim();
      const szdm = sz ? await this.findYbry(sz) : '';
      const mzysdm = mzys ? await this.findYbry(mzys) : '';
      if (sz && !szdm) {
        warnings.push(`术者医师：${sz}，未对照国家编码！`);
      }
      if (mzys && !mzysdm) {
        warnings.push(`麻醉医师：${mzys}，未对照国家编码！`);
      }
      surgeries.push({
        ssjczmc: row.ssjczmc || '',
        ssjczbm: row.ssjczbm || '',
        mzfs: String(row.mzfs || '').trim() || '-',
        sz,
        szdm,
        mzys,
        mzysdm,
        ssqzsj: formatRange((row as any).sskssj, (row as any).ssjssj),
        mzqzsj: formatRange((row as any).anst_begntime, (row as any).anst_endtime),
      });
    }

    // 结算记录（G60_JSXX 取最大 setl_id）与登记信息（G10_djxx）
    const jsidRows: { setl_id?: string }[] = await this.dataSource.query(
      `SELECT MAX(setl_id) AS setl_id FROM dbo.G60_JSXX WHERE lsh = @0`,
      [zyid],
    );
    const setlId = String(jsidRows?.[0]?.setl_id || '').trim();

    let djxx: Record<string, unknown> = {};
    if (setlId) {
      const djRows = await this.dataSource.query(
        `SELECT TOP 1 insutype, bz2, endtime, invono, elec_bill_code, psn_no, psn_type, jssj, begntime
         FROM dbo.G10_djxx WHERE setl_id = @0`,
        [setlId],
      );
      djxx = djRows?.[0] || {};
    }

    // 医保类型名称（险种类型字典）
    let yblxmc = '';
    const insutype = String(djxx.insutype || '').trim();
    if (insutype) {
      const rows: { xmmc?: string }[] = await this.dataSource.query(
        `SELECT xmmc FROM dbo.g00_csxx WHERE xmbh = @0 AND xmzl = N'险种类型'`,
        [insutype],
      );
      yblxmc = String(rows?.[0]?.xmmc || '').trim();
    }

    // 费用明细汇总（G60_fymx 按 med_chrgitm_type / chrgitm_lv 分组）
    const feeRowsRaw: {
      type?: string;
      total?: number;
      jia?: number;
      yi?: number;
      zifei?: number;
      other?: number;
    }[] = await this.dataSource.query(
      `SELECT med_chrgitm_type AS type,
              SUM(ISNULL(det_item_fee_sumamt, 0)) AS total,
              SUM(CASE WHEN chrgitm_lv = '01' THEN ISNULL(det_item_fee_sumamt, 0) ELSE 0 END) AS jia,
              SUM(CASE WHEN chrgitm_lv = '02' THEN ISNULL(det_item_fee_sumamt, 0) ELSE 0 END) AS yi,
              SUM(CASE WHEN chrgitm_lv = '03' THEN ISNULL(det_item_fee_sumamt, 0) ELSE 0 END) AS zifei,
              SUM(CASE WHEN chrgitm_lv = '04' THEN ISNULL(fulamt_ownpay_amt, 0) ELSE 0 END) AS other
       FROM dbo.G60_fymx
       WHERE lsh = @0
       GROUP BY med_chrgitm_type`,
      [zyid],
    );
    const feeMap = new Map(
      (feeRowsRaw || []).map((row) => [String(row.type || '').trim(), row]),
    );
    const feeRows: SettlementFeeRow[] = FEE_CATEGORIES.map(({ type, name }) => {
      const raw = feeMap.get(type);
      return {
        name,
        total: toDecimal(raw?.total),
        jia: toDecimal(raw?.jia),
        yi: toDecimal(raw?.yi),
        zifei: toDecimal(raw?.zifei),
        other: toDecimal(raw?.other),
      };
    });
    const feeTotal: SettlementFeeRow = feeRows.reduce(
      (acc, row) => ({
        name: '金额合计',
        total: acc.total + row.total,
        jia: acc.jia + row.jia,
        yi: acc.yi + row.yi,
        zifei: acc.zifei + row.zifei,
        other: acc.other + row.other,
      }),
      { name: '金额合计', total: 0, jia: 0, yi: 0, zifei: 0, other: 0 },
    );

    // 基金与个人支付（G60_JSXX，对齐 PB 取数与计算口径）
    let payments = {
      /** 总费用 */
      fyhj: 0,
      /** 医保统筹基金支付 */
      tcjjzf: 0,
      /** 职工大额补助 */
      zgdebz: 0,
      /** 居民大病保险 */
      jmdbbx: 0,
      /** 公务员医疗补助 */
      gwybz: 0,
      /** 医疗救助支付 */
      yljzzf: 0,
      /** 企业补充 */
      qybc: 0,
      /** 商业保险 */
      sybx: 0,
      /** 个人自付 */
      grzf: 0,
      /** 个人自费 */
      grzfei: 0,
      /** 个人账户支付 */
      grzhzf: 0,
      /** 个人现金支付 */
      grxjzf: 0,
    };
    if (setlId) {
      const jsRows = await this.dataSource.query(
        `SELECT ISNULL(medfee_sumamt, 0) AS fyhj,
                ISNULL(fund_pay_sumamt, 0) AS bchj,
                ISNULL(acct_pay, 0) AS zhbc,
                ISNULL(hifmi_pay, 0) AS dbbc,
                ISNULL(hifob_pay, 0) AS debc,
                ISNULL(cvlserv_pay, 0) AS gwbc,
                ISNULL(maf_pay, 0) AS ylbc,
                ISNULL(fulamt_ownpay_amt + overlmt_selfpay, 0) AS grzfje
         FROM dbo.G60_JSXX WHERE lsh = @0 AND setl_id = @1`,
        [zyid, setlId],
      );
      const js = jsRows?.[0];
      if (js) {
        const fyhj = toDecimal(js.fyhj);
        const bchj = toDecimal(js.bchj);
        const zhbc = toDecimal(js.zhbc);
        const grzfje = toDecimal(js.grzfje);
        payments = {
          fyhj,
          tcjjzf: bchj,
          zgdebz: toDecimal(js.debc),
          jmdbbx: toDecimal(js.dbbc),
          gwybz: toDecimal(js.gwbc),
          yljzzf: toDecimal(js.ylbc),
          qybc: 0,
          sybx: 0,
          grzf: fyhj - bchj - grzfje,
          grzfei: grzfje,
          grzhzf: zhbc,
          grxjzf: fyhj - bchj - zhbc,
        };
      }
    }

    // 清单流水号：出院年份后两位 + 住院ID 补零 7 位（对齐 PB t_lsh）
    const cysjDate = djxx.endtime
      ? new Date(String(djxx.endtime))
      : basic.cysj
        ? new Date(basic.cysj)
        : new Date();
    const yearSuffix = String(cysjDate.getFullYear()).slice(-2);
    const lshNum = String(zyid).replace(/\D/g, '');
    const listSerial = `${yearSuffix}${lshNum.padStart(7, '0').slice(-7)}`;

    return {
      /** 清单名称 */
      title: jsmc,
      listSerial,
      hospital: {
        name: fyxx.fymc || basic.username || '',
        code: fyxx.fy7 || basic.usercode || '',
        level: fyxx.fy2 || '',
        cbd: fyxx.fy4 || '',
      },
      /** 表头：医保编号（个人编号）/ 病案号 / 申报时间 */
      ybbh: String(djxx.psn_no || basic.jkkh || '').trim(),
      bah: basic.bah || '',
      sbsj: formatDateTime(djxx.jssj),
      basic,
      /** 医保类型（险种名称）/ 特殊人员类型 */
      yblxmc,
      psnType: String(djxx.psn_type || '').trim(),
      westDiagnosis,
      tcmMain: tcmMain
        ? { zdmc: tcmMain.zdmc || '', zdbm: tcmMain.zdbm || '', rybq: mapRybq(tcmMain.zdbq) }
        : null,
      tcmSymptom: tcmSymptom
        ? {
            zdmc: tcmSymptom.zdmc || '',
            zdbm: tcmSymptom.zdbm || '',
            rybq: mapRybq(tcmSymptom.zdbq),
          }
        : null,
      diagnosisCount: westDiagnosis.length,
      surgeries,
      surgeryCount: surgeries.length,
      staff: {
        zzys,
        zyysdm,
        zrhs,
        zrhsdm,
      },
      settlement: {
        setlId,
        /** 业务流水号 */
        ywlsh: zyid,
        /** 票据代码 / 票据号码 */
        pjdm: String(djxx.elec_bill_code || '').trim(),
        pjhm: String(djxx.invono || '').trim(),
        /** 结算期间 */
        period: formatRange(djxx.begntime || basic.rysj, djxx.endtime || basic.cysj),
      },
      feeRows,
      feeTotal,
      payments,
      footer: {
        jgdepart,
        tbr: zzys,
        ybjgmc,
        ybjgdm,
        ybjgrymc,
        ybjgrydm,
      },
      warnings,
    };
  }

  /** __usrcat 国家医保编码（unam 或 usid 匹配，取非空 ybry） */
  private async findYbry(nameOrId: string): Promise<string> {
    const rows: { ybry?: string }[] = await this.dataSource.query(
      `SELECT TOP 1 ybry FROM dbo.__usrcat
       WHERE (unam = @0 OR usid = @0) AND ISNULL(ybry, '') <> ''`,
      [nameOrId],
    );
    return String(rows?.[0]?.ybry || '').trim();
  }
}
