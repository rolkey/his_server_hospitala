import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ParamService } from '@/modules/h12_xmzd/service/param.service';
import { N0421 } from './n04_21.entity';
import { PatientCaseRetrieveResult } from './dto/patient-case-retrieve.dto';

/** 与 n04_21.service 中 N0421_DETAIL_FIELDS 一致 */
const N0421_DETAIL_FIELDS: (keyof N0421)[] = [
  'zyid',
  'usercode',
  'username',
  'ylfkfs',
  'jkkh',
  'zycs',
  'bah',
  'xm',
  'xb',
  'csrq',
  'nl',
  'gj',
  'bzyzs_nl',
  'xsetz',
  'xserytz',
  'csd1',
  'csd2',
  'csd3',
  'gg1',
  'gg2',
  'gg3',
  'mz',
  'sfzh',
  'zy',
  'hy',
  'xzz1',
  'xzz2',
  'xzz3',
  'dh',
  'yb1',
  'hkdz1',
  'hkdz2',
  'hkdz3',
  'yb2',
  'gzdwjdz',
  'dwdh',
  'yb3',
  'lxrxm',
  'gx',
  'dz',
  'dh1',
  'rytj',
  'zllb',
  'rysj',
  'rysj_s',
  'rykb',
  'rybf',
  'zkkb',
  'cysj',
  'cysj_s',
  'cykb',
  'cybf',
  'sjzy',
  'mzd_zyzd',
  'jbdm',
  'mzzd_xyzd',
  'jbbm',
  'sslclj',
  'zyyj',
  'zyzlsb',
  'zyzljs',
  'bzsh',
  'wbyy',
  'jbbm1',
  'blzd',
  'jbbm2',
  'blh',
  'ywgm',
  'gmyw',
  'sj',
  'xx',
  'rh',
  'kzr',
  'zrys',
  'zzys',
  'zyys',
  'zrhs',
  'jxys',
  'sxys',
  'bmy',
  'bazl',
  'zkys',
  'zkhs',
  'zkrq',
  'lyfs',
  'yzzy_jgmc',
  'wsy_jgmc',
  'zzyjh',
  'md',
  'ryq_t',
  'ryq_xs',
  'ryq_fz',
  'ryh_t',
  'ryh_xs',
  'ryh_fz',
  'fzr',
  'tjfzr',
  'lxdh',
  'riqi',
  'zybh',
  'sjbz',
  'nldw',
  'bzxx',
  'bzxx1',
  'jdrq',
  'xhxb',
  'xxxb',
  'xxj',
  'xqx',
  'xqt',
  'qzrq',
  'srqz',
  'mzcy',
  'rycy',
  'sqsh',
  'lcbl',
  'fxbl',
  'bajl',
  'zrb',
  'shss',
  'shsr',
  'shxj',
  'ry48',
  'shks',
  'zczy',
  'cyfs',
  'blfx',
  'bz1',
  'szbz',
  'sscs',
  'sscg',
  'bz2',
  'bz3',
  'bz4',
  'bz5',
  'xzz4',
  'xzz5',
  'hkdz4',
  'hkdz5',
  'xzdz',
  'hkdz',
  'tjbz',
  'drgbz',
  'shbz',
  'shry',
  'shrq',
  'hbsag',
  'hcvab',
  'hivab',
  'ryzdicd',
  'ryzdmc',
  'ryblfx',
  'bld_cat',
  'bld_unt',
  'bld_amt',
  'bz6',
  'thl',
  'yhl',
  'ehl',
  'shl',
  'sflx',
  'sslclj1',
  'bz7',
  'mzys',
  'blsm',
];

