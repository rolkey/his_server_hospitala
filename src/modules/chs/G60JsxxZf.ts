import { Column, Entity, Index } from 'typeorm';

@Entity('G60_JSXX_ZF', { schema: 'dbo' })
export class G60JsxxZf {
  @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  lsh: string;

  @Column('varchar', { primary: true, name: 'lshxh', length: 20 })
  lshxh: string;

  @Column('varchar', { name: 'mdtrt_id', nullable: true, length: 30 })
  mdtrt_id: string | null;

  @Column('varchar', { primary: true, name: 'setl_id', length: 30 })
  setl_id: string;

  @Column('varchar', { name: 'psn_no', nullable: true, length: 30 })
  psn_no: string | null;

  @Column('varchar', { name: 'psn_name', nullable: true, length: 50 })
  psn_name: string | null;

  @Column('varchar', { name: 'psn_cert_type', nullable: true, length: 6 })
  psn_cert_type: string | null;

  @Column('varchar', { name: 'certno', nullable: true, length: 50 })
  certno: string | null;

  @Column('varchar', { name: 'gend', nullable: true, length: 6 })
  gend: string | null;

  @Column('varchar', { name: 'naty', nullable: true, length: 3 })
  naty: string | null;

  @Column('date', { name: 'brdy', nullable: true })
  brdy: Date | null;

  @Column('int', { name: 'age', nullable: true })
  age: number | null;

  @Column('varchar', { name: 'insutype', nullable: true, length: 6 })
  insutype: string | null;

  @Column('varchar', { name: 'psn_type', nullable: true, length: 6 })
  psn_type: string | null;

  @Column('varchar', { name: 'cvlserv_flag', nullable: true, length: 3 })
  cvlserv_flag: string | null;

  @Column('datetime', { name: 'setl_time', nullable: true })
  setl_time: Date | null;

  @Column('varchar', { name: 'mdtrt_cert_type', nullable: true, length: 6 })
  mdtrt_cert_type: string | null;

  @Column('varchar', { name: 'med_type', nullable: true, length: 10 })
  med_type: string | null;

