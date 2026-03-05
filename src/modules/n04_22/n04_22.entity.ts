import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'N04_22', schema: 'dbo' })
export class N0422 {
  @PrimaryColumn({
    name: 'zyid',
    type: 'varchar',
    length: 12,
    nullable: false,
  })
  zyid: string;

  @PrimaryColumn({
    name: 'zdxh',
    type: 'decimal',
    precision: 18,
    scale: 0,
    nullable: false,
  })
  zdxh: number;

  @Column({
    name: 'zdmc',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  zdmc: string;

  @Column({
    name: 'zdbm',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  zdbm: string;

  @Column({
    name: 'zdbq',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  zdbq: string;

  @Column({
    name: 'zdlx',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  zdlx: string;

  @Column({
    name: 'bzxx',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bzxx: string;

  @Column({
    name: 'bzxx1',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bzxx1: string;

  @Column({
    name: 'sjbz',
    type: 'int',
    nullable: true,
    default: 0,
  })
  sjbz: number;

  @Column({
    name: 'palg_no',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  palgNo: string;

  @Column({
    name: 'ipt_patn_disediag',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  ipt_patn_disediag: string;

  @Column({
    name: 'maindiag_flag',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  maindiag_flag: string;

  @Column({
    name: 'inhosp_diag_code',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  inhosp_diag_code: string;

  @Column({
    name: 'adm_dise_cond_code',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  adm_dise_cond_code: string;

  @Column({
    name: 'adm_cond_code',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  adm_cond_code: string;

  @Column({
    name: 'high_diag_evid',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  high_diag_evid: string;

  @Column({
    name: 'bkup_deg_code',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bkup_deg_code: string;

  @Column({
    name: 'vali_flag',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  vali_flag: string;

  @Column({
    name: 'bzxx2',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bzxx2: string;

  @Column({
    name: 'bzxx3',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bzxx3: string;

  @Column({
    name: 'bzxx4',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bzxx4: string;

  @Column({
    name: 'bzxx5',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bzxx5: string;

  @Column({
    name: 'icd10',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  icd10: string;

  @Column({
    name: 'zwmc',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  zwmc: string;
}