interface H11BrxxRow {
  brlxid?: string | null;
  xbid?: string | null;
  csrq?: Date | string | null;
  yebz?: number | null;
  sfdm?: string | null;
  sjdm?: string | null;
  jgdm?: string | null;
  mzmc?: string | null;
  gjid?: string | null;
  hyzkmc?: string | null;
  hyid?: string | null;
  hkdz?: string | null;
  jtdh?: string | null;
  mzys?: string | null;
  ryff?: string | null;
  mzzd?: string | null;
  ryzd?: string | null;
  zybh?: string | null;
  zycs?: number | null;
  brxm?: string | null;
  brnl?: string | null;
  etys?: number | null;
  etcstz?: string | null;
  etrytz?: string | null;
  sfzh?: string | null;
  hkyb?: string | null;
  hkyb1?: string | null;
  csddmc?: string | null;
  xjdm?: string | null;
  gzdw?: string | null;
  dwdh?: string | null;
  dwyb?: string | null;
  lxrm?: string | null;
  gxid?: string | null;
  lxdz?: string | null;
  lxdh?: string | null;
  ryksid?: string | null;
  ryksmc?: string | null;
  rysj?: Date | string | null;
  cysj?: Date | string | null;
  bahm?: string | null;
  nldw?: string | null;
  cyzd?: string | null;
  nldw1?: string | null;
  hbh?: string | null;
  rycw?: string | null;
  zkksid?: string | null;
  gg1?: string | null;
  gg2?: string | null;
  gg3?: string | null;
  xzz1?: string | null;
  xzz2?: string | null;
  xzz3?: string | null;
  xzz4?: string | null;
  xzz5?: string | null;
  hkdz1?: string | null;
  hkdz2?: string | null;
  hkdz3?: string | null;
  hkdz4?: string | null;
  hkdz5?: string | null;
  zrhs?: string | null;
  sflx?: string | null;
  mzbh?: string | null;
}

interface BuildFromBrxxResult {
  record: Partial<N0421>;
  errors: string[];
  warnings: string[];
}

function trim(value: unknown): string {
  if (value == null) return '';
  return String(value).trim();
}

function isBlank(value: unknown): boolean {
  return trim(value) === '';
}

