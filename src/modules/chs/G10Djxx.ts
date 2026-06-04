import { DateTransformer } from '@/common/transformers/date.transformer';
import { Column, Entity, Index } from 'typeorm';

@Index('g10_djxx_setl_id', ['setl_id'], {})
@Index('PK_G10_DJXX_1', ['lsh', 'lshxh'], { unique: true })
@Entity('G10_DJXX', { schema: 'dbo' })
export class G10Djxx {
  @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  lsh: string;

  @Column('varchar', { primary: true, name: 'lshxh', length: 20 })
  lshxh: string;

  @Column('smallint', { name: 'jsbz', nullable: true, default: () => '(1)' })
  jsbz: number | null;

  @Column('varchar', { name: 'setl_id', nullable: true, length: 30 })
  setl_id: string | null;

  @Column('varchar', { name: 'jsxh', nullable: true, length: 20 })
  jsxh: string | null;

  @Column('varchar', { name: 'jzlx', nullable: true, length: 2 })
  jzlx: string | null;

  @Column('varchar', { name: 'msig', nullable: true, length: 30 })
  msig: string | null;

  @Column('varchar', { name: 'brxm', nullable: true, length: 20 })
  brxm: string | null;

  @Column('varchar', { name: 'sfzh', nullable: true, length: 20 })
  sfzh: string | null;

  @Column('varchar', { name: 'psn_no', nullable: true, length: 30 })
  psn_no: string | null;

  @Column('varchar', { name: 'insutype', nullable: true, length: 6 })
  insutype: string | null;

  @DateTransformer()
  @Column('datetime', { name: 'begntime', nullable: true })
  begntime: Date | null;

  @Column('varchar', { name: 'mdtrt_cert_type', nullable: true, length: 3 })
  mdtrt_cert_type: string | null;

  @Column('varchar', { name: 'mdtrt_cert_no', nullable: true, length: 50 })
  mdtrt_cert_no: string | null;

  @Column('varchar', { name: 'ipt_otp_no', nullable: true, length: 30 })
  ipt_otp_no: string | null;

  @Column('varchar', { name: 'atddr_no', nullable: true, length: 30 })
  atddr_no: string | null;

  @Column('varchar', { name: 'dr_name', nullable: true, length: 50 })
  dr_name: string | null;

  @Column('varchar', { name: 'dept_code', nullable: true, length: 30 })
  dept_code: string | null;

  @Column('varchar', { name: 'dept_name', nullable: true, length: 100 })
  dept_name: string | null;

  @Column('varchar', { name: 'caty', nullable: true, length: 6 })
  caty: string | null;

  @Column('varchar', { name: 'mdtrt_id', nullable: true, length: 30 })
  mdtrt_id: string | null;

  @Column('varchar', { name: 'med_type', nullable: true, length: 6 })
  med_type: string | null;

  @Column('varchar', { name: 'main_cond_dscr', nullable: true, length: 1000 })
  main_cond_dscr: string | null;

  @Column('varchar', { name: 'dise_codg', nullable: true, length: 30 })
  dise_codg: string | null;

  @Column('varchar', { name: 'dise_name', nullable: true, length: 500 })
  dise_name: string | null;

  @Column('varchar', { name: 'birctrl_type', nullable: true, length: 6 })
  birctrl_type: string | null;

  @Column('datetime', { name: 'birctrl_mat', nullable: true })
  birctrl_mat: Date | null;

  @Column('numeric', { name: 'medfee_sumamt', nullable: true, precision: 18, scale: 2 })
  medfee_sumamt: number | null;

  @Column('varchar', { name: 'psn_setlway', nullable: true, length: 30 })
  psn_setlway: string | null;

  @Column('varchar', { name: 'chrg_bchno', nullable: true, length: 1 })
  chrg_bchno: string | null;

  @Column('varchar', { name: 'acct_used_flag', nullable: true, length: 6 })
  acct_used_flag: string | null;

  @Column('numeric', { name: 'acct_payamt', nullable: true, precision: 16, scale: 2 })
  acct_payamt: number | null;

  @Column('varchar', { name: 'invono', nullable: true, length: 20 })
  invono: string | null;

  @Column('numeric', { name: 'fulamt_ownpay_amt', nullable: true, precision: 16, scale: 2 })
  fulamt_ownpay_amt: number | null;

  @Column('numeric', { name: 'overlmt_selfpay', nullable: true, precision: 16, scale: 2 })
  overlmt_selfpay: number | null;

  @Column('numeric', { name: 'preselfpay_amt', nullable: true, precision: 16, scale: 2 })
  preselfpay_amt: number | null;

  @Column('numeric', { name: 'inscp_scp_amt', nullable: true, precision: 16, scale: 2 })
  inscp_scp_amt: number | null;

  @Column('varchar', { name: 'cardtoken', nullable: true, length: 50 })
  cardtoken: string | null;

