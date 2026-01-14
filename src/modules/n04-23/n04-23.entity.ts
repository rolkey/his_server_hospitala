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
    collation: 'Chinese_PRC_CI_AS',
  })
  ssjczbm: string;

  @Column({ type: 'datetime', name: 'ssjczrq', nullable: true, precision: 3 })
  ssjczrq: Date;

  @Column({
    type: 'varchar',
    name: 'shjb',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  shjb: string;

  @Column({
    type: 'varchar',
    name: 'ssjczmc',
    length: 60,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  ssjczmc: string;

  @Column({
    type: 'varchar',
    name: 'sz',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  sz: string;

  @Column({
    type: 'varchar',
    name: 'yz',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  yz: string;

  @Column({
    type: 'varchar',
    name: 'ez',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  ez: string;

  @Column({
    type: 'varchar',
    name: 'qkdj',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  qkdj: string;

  @Column({
    type: 'varchar',
    name: 'qkylb',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  qkylb: string;

  @Column({
    type: 'varchar',
    name: 'mzfs',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  mzfs: string;

  @Column({
    type: 'varchar',
    name: 'mzys',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  mzys: string;

  @Column({
    type: 'varchar',
    name: 'bzxx',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzxx: string;

  @Column({
    type: 'varchar',
    name: 'bzxx1',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzxx1: string;

  @Column({ type: 'int', name: 'sjbz', nullable: true, default: 0 })
  sjbz: number;

  @Column({
    type: 'varchar',
    name: 'oprn_oper_part_code',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  oprn_oper_part_code: string;

  @Column({
    type: 'varchar',
    name: 'oprn_con_time',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  oprn_con_time: string;

  @Column({
    type: 'varchar',
    name: 'anst_lv_code',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  anst_lv_code: string;

  @Column({
    type: 'varchar',
    name: 'oprn_optn_part_code',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  oprn_optn_part_code: string;

  @Column({
    type: 'varchar',
    name: 'main_oprn_flag',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  main_oprn_flag: string;

  @Column({
    type: 'varchar',
    name: 'anst_asa_lv_code',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  anst_asa_lv_code: string;

  @Column({
    type: 'varchar',
    name: 'anst_medn_code',
    length: 50,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  anst_medn_code: string;

  @Column({
    type: 'varchar',
    name: 'anst_medn_dos',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  anst_medn_dos: string;

  @Column({
    type: 'varchar',
    name: 'unt',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
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
    collation: 'Chinese_PRC_CI_AS',
  })
  anst_copn_code: string;

  @Column({
    type: 'varchar',
    name: 'anst_copn_dscr',
    length: 200,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
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
    collation: 'Chinese_PRC_CI_AS',
  })
  canc_oprn_flag: string;

  @Column({
    type: 'varchar',
    name: 'vali_flag',
    length: 3,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  vali_flag: string;

  @Column({
    type: 'varchar',
    name: 'bzxx2',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzxx2: string;

  @Column({
    type: 'varchar',
    name: 'bzxx3',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzxx3: string;

  @Column({
    type: 'varchar',
    name: 'bzxx4',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzxx4: string;

  @Column({
    type: 'varchar',
    name: 'bzxx5',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzxx5: string;

  @Column({
    type: 'varchar',
    name: 'icd10',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  icd10: string;

  @Column({
    type: 'varchar',
    name: 'zwmc',
    length: 100,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  zwmc: string;

  @Column({ type: 'datetime', name: 'sskssj', nullable: true, precision: 3 })
  sskssj: Date;

  @Column({ type: 'datetime', name: 'ssjssj', nullable: true, precision: 3 })
  ssjssj: Date;
}