function toDate(value: unknown): Date | null {
  if (value == null || value === '') return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(start: Date, end: Date): number {
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((e.getTime() - s.getTime()) / 86400000);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function mapYlfkfs(brlxid: string): string {
  switch (brlxid) {
    case '0501':
      return '01';
    case '0201':
      return '07';
    case '0601':
    case '0901':
      return '09';
    case '0701':
      return '02';
    case '0101':
      return '06';
    default:
      return '99';
  }
}

function isValidIdCardLength(sfzh: string): boolean {
  if (sfzh === '') return true;
  const len = sfzh.length;
  return len === 8 || len === 9 || len === 12 || len === 15 || len === 18;
}

@Injectable()
export class N0421RetrieveService {
  constructor(
    @InjectRepository(N0421)
    private readonly n0421Repository: Repository<N0421>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly paramService: ParamService,
  ) {}

  async retrievePatientCase(zyid: string): Promise<PatientCaseRetrieveResult> {
    const existing = await this.queryRecord(zyid);

    if (!existing) {
      const built = await this.buildFromH11Brxx(zyid);
      if (built.errors.length > 0) {
        return {
          record: null,
          initialized: false,
          needPatientMaintenance: true,
          messages: built.errors,
        };
      }

      const merged = await this.applyVidifyCy(built.record, zyid);
      return {
        record: merged,
        initialized: true,
        needPatientMaintenance: false,
        messages: built.warnings,
      };
    }

    if (Number(existing.sjbz ?? 0) === 1) {
      return {
        record: existing,
        initialized: false,
        needPatientMaintenance: false,
        messages: [],
      };
    }

    const merged = await this.applyVidifyCy(existing, zyid);
    return {
      record: merged,
      initialized: false,
      needPatientMaintenance: false,
      messages: [],
    };
  }

  private async queryRecord(zyid: string): Promise<Partial<N0421> | null> {
    const selectFields = N0421_DETAIL_FIELDS.map((field) => `n04_21.${field}`);
    return (
      (await this.n0421Repository
        .createQueryBuilder('n04_21')
        .select(selectFields)
        .where('n04_21.zyid = :zyid', { zyid })
        .getOne()) ?? null
    );
  }

  /** 对齐 PB vu_basy_jbxx.uf_vidify_new20 */
  private async buildFromH11Brxx(zyid: string): Promise<BuildFromBrxxResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const brxxRows: H11BrxxRow[] = await this.dataSource.query(
      `
      SELECT
        brlxid,
        LTRIM(ISNULL(xbid, '')) AS xbid,
        csrq,
        ISNULL(yebz, 0) AS yebz,
        ISNULL(sfdm, '') AS sfdm,
        ISNULL(sjdm, '') AS sjdm,
        ISNULL(jgdm, '') AS jgdm,
        ISNULL(mzmc, '') AS mzmc,
        ISNULL(gjid, '') AS gjid,
        ISNULL(hyzkmc, '') AS hyzkmc,
        ISNULL(hyid, '') AS hyid,
        ISNULL(hkdz, '') AS hkdz,
        ISNULL(jtdh, '') AS jtdh,
        ISNULL(mzys, '') AS mzys,
        ISNULL(ryff, '') AS ryff,
        ISNULL(mzzd, '') AS mzzd,
        ISNULL(ryzd, '') AS ryzd,
        zybh,
        zycs,
        brxm,
        brnl,
        etys,
        etcstz,
        etrytz,
        sfzh,
        hkyb,
        hkyb1,
        csddmc,
        ISNULL(xjdm, '') AS xjdm,
        gzdw,
        dwdh,
        dwyb,
        lxrm,
        gxid,
        lxdz,
        lxdh,
        ryksid,
        ryksmc,
        rysj,
        cysj,
        ISNULL(bahm, '') AS bahm,
        ISNULL(nldw, '') AS nldw,
        ISNULL(cyzd, '') AS cyzd,
        ISNULL(nldw1, '') AS nldw1,
        hbh,
        ISNULL(rycw, cycw) AS rycw,
        zkksid,
        ISNULL(GG1, '') AS gg1,
        ISNULL(GG2, '') AS gg2,
        ISNULL(GG3, '') AS gg3,
        ISNULL(XZZ1, '') AS xzz1,
        ISNULL(XZZ2, '') AS xzz2,
        ISNULL(XZZ3, '') AS xzz3,
        ISNULL(XZZ4, '') AS xzz4,
        ISNULL(XZZ5, '') AS xzz5,
        ISNULL(HKDZ1, '') AS hkdz1,
        ISNULL(HKDZ2, '') AS hkdz2,
        ISNULL(HKDZ3, '') AS hkdz3,
        ISNULL(HKDZ4, '') AS hkdz4,
        ISNULL(HKDZ5, '') AS hkdz5,
        ISNULL(zrhs, '') AS zrhs,
        ISNULL(sflx, '01') AS sflx,
        ISNULL(mzbh, '') AS mzbh
      FROM dbo.h11_brxx
      WHERE zyid = @0
      `,
      [zyid],
    );

    const brxx = brxxRows?.[0];
    if (!brxx) {
      throw new NotFoundException(`住院ID ${zyid} 对应的住院病人不存在`);
    }

    let ryzd = trim(brxx.ryzd);
    let ryzdmc = '';
    const icdRows: { zwmc?: string }[] = await this.dataSource.query(
      `SELECT TOP 1 ISNULL(zwmc, '') AS zwmc FROM dbo.__jbbmicd10 WHERE bzbm = @0`,
      [ryzd],
    );
    ryzdmc = trim(icdRows?.[0]?.zwmc);
    if (ryzdmc === '') {
      ryzdmc = ryzd;
      ryzd = '';
    }

    let ryksmc = trim(brxx.ryksmc);
    const bqgl = await this.paramService.gfGetPara(13, 'bqgl', '0', '启用病区管理');
    if (bqgl === '1' && !isBlank(brxx.zkksid)) {
      const ksRows: { ksmc?: string }[] = await this.dataSource.query(
        `SELECT ISNULL(ksmc, '') AS ksmc FROM dbo.__ksmc WHERE ksid = @0`,
        [trim(brxx.zkksid)],
      );
      ryksmc = trim(ksRows?.[0]?.ksmc) || ryksmc;
    }

    let cwmc = '';
    if (!isBlank(brxx.rycw)) {
      const cwRows: { cwmc?: string }[] = await this.dataSource.query(
        `SELECT cwmc FROM dbo.h00_cwxx WHERE cwid = @0`,
        [trim(brxx.rycw)],
      );
      cwmc = trim(cwRows?.[0]?.cwmc);
    }

    const xbid = trim(brxx.xbid);
    const csrq = toDate(brxx.csrq);
    const sfdm = trim(brxx.sfdm);
    const sjdm = trim(brxx.sjdm);
    const jgdm = trim(brxx.jgdm);
    const xjdm = trim(brxx.xjdm);
    const mzmc = trim(brxx.mzmc);
    const gjid = trim(brxx.gjid);
    const hyzkmc = trim(brxx.hyzkmc);
    const hyid = trim(brxx.hyid);
    const hkdz = trim(brxx.hkdz);
    const jtdh = trim(brxx.jtdh);
    const mzysId = trim(brxx.mzys);
    const ryff = trim(brxx.ryff);
    const sfzh = trim(brxx.sfzh);
    // 籍贯：优先用入院登记的 GG1/2/3，缺省时回退省份/市/籍贯代码
    const gg1 = trim(brxx.gg1) || sfdm;
    const gg2 = trim(brxx.gg2) || sjdm;
    const gg3 = trim(brxx.gg3) || jgdm;
    // 出生地：h11_brxx 无 CSD 列，与入院登记 CSDZ 一致，用省/市/县代码（非 csddmc 名称）
    const csd1 = sfdm;
    const csd2 = sjdm;
    const csd3 = jgdm || xjdm;
    const xzz1 = trim(brxx.xzz1);
    const xzz2 = trim(brxx.xzz2);
    const xzz3 = trim(brxx.xzz3);
    const xzz4 = trim(brxx.xzz4);
    const xzz5 = trim(brxx.xzz5);
    const hkdz1 = trim(brxx.hkdz1);
    const hkdz2 = trim(brxx.hkdz2);
    const hkdz3 = trim(brxx.hkdz3);
    const hkdz4 = trim(brxx.hkdz4);
    const hkdz5 = trim(brxx.hkdz5);

    if (isBlank(xbid) || (xbid !== '1' && xbid !== '2')) {
      errors.push('性别为空，请维护好病人信息!');
    }
    if (!csrq) {
      errors.push('出生日期为空，请维护好病人信息!');
    }
    if (isBlank(sfdm)) {
      errors.push('省份为空，请维护好病人信息!');
    }
    if (isBlank(jgdm)) {
      errors.push('籍贯为空，请维护好病人信息!');
    }

    const mzCountRows: { cnt?: number }[] = await this.dataSource.query(
      `SELECT ISNULL(COUNT(*), 0) AS cnt FROM dbo.__mzzd WHERE mzid = @0`,
      [mzmc],
    );
    if (Number(mzCountRows?.[0]?.cnt ?? 0) <= 0) {
      errors.push('民族为空或不在字典编码内或不能手工打字，请维护好病人信息!');
    }
    if (isBlank(gjid)) {
      errors.push('国籍为空，请维护好病人信息!');
    }

    const hyCountRows: { cnt?: number }[] = await this.dataSource.query(
      `SELECT ISNULL(COUNT(*), 0) AS cnt FROM dbo.__hyzk WHERE hyzkid = @0`,
      [hyzkmc],
    );
    if (Number(hyCountRows?.[0]?.cnt ?? 0) <= 0) {
      errors.push('婚姻为空，请维护好病人信息!');
    }

    const zyCountRows: { cnt?: number }[] = await this.dataSource.query(
      `SELECT ISNULL(COUNT(*), 0) AS cnt FROM dbo.__zy WHERE zydmid = @0`,
      [hyid],
    );
    if (Number(zyCountRows?.[0]?.cnt ?? 0) <= 0) {
      errors.push('职业为空，请维护好病人信息!');
    }
    if (isBlank(hkdz)) {
      errors.push('现住地址为空，请维护好病人信息!');
    }
    if (isBlank(jtdh)) {
      errors.push('电话为空，请维护好病人信息!');
    }

    let zzysName = '';
    if (!isBlank(mzysId)) {
      const ysRows: { unam?: string }[] = await this.dataSource.query(
        `SELECT unam FROM dbo.__usrcat WHERE usid = @0`,
        [mzysId],
      );
      zzysName = trim(ysRows?.[0]?.unam);
    }
    if (isBlank(zzysName)) {
      errors.push('主治医生为空，请维护好病人信息!');
    }
    if (isBlank(ryff)) {
      errors.push('入院途径为空，请维护好病人信息!');
    }
    if (isBlank(ryzdmc)) {
      errors.push('入院诊断别为空，请维护好病人信息!');
    }
    if (!isValidIdCardLength(sfzh)) {
      errors.push('身份证位数不对，请核对!');
    }
    if (isBlank(xzz5)) {
      errors.push('现住地址为空，请维护好病人信息!');
    }
    if (isBlank(hkdz5)) {
      errors.push('户口地址为空，请维护好病人信息!');
    }

    if (errors.length > 0) {
      return { record: { zyid }, errors, warnings };
    }

    const rysj = toDate(brxx.rysj);
    const cysj = toDate(brxx.cysj);
    let sjzy: string | null = null;
    if (cysj && rysj) {
      let days = daysBetween(rysj, cysj);
      if (days === 0) days = 1;
      sjzy = String(days);
    }

    let readmitDays = 0;
    const maxCyRows: { maxcysj?: Date | string | null }[] = await this.dataSource.query(
      `
      SELECT MAX(cysj) AS maxcysj
      FROM dbo.h11_brxx
      WHERE zyid <> @0 AND bahm = @1 AND brxm = @2
      `,
      [zyid, trim(brxx.bahm), trim(brxx.brxm)],
    );
    const maxCysj = toDate(maxCyRows?.[0]?.maxcysj);
    if (maxCysj && rysj) {
      readmitDays = daysBetween(rysj, maxCysj);
    }

    const yebz = Number(brxx.yebz ?? 0);
    const nldw = trim(brxx.nldw);
    const brnl = trim(brxx.brnl);
    const etys = Number(brxx.etys ?? 0);
    let etcstz: number | null = null;
    let etrytz: number | null = null;
    if (/^\d+(\.\d+)?$/.test(trim(brxx.etcstz))) {
      etcstz = Number(brxx.etcstz);
    }
    if (/^\d+(\.\d+)?$/.test(trim(brxx.etrytz))) {
      etrytz = Number(brxx.etrytz);
    }

    let zrhsName = '';
    const zrhsId = trim(brxx.zrhs);
    if (!isBlank(zrhsId)) {
      const zrhsRows: { unam?: string }[] = await this.dataSource.query(
        `SELECT unam FROM dbo.__usrcat WHERE usid = @0`,
        [zrhsId],
      );
      zrhsName = trim(zrhsRows?.[0]?.unam);
    }

    let outpatientDoctorName = '';
    const mzbh = trim(brxx.mzbh);
    if (!isBlank(mzbh)) {
      const mzysRows: { unam?: string }[] = await this.dataSource.query(
        `SELECT TOP 1 unam FROM dbo.__usrcat WHERE usid = @0`,
        [mzbh],
      );
      outpatientDoctorName = trim(mzysRows?.[0]?.unam);
    }

    const [zkys, zkhs, bmy, yssytsbl] = await Promise.all([
      this.paramService.gfGetPara(50, 'zkys', '', '质控医生'),
      this.paramService.gfGetPara(50, 'zkhs', '', '质控护士'),
      this.paramService.gfGetPara(50, 'bmy', '', '编码员'),
      this.paramService.gfGetParaNew(12, 'yssytsbl', '0', '病案首页特殊病例(0普通,104001长期精神)'),
    ]);

    let hbh = trim(brxx.hbh);
    if (hbh.length > 18) hbh = '';

    const record: Partial<N0421> = {
      zyid,
      bah: trim(brxx.bahm),
      zybh: trim(brxx.zybh),
      zycs: brxx.zycs ?? undefined,
      ylfkfs: mapYlfkfs(trim(brxx.brlxid)),
      xm: trim(brxx.brxm),
      xb: xbid,
      csrq: csrq ?? undefined,
      gj: gjid,
      xsetz: etcstz ?? undefined,
      xserytz: etrytz ?? undefined,
      mz: mzmc,
      sfzh,
      zy: hyid,
      hy: hyzkmc,
      dh: jtdh,
      yb1: trim(brxx.hkyb) || undefined,
      yb2: trim(brxx.hkyb1) || undefined,
      gzdwjdz: trim(brxx.gzdw) || undefined,
      dwdh: trim(brxx.dwdh) || undefined,
      yb3: trim(brxx.dwyb) || undefined,
      lxrxm: trim(brxx.lxrm) || undefined,
      gx: trim(brxx.gxid) || undefined,
      dz: trim(brxx.lxdz) || undefined,
      dh1: trim(brxx.lxdh) || undefined,
      rytj: ryff,
      zllb: '3',
      rysj: rysj ?? undefined,
      rysj_s: rysj ? rysj.getHours() : undefined,
      rykb: ryksmc,
      rybf: cwmc,
      zkkb: '-',
      cysj: cysj ?? undefined,
      cysj_s: cysj ? cysj.getHours() : undefined,
      cykb: ryksmc,
      cybf: cwmc,
      sjzy: sjzy ?? undefined,
      mzd_zyzd: '',
      jbdm: '',
      mzzd_xyzd: ryzdmc,
      jbbm: ryzd,
      sslclj: '3',
      zyyj: '2',
      zyzlsb: '2',
      zyzljs: '2',
      bzsh: '2',
      jkkh: hbh,
      ywgm: '1',
      xx: '6',
      rh: '4',
      lyfs: '1',
      zzyjh: readmitDays > 0 && readmitDays < 32 ? '2' : '1',
      srqz: '否',
      mzcy: '1',
      rycy: '1',
      sqsh: '0',
      lcbl: '0',
      fxbl: '0',
      zrb: '无',
      shks: '',
      bajl: '0',
      shss: '0',
      shsr: '0',
      shxj: '0',
      ry48: '0',
      zczy: '0',
      bazl: '1',
      zzys: zzysName,
      bz2: '2',
      sscs: '0',
      sscg: '0',
      zrhs: zrhsName,
      xhxb: '0',
      xxxb: '0',
      xxj: '0',
      xqx: '0',
      xqt: '0',
      bz1: yssytsbl,
      bld_cat: '1',
      bld_unt: '0',
      ryzdmc,
      ryzdicd: ryzd,
      hcvab: '0',
      hivab: '0',
      hbsag: '0',
      sflx: trim(brxx.sflx) || '01',
      ryblfx: 'A',
      sslclj1: '3',
      mzys: outpatientDoctorName,
      // 出生地：h11_brxx 无 CSD 列，用省份/市/县代码初始化（csddmc 为名称，不可用于级联）
      csd1: csd1 || undefined,
      csd2: csd2 || undefined,
      csd3: csd3 || undefined,
      gg1: gg1 || undefined,
      gg2: gg2 || undefined,
      gg3: gg3 || undefined,
      xzz1: xzz1 || undefined,
      xzz2: xzz2 || undefined,
      xzz3: xzz3 || undefined,
      xzz4: xzz4 || undefined,
      xzz5: xzz5 || undefined,
      hkdz1: hkdz1 || undefined,
      hkdz2: hkdz2 || undefined,
      hkdz3: hkdz3 || undefined,
      hkdz4: hkdz4 || undefined,
      hkdz5: hkdz5 || undefined,
      // brxx.hkdz 在校验文案中为「现住地址」，同步到 xzdz；hkdz 保留兼容
      xzdz: hkdz || undefined,
      hkdz: hkdz || undefined,
      sjbz: 0,
      tjbz: 0,
      zkys,
      zkhs,
      bmy,
    };

    if (yebz === 1 || nldw !== '岁') {
      record.bzyzs_nl = brnl ? Number(brnl) : undefined;
      record.nldw = String(etys);
    } else {
      record.nl = brnl ? Number(brnl) : undefined;
      record.bz6 = String(etys);
    }

    if (readmitDays > 0 && readmitDays < 32) {
      warnings.push('该患者是31天内再次入院！');
    }

    return { record, errors, warnings };
  }

  /** 对齐 PB vu_basy_jbxx.uf_vidify_cy（内存合并，不写库） */
  private async applyVidifyCy(
    record: Partial<N0421>,
    zyid: string,
  ): Promise<Partial<N0421>> {
    const merged: Partial<N0421> = { ...record };

    if (Number(merged.sjbz ?? 0) === 1) {
      return merged;
    }

    const brxxRows: {
      rysj?: Date | string | null;
      cysj?: Date | string | null;
      bahm?: string | null;
      zybh?: string | null;
      ryzd?: string | null;
      zycs?: number | null;
      hbh?: string | null;
      sfzh?: string | null;
      sfdm?: string | null;
      sjdm?: string | null;
      jgdm?: string | null;
      xjdm?: string | null;
      gg1?: string | null;
      gg2?: string | null;
      gg3?: string | null;
    }[] = await this.dataSource.query(
      `
      SELECT rysj, cysj, ISNULL(bahm, '') AS bahm, ISNULL(zybh, '') AS zybh,
             ryzd, zycs, hbh, sfzh,
             ISNULL(sfdm, '') AS sfdm, ISNULL(sjdm, '') AS sjdm,
             ISNULL(jgdm, '') AS jgdm, ISNULL(xjdm, '') AS xjdm,
             ISNULL(GG1, '') AS gg1, ISNULL(GG2, '') AS gg2, ISNULL(GG3, '') AS gg3
      FROM dbo.h11_brxx
      WHERE zyid = @0
      `,
      [zyid],
    );
    const brxx = brxxRows?.[0];
    if (!brxx) return merged;

    const rysj = toDate(brxx.rysj);
    const cysj = toDate(brxx.cysj);
    let ryzd = trim(brxx.ryzd);
    let ryzdmc = '';
    const icdRows: { zwmc?: string }[] = await this.dataSource.query(
      `SELECT TOP 1 ISNULL(zwmc, '') AS zwmc FROM dbo.__jbbmicd10 WHERE bzbm = @0`,
      [ryzd],
    );
    ryzdmc = trim(icdRows?.[0]?.zwmc);
    if (ryzdmc === '') {
      ryzdmc = ryzd;
      ryzd = '';
    }

    let hbh = trim(brxx.hbh);
    if (hbh.length > 18) hbh = '';

    if (cysj && rysj) {
      let days = daysBetween(rysj, cysj);
      if (days === 0) days = 1;
      merged.cysj = cysj;
      merged.cysj_s = cysj.getHours();
      merged.sjzy = String(days);

      const zkrq = toDate(merged.zkrq);
      const zkrqStr = zkrq ? zkrq.toISOString().slice(0, 10) : '';
      if (!zkrq || zkrqStr === '1900-01-01') {
        merged.zkrq = addDays(cysj, 1);
      }
    } else if (cysj) {
      merged.cysj = cysj;
      merged.cysj_s = cysj.getHours();
    }

    merged.zycs = brxx.zycs ?? merged.zycs;
    merged.bah = trim(brxx.bahm) || merged.bah;
    merged.zybh = trim(brxx.zybh) || merged.zybh;
    merged.jkkh = hbh;
    merged.sfzh = trim(brxx.sfzh) || merged.sfzh;

    if (isBlank(merged.ryzdmc)) {
      merged.ryzdmc = ryzdmc;
      merged.ryzdicd = ryzd;
    }

    const sfdm = trim(brxx.sfdm);
    const sjdm = trim(brxx.sjdm);
    const jgdm = trim(brxx.jgdm);
    const xjdm = trim(brxx.xjdm);
    if (isBlank(merged.csd1) && sfdm) merged.csd1 = sfdm;
    if (isBlank(merged.csd2) && sjdm) merged.csd2 = sjdm;
    if (isBlank(merged.csd3) && (jgdm || xjdm)) merged.csd3 = jgdm || xjdm;
    if (isBlank(merged.gg1) && (trim(brxx.gg1) || sfdm)) {
      merged.gg1 = trim(brxx.gg1) || sfdm;
    }
    if (isBlank(merged.gg2) && (trim(brxx.gg2) || sjdm)) {
      merged.gg2 = trim(brxx.gg2) || sjdm;
    }
    if (isBlank(merged.gg3) && (trim(brxx.gg3) || jgdm)) {
      merged.gg3 = trim(brxx.gg3) || jgdm;
    }

    const nursing = await this.calcNursingDays(zyid);
    if (Number(merged.thl ?? 0) === 0 && nursing.thl > 0) merged.thl = nursing.thl;
    if (Number(merged.yhl ?? 0) === 0 && nursing.yhl > 0) merged.yhl = nursing.yhl;
    if (Number(merged.ehl ?? 0) === 0 && nursing.ehl > 0) merged.ehl = nursing.ehl;
    if (Number(merged.shl ?? 0) === 0 && nursing.shl > 0) merged.shl = nursing.shl;

    return merged;
  }

  private async calcNursingDays(zyid: string): Promise<{
    thl: number;
    yhl: number;
    ehl: number;
    shl: number;
  }> {
    const querySum = async (qt1Condition: string): Promise<number> => {
      const rows: { total?: number | null }[] = await this.dataSource.query(
        `
        SELECT SUM((zxcs - bzxcs) * jfyl) AS total
        FROM dbo.h13_yzzxcs, dbo.h00_xmzd
        WHERE h13_yzzxcs.zyid = @0
          AND h13_yzzxcs.xmid = h00_xmzd.xmid
          AND ${qt1Condition}
        `,
        [zyid],
      );
      return Number(rows?.[0]?.total ?? 0) || 0;
    };

    let thl = await querySum(`ISNULL(h00_xmzd.qt1, '') = '4'`);
    let yhl = await querySum(`ISNULL(h00_xmzd.qt1, '') = '1'`);
    let ehl = await querySum(`ISNULL(h00_xmzd.qt1, '') IN ('2','5','6')`);
    let shl = await querySum(`ISNULL(h00_xmzd.qt1, '') = '3'`);

    const zysytsbz = await this.paramService.gfGetParaNew(
      12,
      'zysyts',
      '1',
      '病案首页护理天数小时转换(0否,1是)',
    );
    if (zysytsbz === '0') {
      thl = Math.round(thl / 24);
      yhl = Math.round(yhl / 24);
      ehl = Math.round(ehl / 24);
      shl = Math.round(shl / 24);
    }

    return { thl, yhl, ehl, shl };
  }
}
