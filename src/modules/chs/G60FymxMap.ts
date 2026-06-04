import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
// import { h00_xmzd } from '../h00_xmzd/h00_xmzd.entity';

@Entity('G60_fymx', { schema: 'dbo' })
export class G60FymxMap {
  // @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  // lsh: string;

  // @Column('varchar', { primary: true, name: 'mxxh', length: 20 })
  // mxxh: string;

  // @Column('varchar', { primary: true, name: 'lshxh', length: 20 })
  // lshxh: string;

  // @Column('varchar', { name: 'setl_id', nullable: true, length: 30 })
  // setl_id: string | null;

  @Column('varchar', { primary: true, name: 'feedetl_sn', length: 30 })
  feedetl_sn: string;

  // @Column('decimal', {
  //   name: 'det_item_fee_sumamt',
  //   nullable: true,
  //   precision: 16,
  //   scale: 4,
  // })
  // det_item_fee_sumamt: number | null;

  // @Column('decimal', { name: 'cnt', nullable: true, precision: 16, scale: 4 })
  // cnt: number | null;

  // @Column('decimal', { name: 'pric', nullable: true, precision: 16, scale: 6 })
  // pric: number | null;

  // @Column('decimal', {
  //   name: 'pric_uplmt_amt',
  //   nullable: true,
  //   precision: 16,
  //   scale: 6,
  // })
  // pric_uplmt_amt: number | null;

  // @Column('decimal', {
  //   name: 'selfpay_prop',
  //   nullable: true,
  //   precision: 16,
  //   scale: 4,
  // })
  // selfpay_prop: number | null;

  @Column('decimal', {
    name: 'fulamt_ownpay_amt',
    nullable: true,
    precision: 16,
    scale: 4,
  })
  fulamt_ownpay_amt: number | null;

  @Column('decimal', {
    name: 'overlmt_amt',
    nullable: true,
    precision: 16,
    scale: 4,
  })
  overlmt_amt: number | null;

  @Column('decimal', {
    name: 'preselfpay_amt',
    nullable: true,
    precision: 16,
    scale: 4,
  })
  preselfpay_amt: number | null;

  @Column('decimal', {
    name: 'inscp_scp_amt',
    nullable: true,
    precision: 16,
    scale: 4,
  })
  inscp_scp_amt: number | null;

  // @Column('varchar', { name: 'chrgitm_lv', nullable: true, length: 3 })
  // chrgitm_lv: string | null;

  // @Column('varchar', { name: 'med_chrgitm_type', nullable: true, length: 6 })
  // med_chrgitm_type: string | null;

  // @Column('varchar', { name: 'bas_medn_flag', nullable: true, length: 3 })
  // bas_medn_flag: string | null;

  // @Column('varchar', { name: 'hi_nego_drug_flag', nullable: true, length: 3 })
  // hi_nego_drug_flag: string | null;

  // @Column('varchar', { name: 'chld_medc_flag', nullable: true, length: 3 })
  // chld_medc_flag: string | null;

  // @Column('varchar', { name: 'list_sp_item_flag', nullable: true, length: 3 })
  // list_sp_item_flag: string | null;

  // @Column('varchar', { name: 'lmt_used_flag', nullable: true, length: 3 })
  // lmt_used_flag: string | null;

  // @Column('varchar', { name: 'drt_reim_flag', nullable: true, length: 3 })
  // drt_reim_flag: string | null;

  // @Column('varchar', { name: 'memo', nullable: true, length: 200 })
  // memo: string | null;

  // @Column('varchar', { name: 'bz1', nullable: true, length: 30 })
  // bz1: string | null;

  // @Column('varchar', { name: 'bz2', nullable: true, length: 30 })
  // bz2: string | null;

  // @Column('varchar', { name: 'bz3', nullable: true, length: 30 })
  // bz3: string | null;

  // @Column('varchar', { name: 'bz4', nullable: true, length: 30 })
  // bz4: string | null;

  // @Column('varchar', { name: 'bz5', nullable: true, length: 30 })
  // bz5: string | null;

  // @Column('varchar', { name: 'succ_flag', nullable: true, length: 10 })
  // succ_flag: string | null;

  // @Column('varchar', { name: 'prm_msg', nullable: true, length: 50 })
  // prm_msg: string | null;

  // @Column('varchar', { name: 'exp_content', nullable: true, length: 250 })
  // exp_content: string | null;

  // @ManyToOne(() => h00_xmzd)
  // @JoinColumn({ name: 'bz2', referencedColumnName: 'xmid' })
  // h00_xmzdEntity: h00_xmzd;
}