  @Column('varchar', { name: 'elec_bill_code', nullable: true, length: 50 })
  elec_bill_code: string | null;

  @Column('varchar', { name: 'elec_billno_code', nullable: true, length: 50 })
  elec_billno_code: string | null;

  @Column('varchar', { name: 'elec_bill_chkcode', nullable: true, length: 6 })
  elec_bill_chkcode: string | null;

  @Column('varchar', { name: 'coner_name', nullable: true, length: 50 })
  coner_name: string | null;

  @Column('varchar', { name: 'tel', nullable: true, length: 50 })
  tel: string | null;

  @Column('varchar', { name: 'medrcdno', nullable: true, length: 30 })
  medrcdno: string | null;

  @Column('varchar', { name: 'adm_diag_dscr', nullable: true, length: 200 })
  adm_diag_dscr: string | null;

  @Column('varchar', { name: 'adm_dept_codg', nullable: true, length: 30 })
  adm_dept_codg: string | null;

  @Column('varchar', { name: 'adm_dept_name', nullable: true, length: 100 })
  adm_dept_name: string | null;

  @Column('varchar', { name: 'adm_bed', nullable: true, length: 30 })
  adm_bed: string | null;

  @Column('varchar', { name: 'dscg_maindiag_code', nullable: true, length: 20 })
  dscg_maindiag_code: string | null;

  @Column('varchar', { name: 'dscg_maindiag_name', nullable: true, length: 200 })
  dscg_maindiag_name: string | null;

  @Column('varchar', { name: 'oprn_oprt_code', nullable: true, length: 30 })
  oprn_oprt_code: string | null;

  @Column('varchar', { name: 'oprn_oprt_name', nullable: true, length: 200 })
  oprn_oprt_name: string | null;

  @Column('varchar', { name: 'fpsc_no', nullable: true, length: 50 })
  fpsc_no: string | null;

  @Column('varchar', { name: 'matn_type', nullable: true, length: 6 })
  matn_type: string | null;

  @Column('varchar', { name: 'latechb_flag', nullable: true, length: 6 })
  latechb_flag: string | null;

  @Column('numeric', { name: 'geso_val', nullable: true, precision: 10, scale: 1 })
  geso_val: number | null;

  @Column('numeric', { name: 'fetts', nullable: true, precision: 10, scale: 1 })
  fetts: number | null;

  @Column('numeric', { name: 'fetus_cnt', nullable: true, precision: 10, scale: 1 })
  fetus_cnt: number | null;

  @Column('varchar', { name: 'pret_flag', nullable: true, length: 3 })
  pret_flag: string | null;

  @Column('datetime', { name: 'birctrl_matn_date', nullable: true })
  birctrl_matn_date: Date | null;

  @Column('varchar', { name: 'dise_type_code', nullable: true, length: 6 })
  dise_type_code: string | null;

  @Column('varchar', { name: 'sin_dise_codg', nullable: true, length: 30 })
  sin_dise_codg: string | null;

  @Column('varchar', { name: 'cla_trt_flag', nullable: true, length: 3 })
  cla_trt_flag: string | null;

  @Column('varchar', { name: 'unif_pay_std_type', nullable: true, length: 3 })
  unif_pay_std_type: string | null;

  @Column('varchar', { name: 'bydise_setl_disediag_codg', nullable: true, length: 50 })
  bydise_setl_disediag_codg: string | null;

  @Column('varchar', { name: 'bydise_setl_oprn_oprt_code', nullable: true, length: 50 })
  bydise_setl_oprn_oprt_code: string | null;

  @Column('varchar', { name: 'trum_flag', nullable: true, length: 3 })
  trum_flag: string | null;

  @Column('varchar', { name: 'medcasno', nullable: true, length: 40 })
  medcasno: string | null;

  @Column('varchar', { name: 'ipt_type', nullable: true, length: 3 })
  ipt_type: string | null;

  @Column('varchar', { name: 'rel_ttp_flag', nullable: true, length: 3 })
  rel_ttp_flag: string | null;

  @Column('varchar', { name: 'mdtrt_grp_type', nullable: true, length: 6 })
  mdtrt_grp_type: string | null;

  @Column('datetime', { name: 'endtime', nullable: true })
  endtime: Date | null;

  @Column('varchar', { name: 'cop_flag', nullable: true, length: 3 })
  cop_flag: string | null;

  @Column('varchar', { name: 'dscg_dept_codg', nullable: true, length: 30 })
  dscg_dept_codg: string | null;

  @Column('varchar', { name: 'dscg_dept_name', nullable: true, length: 30 })
  dscg_dept_name: string | null;

  @Column('varchar', { name: 'dscg_bed', nullable: true, length: 30 })
  dscg_bed: string | null;

  @Column('varchar', { name: 'dscg_way', nullable: true, length: 3 })
  dscg_way: string | null;

