import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'N04_23', schema: 'dbo' })
export class N04_23 {
  @PrimaryColumn({ type: 'varchar', name: 'zyid', length: 12, collation: 'Chinese_PRC_CI_AS' })
  zyid: string;

  @PrimaryColumn({ type: 'decimal', name: 'ssxh', precision: 18, scale: 0 })
  ssxh: number;

  @Column({
    type: 'varchar',
    name: 'ssjczbm',
    length: 30,
    nullable: true,
  })
  ssjczbm: string;

  @Column({ type: 'datetime', name: 'ssjczrq', nullable: true, precision: 3 })
  ssjczrq: Date;

  @Column({
    type: 'varchar',
    name: 'shjb',
    length: 10,
    nullable: true,
  })
  shjb: string;

  @Column({
    type: 'varchar',
    name: 'ssjczmc',
    length: 60,
    nullable: true,
  })
  ssjczmc: string;

  @Column({
    type: 'varchar',
    name: 'sz',
    length: 10,
    nullable: true,
  })
  sz: string;

  @Column({
    type: 'varchar',
    name: 'yz',
    length: 10,
    nullable: true,
  })
  yz: string;

  @Column({
    type: 'varchar',
    name: 'ez',
    length: 10,
    nullable: true,
  })
  ez: string;

  @Column({
    type: 'varchar',
    name: 'qkdj',
    length: 10,
    nullable: true,
  })
  qkdj: string;

  @Column({
    type: 'varchar',
    name: 'qkylb',
    length: 10,
    nullable: true,
  })
  qkylb: string;

  @Column({
    type: 'varchar',
    name: 'mzfs',
    length: 10,
    nullable: true,
  })
  mzfs: string;

  @Column({
    type: 'varchar',
    name: 'mzys',
    length: 10,
    nullable: true,
  })
  mzys: string;

  @Column({
    type: 'varchar',
    name: 'bzxx',
    length: 30,
    nullable: true,
  })
  bzxx: string;

  @Column({
    type: 'varchar',
    name: 'bzxx1',
    length: 30,
    nullable: true,
  })
  bzxx1: string;

  @Column({ type: 'int', name: 'sjbz', nullable: true, default: 0 })
  sjbz: number;

  @Column({
    type: 'varchar',
    name: 'oprn_oper_part_code',
    length: 30,
    nullable: true,
  })
  oprn_oper_part_code: string;

  @Column({
    type: 'varchar',
    name: 'oprn_con_time',
    length: 10,
    nullable: true,
  })
  oprn_con_time: string;

  @Column({
    type: 'varchar',
    name: 'anst_lv_code',
    length: 30,
    nullable: true,
  })
  anst_lv_code: string;

  @Column({
    type: 'varchar',
    name: 'oprn_optn_part_code',
    length: 30,
    nullable: true,
  })
  oprn_optn_part_code: string;

  @Column({
    type: 'varchar',
    name: 'main_oprn_flag',
    length: 30,
    nullable: true,
  })
  main_oprn_flag: string;

  @Column({
    type: 'varchar',
    name: 'anst_asa_lv_code',
    length: 30,
    nullable: true,
  })
  anst_asa_lv_code: string;

  @Column({
    type: 'varchar',
    name: 'anst_medn_code',
    length: 50,
    nullable: true,
  })
  anst_medn_code: string;

  @Column({
    type: 'varchar',
    name: 'anst_medn_dos',
    length: 20,
    nullable: true,
  })
  anst_medn_dos: string;

  @Column({
    type: 'varchar',
    name: 'unt',
    length: 10,
    nullable: true,
  })
  unt: string;

  @Column({ type: 'datetime', name: 'anst_begntime', nullable: true, precision: 3 })
  anst_begntime: Date;

  @Column({ type: 'datetime', name: 'anst_endtime', nullable: true, precision: 3 })
  anst_endtime: Date;

  @Column({
    type: 'varchar',
    name: 'anst_copn_code',
    length: 30,
    nullable: true,
  })
  anst_copn_code: string;

  @Column({
    type: 'varchar',
    name: 'anst_copn_dscr',
    length: 200,
    nullable: true,
  })
  anst_copn_dscr: string;

  @Column({ type: 'datetime', name: 'pacu_begntime', nullable: true, precision: 3 })
  pacu_begntime: Date;

  @Column({ type: 'datetime', name: 'pacu_endtime', nullable: true, precision: 3 })
  pacu_endtime: Date;

  @Column({
    type: 'varchar',
    name: 'canc_oprn_flag',
    length: 3,
    nullable: true,
  })
  canc_oprn_flag: string;

  @Column({
    type: 'varchar',
    name: 'vali_flag',
    length: 3,
    nullable: true,
  })
  vali_flag: string;

  @Column({
    type: 'varchar',
    name: 'bzxx2',
    length: 30,
    nullable: true,
  })
  bzxx2: string;

  @Column({
    type: 'varchar',
    name: 'bzxx3',
    length: 30,
    nullable: true,
  })
  bzxx3: string;

  @Column({
    type: 'varchar',
    name: 'bzxx4',
    length: 30,
    nullable: true,
  })
  bzxx4: string;

  @Column({
    type: 'varchar',
    name: 'bzxx5',
    length: 30,
    nullable: true,
  })
  bzxx5: string;

  @Column({
    type: 'varchar',
    name: 'icd10',
    length: 30,
    nullable: true,
  })
  icd10: string;

  @Column({
    type: 'varchar',
    name: 'zwmc',
    length: 100,
    nullable: true,
  })
  zwmc: string;

  @Column({ type: 'datetime', name: 'sskssj', nullable: true, precision: 3 })
  sskssj: Date;

  @Column({ type: 'datetime', name: 'ssjssj', nullable: true, precision: 3 })
  ssjssj: Date;
}
