import { Column, Entity } from 'typeorm';

/** 交接班主表 ENR_JB01 */
@Entity('ENR_JB01', { schema: 'dbo' })
export class enr_jb01 {
  @Column('decimal', { primary: true, name: 'JBXH', precision: 18, scale: 0 })
  jbxh: string;

  @Column('varchar', { name: 'KSDM', length: 20 })
  ksdm: string;

  @Column('decimal', { name: 'BQDM', precision: 4, scale: 0 })
  bqdm: number;

  @Column('datetime', { name: 'JBSJ', nullable: true })
  jbsj: Date | null;

  @Column('decimal', { name: 'JBLB', precision: 1, scale: 0 })
  jblb: number;

  @Column('datetime', { name: 'SXSJ' })
  sxsj: Date;

  @Column('varchar', { name: 'JBHS', nullable: true, length: 20 })
  jbhs: string | null;

  @Column('decimal', { name: 'BRZS', nullable: true, precision: 5, scale: 0 })
  brzs: number | null;

  @Column('decimal', { name: 'CYRS', nullable: true, precision: 5, scale: 0 })
  cyrs: number | null;

  @Column('decimal', { name: 'ZCRS', nullable: true, precision: 5, scale: 0 })
  zcrs: number | null;

  @Column('decimal', { name: 'SWRS', nullable: true, precision: 5, scale: 0 })
  swrs: number | null;

  @Column('decimal', { name: 'RYRS', nullable: true, precision: 5, scale: 0 })
  ryrs: number | null;

  @Column('decimal', { name: 'ZRRS', nullable: true, precision: 5, scale: 0 })
  zrrs: number | null;

  @Column('decimal', { name: 'SSRS', nullable: true, precision: 5, scale: 0 })
  ssrs: number | null;

  @Column('decimal', { name: 'FMRS', nullable: true, precision: 5, scale: 0 })
  fmrs: number | null;

  @Column('decimal', { name: 'YSSRS', nullable: true, precision: 5, scale: 0 })
  yssrs: number | null;

  @Column('decimal', { name: 'WZRS', nullable: true, precision: 5, scale: 0 })
  wzrs: number | null;

  @Column('varchar', { name: 'QMXX', nullable: true, length: 10 })
  qmxx: string | null;

  @Column('decimal', { name: 'TSRS', nullable: true, precision: 5, scale: 0 })
  tsrs: number | null;

  @Column('tinyint', { name: 'shbz', nullable: true, default: () => '(0)' })
  shbz: number | null;

  @Column('varchar', { name: 'czry', nullable: true, length: 20 })
  czry: string | null;

  @Column('decimal', { name: 'BRZS1', nullable: true, precision: 5, scale: 0 })
  brzs1: number | null;

  @Column('decimal', { name: 'CYRS1', nullable: true, precision: 5, scale: 0 })
  cyrs1: number | null;

  @Column('decimal', { name: 'ZCRS1', nullable: true, precision: 5, scale: 0 })
  zcrs1: number | null;

  @Column('decimal', { name: 'SWRS1', nullable: true, precision: 5, scale: 0 })
  swrs1: number | null;

  @Column('decimal', { name: 'RYRS1', nullable: true, precision: 5, scale: 0 })
  ryrs1: number | null;

  @Column('decimal', { name: 'ZRRS1', nullable: true, precision: 5, scale: 0 })
  zrrs1: number | null;

  @Column('decimal', { name: 'SSRS1', nullable: true, precision: 5, scale: 0 })
  ssrs1: number | null;

  @Column('decimal', { name: 'FMRS1', nullable: true, precision: 5, scale: 0 })
  fmrs1: number | null;

  @Column('decimal', { name: 'YSSRS1', nullable: true, precision: 5, scale: 0 })
  yssrs1: number | null;

  @Column('decimal', { name: 'WZRS2', nullable: true, precision: 5, scale: 0 })
  wzrs2: number | null;

  @Column('decimal', { name: 'WZRS1', nullable: true, precision: 5, scale: 0 })
  wzrs1: number | null;

  @Column('varchar', { name: 'czry1', nullable: true, length: 20 })
  czry1: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 10 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 10 })
  bz2: string | null;
}