  @Column('datetime', { name: 'die_date', nullable: true })
  die_date: Date | null;

  @Column('varchar', { name: 'mid_setl_flag', nullable: true, length: 3 })
  mid_setl_flag: string | null;

  @Column('datetime', { name: 'jssj', nullable: true })
  jssj: Date | null;

  @Column('numeric', { name: 'hifp_pay', nullable: true, precision: 16, scale: 2 })
  hifp_pay: number | null;

  @Column('numeric', { name: 'cvlserv_pay', nullable: true, precision: 16, scale: 2 })
  cvlserv_pay: number | null;

  @Column('numeric', { name: 'hifes_pay', nullable: true, precision: 16, scale: 2 })
  hifes_pay: number | null;

  @Column('numeric', { name: 'hifmi_pay', nullable: true, precision: 16, scale: 2 })
  hifmi_pay: number | null;

  @Column('numeric', { name: 'hifob_pay', nullable: true, precision: 16, scale: 2 })
  hifob_pay: number | null;

  @Column('numeric', { name: 'maf_pay', nullable: true, precision: 16, scale: 2 })
  maf_pay: number | null;

  @Column('numeric', { name: 'hosp_part_amt', nullable: true, precision: 16, scale: 2 })
  hosp_part_amt: number | null;

  @Column('numeric', { name: 'oth_pay', nullable: true, precision: 16, scale: 2 })
  oth_pay: number | null;

  @Column('numeric', { name: 'fund_pay_sumamt', nullable: true, precision: 16, scale: 2 })
  fund_pay_sumamt: number | null;

  @Column('numeric', { name: 'psn_part_amt', nullable: true, precision: 16, scale: 2 })
  psn_part_amt: number | null;

  @Column('numeric', { name: 'acct_pay', nullable: true, precision: 16, scale: 2 })
  acct_pay: number | null;

  @Column('numeric', { name: 'psn_cash_pay', nullable: true, precision: 16, scale: 2 })
  psn_cash_pay: number | null;

  @Column('numeric', { name: 'balc', nullable: true, precision: 16, scale: 2 })
  balc: number | null;

  @Column('varchar', { name: 'czry', nullable: true, length: 10 })
  czry: string | null;

  @Column('varchar', { name: 'shry', nullable: true, length: 10 })
  shry: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 30 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 30 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 30 })
  bz3: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 30 })
  bz4: string | null;

  @Column('varchar', { name: 'bz5', nullable: true, length: 30 })
  bz5: string | null;

  @Column('varchar', { name: 'medins_setl_id', nullable: true, length: 30 })
  medins_setl_id: string | null;

  @Column('varchar', { name: 'psn_type', nullable: true, length: 12 })
  psn_type: string | null;

  @Column('decimal', {
    name: 'act_pay_dedc',
    nullable: true,
    precision: 12,
    scale: 4,
    default: () => '(0)',
  })
  act_pay_dedc: number | null;

  @Column('decimal', {
    name: 'pool_prop_selfpay',
    nullable: true,
    precision: 12,
    scale: 4,
    default: () => '(0)',
  })
  pool_prop_selfpay: number | null;

  @Column('decimal', {
    name: 'acct_mulaid_pay',
    nullable: true,
    precision: 12,
    scale: 4,
    default: () => '(0)',
  })
  acct_mulaid_pay: number | null;

  @Column('varchar', { name: 'clr_optins', nullable: true, length: 12 })
  clr_optins: string | null;

  @Column('varchar', { name: 'clr_way', nullable: true, length: 12 })
  clr_way: string | null;

  @Column('varchar', { name: 'clr_type', nullable: true, length: 12 })
  clr_type: string | null;

  @Column('varchar', { name: 'lxdz', nullable: true, length: 80 })
  lxdz: string | null;

  @Column('varchar', { name: 'dzbz', nullable: true, length: 2 })
  dzbz: string | null;

  @Column('varchar', { name: 'qt1', nullable: true, length: 10 })
  qt1: string | null;

  @Column('varchar', { name: 'qt2', nullable: true, length: 20 })
  qt2: string | null;

  @Column('varchar', { name: 'qt3', nullable: true, length: 20 })
  qt3: string | null;

  @Column('decimal', {
    name: 'hifdm_pay',
    nullable: true,
    precision: 16,
    scale: 4,
    default: () => '(0)',
  })
  hifdm_pay: number | null;

  @Column('varchar', { name: 'zt1', nullable: true, length: 10 })
  zt1: string | null;

  @Column('varchar', { name: 'fyid', nullable: true, length: 10 })
  fyid: string | null;

  @Column('varchar', { name: 'qbbz', nullable: true, length: 1 })
  qbbz: string | null;

  @Column('decimal', {
    name: 'wltpay_amt',
    nullable: true,
    precision: 16,
    scale: 4,
    default: () => '(0)',
  })
  wltpay_amt: number | null;

  med_type_name: string | null;
}