  @Column('decimal', {
    name: 'medfee_sumamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  medfee_sumamt: number | null;

  @Column('decimal', {
    name: 'fulamt_ownpay_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  fulamt_ownpay_amt: number | null;

  @Column('decimal', {
    name: 'overlmt_selfpay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  overlmt_selfpay: number | null;

  @Column('decimal', {
    name: 'preselfpay_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  preselfpay_amt: number | null;

  @Column('decimal', {
    name: 'inscp_scp_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  inscp_scp_amt: number | null;

  @Column('decimal', {
    name: 'act_pay_dedc',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  act_pay_dedc: number | null;

  @Column('decimal', {
    name: 'hifp_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  hifp_pay: number | null;

  @Column('decimal', {
    name: 'pool_prop_selfpay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  pool_prop_selfpay: number | null;

  @Column('decimal', {
    name: 'cvlserv_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  cvlserv_pay: number | null;

  @Column('decimal', {
    name: 'hifes_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  hifes_pay: number | null;

  @Column('decimal', {
    name: 'hifmi_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  hifmi_pay: number | null;

  @Column('decimal', {
    name: 'hifob_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  hifob_pay: number | null;

  @Column('decimal', {
    name: 'maf_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  maf_pay: number | null;

  @Column('decimal', {
    name: 'oth_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  oth_pay: number | null;

  @Column('decimal', {
    name: 'fund_pay_sumamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  fund_pay_sumamt: number | null;

  @Column('decimal', {
    name: 'psn_part_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  psn_part_amt: number | null;

  @Column('decimal', {
    name: 'acct_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  acct_pay: number | null;

  @Column('decimal', {
    name: 'psn_cash_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  psn_cash_pay: number | null;

  @Column('decimal', {
    name: 'hosp_part_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  hosp_part_amt: number | null;

  @Column('decimal', { name: 'balc', nullable: true, precision: 16, scale: 2 })
  balc: number | null;

  @Column('decimal', {
    name: 'acct_mulaid_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  acct_mulaid_pay: number | null;

  @Column('varchar', { name: 'medins_setl_id', nullable: true, length: 30 })
  medins_setl_id: string | null;

  @Column('varchar', { name: 'clr_optins', nullable: true, length: 6 })
  clr_optins: string | null;

  @Column('varchar', { name: 'clr_way', nullable: true, length: 6 })
  clr_way: string | null;

  @Column('varchar', { name: 'clr_type', nullable: true, length: 6 })
  clr_type: string | null;

  @Column('decimal', {
    name: 'hifdm_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  hifdm_pay: number | null;

  @Column('decimal', {
    name: 'unif_pay_std',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  unif_pay_std: number | null;

  @Column('decimal', {
    name: 'unif_pay_blnc',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  unif_pay_blnc: number | null;

  @Column('decimal', {
    name: 'bkst_safeg_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  bkst_safeg_amt: number | null;

  @Column('decimal', {
    name: 'fin_subs',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  fin_subs: number | null;

  @Column('decimal', {
    name: 'care_subs',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  care_subs: number | null;

  @Column('decimal', {
    name: 'insu_cmpy_name',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  insu_cmpy_name: number | null;

  @Column('decimal', {
    name: 'comp_sum_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  comp_sum_amt: number | null;

  @Column('varchar', { name: 'comp_dscr', nullable: true, length: 1000 })
  comp_dscr: string | null;

  @Column('varchar', { name: 'comp_fail_rea', nullable: true, length: 1000 })
  comp_fail_rea: string | null;

  @Column('decimal', {
    name: 'bas_sec_pool_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  bas_sec_pool_lmt: number | null;

  @Column('decimal', {
    name: 'mihisec_pool_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  mihisec_pool_lmt: number | null;

  @Column('decimal', {
    name: 'comn_otp_year_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  comn_otp_year_lmt: number | null;

  @Column('decimal', {
    name: 'comn_otp_mon_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  comn_otp_mon_lmt: number | null;

  @Column('decimal', {
    name: 'comn_otp_day_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  comn_otp_day_lmt: number | null;

  @Column('decimal', {
    name: 'comn_otp_cnt_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  comn_otp_cnt_lmt: number | null;

  @Column('decimal', {
    name: 'chrdise_otp_year_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  chrdise_otp_year_lmt: number | null;

  @Column('decimal', {
    name: 'chrdise_otp_quat_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  chrdise_otp_quat_lmt: number | null;

  @Column('decimal', {
    name: 'chrdise_otp_mon_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  chrdise_otp_mon_lmt: number | null;

  @Column('decimal', {
    name: 'chrdise_lmt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  chrdise_lmt: number | null;

  @Column('decimal', {
    name: 'cvlserv_acct_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  cvlserv_acct_pay: number | null;

  @Column('decimal', {
    name: 'oth_subs',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  oth_subs: number | null;

  @Column('decimal', {
    name: 'bas_sev_inpool_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  bas_sev_inpool_amt: number | null;

  @Column('decimal', {
    name: 'mihisec_inpool_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  mihisec_inpool_amt: number | null;

  @Column('varchar', { name: 'fund_pay_type', nullable: true, length: 6 })
  fund_pay_type: string | null;

  @Column('decimal', {
    name: 'crt_payb_lmt_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  crt_payb_lmt_amt: number | null;

  @Column('decimal', {
    name: 'fund_payamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  fund_payamt: number | null;

  @Column('varchar', {
    name: 'fund_pay_type_name',
    nullable: true,
    length: 200,
  })
  fund_pay_type_name: string | null;

  @Column('varchar', { name: 'setl_proc_info', nullable: true, length: 4000 })
  setl_proc_info: string | null;

  @Column('varchar', { name: 'insu_admdvs', nullable: true, length: 20 })
  insu_admdvs: string | null;

  @Column('decimal', {
    name: 'psn_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  psn_pay: number | null;

  @Column('decimal', {
    name: 'cashPayamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  cashPayamt: number | null;

  @Column('decimal', {
    name: 'dedc_std',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  dedc_std: number | null;

  @Column('decimal', {
    name: 'setl_type',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  setl_type: number | null;

  @Column('decimal', {
    name: 'crt_dedc',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  crt_dedc: number | null;

  @Column('decimal', {
    name: 'invono',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  invono: number | null;

  @Column('datetime', { name: 'enddate', nullable: true })
  enddate: Date | null;

  @Column('decimal', {
    name: 'othfund_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  othfund_pay: number | null;

  @Column('varchar', { name: 'mdtrt_cert_no', nullable: true, length: 30 })
  mdtrt_cert_no: string | null;

  @Column('decimal', {
    name: 'ownpay_hosp_part',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  ownpay_hosp_part: number | null;

  @Column('decimal', {
    name: 'inscp_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  inscp_amt: number | null;

  @Column('varchar', { name: 'psn_insu_rlts_id', nullable: true, length: 30 })
  psn_insu_rlts_id: string | null;

  @Column('varchar', { name: 'czry', nullable: true, length: 10 })
  czry: string | null;

  @Column('varchar', { name: 'hsry', nullable: true, length: 10 })
  hsry: string | null;

  @Column('varchar', { name: 'insuplc_admdvs', nullable: true, length: 10 })
  insuplc_admdvs: string | null;

  @Column('varchar', { name: 'mdtrtarea_admvs', nullable: true, length: 10 })
  mdtrtarea_admvs: string | null;

  @Column('varchar', { name: 'fixmedins_code', nullable: true, length: 20 })
  fixmedins_code: string | null;

  @Column('varchar', { name: 'fixmedins_name', nullable: true, length: 20 })
  fixmedins_name: string | null;

  @Column('varchar', { name: 'transaction_type', nullable: true, length: 10 })
  transaction_type: string | null;

  @Column('varchar', { name: 'begndate', nullable: true, length: 20 })
  begndate: string | null;

  @Column('varchar', { name: 'exp_content', nullable: true, length: 250 })
  exp_content: string | null;

  @Column('varchar', { name: 'expcontent', nullable: true, length: 100 })
  expcontent: string | null;

  @Column('decimal', {
    name: 'hi_agre_sumfee',
    nullable: true,
    precision: 12,
    scale: 4,
    default: () => '(0)',
  })
  hi_agre_sumfee: number | null;

  @Column('varchar', { name: 'invobo', nullable: true, length: 30 })
  invobo: string | null;

  @Column('varchar', { name: 'stmt_rslt', nullable: true, length: 6 })
  stmt_rslt: string | null;

  @Column('int', { name: 'yxbz', nullable: true, default: () => '(1)' })
  yxbz: number | null;

  @Column('varchar', { name: 'fyid', nullable: true, length: 10 })
  fyid: string | null;

  @Column('decimal', {
    name: 'wltpay_amt',
    nullable: true,
    precision: 16,
    scale: 4,
    default: () => '(0)',
  })
  wltpay_amt: number | null;
}
