import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { BasOpr } from '../bas-opr/bas-opr.entity';
import { Mzff } from '../mzff/mzff.entity';
import { SmSssq } from '../sm-sssq/sm-sssq.entity';

@Entity({ name: 'SM_SSAP', schema: 'dbo' })
export class SmSsap {
  @PrimaryColumn({ type: 'varchar', name: 'zyid', length: 20 })
  zyid: string;

  @PrimaryColumn({ type: 'decimal', name: 'SQDH', precision: 10, scale: 0 })
  sqdh: number;

  /** 手术编号，创建时生成，更新时不允许修改，避免与它行重复导致主键/唯一约束冲突 */
  @Column({ type: 'varchar', name: 'SSBH', length: 30, nullable: true, update: false })
  ssbh: string;

  @Column({ type: 'varchar', name: 'ZYH', length: 30, nullable: true })
  zyh: string;

  @Column({ type: 'datetime', name: 'APRQ', nullable: true })
  aprq: Date;

  @Column({ type: 'datetime', name: 'SSRQ', nullable: true })
  ssrq: Date;

  @Column({ type: 'varchar', name: 'SSNM', length: 200, nullable: true })
  ssnm: string;

  @Column({ type: 'varchar', name: 'SSYS', length: 10, nullable: true })
  ssys: string;

  @Column({ type: 'varchar', name: 'SSYZ', length: 10, nullable: true })
  ssyz: string;

  @Column({ type: 'varchar', name: 'SSEZ', length: 10, nullable: true })
  ssez: string;

  @Column({ type: 'varchar', name: 'SSSZ', length: 10, nullable: true })
  sssz: string;

  @Column({ type: 'varchar', name: 'XSHS', length: 16, nullable: true })
  xshs: string;

  @Column({ type: 'varchar', name: 'XHHS', length: 16, nullable: true })
  xhhs: string;

  // 注意：列名使用小写 'mzdm'，与 ManyToOne JoinColumn 保持一致，避免在 INSERT 中重复生成 MZDM/mzdm 两个列
  @Column({ type: 'varchar', name: 'mzdm', length: 30, nullable: true })
  mzdm: string;

  @Column({ type: 'varchar', name: 'MZYS', length: 10, nullable: true })
  mzys: string;

  @Column({ type: 'decimal', name: 'JZBZ', precision: 1, scale: 0, nullable: true })
  jzbz: number;

  @Column({ type: 'decimal', name: 'HZBZ', precision: 1, scale: 0, nullable: true })
  hzbz: number;

  @Column({ type: 'decimal', name: 'THBZ', precision: 1, scale: 0, nullable: true })
  thbz: number;

  @Column({ type: 'decimal', name: 'MZBZ', precision: 1, scale: 0, nullable: true })
  mzbz: number;

  @Column({ type: 'decimal', name: 'QXBZ', precision: 1, scale: 0, nullable: true })
  qxbz: number;

  @Column({ type: 'decimal', name: 'SSBZ', precision: 1, scale: 0, nullable: true })
  ssbz: number;

  @Column({ type: 'decimal', name: 'JFBZ', precision: 1, scale: 0, nullable: true })
  jfbz: number;

  @Column({ type: 'decimal', name: 'ZFBZ', precision: 1, scale: 0, nullable: true })
  zfbz: number;

  @Column({ type: 'decimal', name: 'WCBZ', precision: 1, scale: 0, nullable: true })
  wcbz: number;

  @Column({ type: 'decimal', name: 'SHBZ', precision: 1, scale: 0, nullable: true })
  shbz: number;

  @Column({ type: 'varchar', name: 'SSYQ', length: 500, nullable: true })
  ssyq: string;

  @Column({ type: 'varchar', name: 'ZYSX', length: 500, nullable: true })
  zysx: string;

  @Column({ type: 'varchar', name: 'CZGH', length: 10, nullable: true })
  czgh: string;

  @Column({ type: 'varchar', name: 'SSYS_2', length: 10, nullable: true })
  ssys_2: string;

  @Column({ type: 'varchar', name: 'XSHS_2', length: 16, nullable: true })
  xshs_2: string;

  @Column({ type: 'varchar', name: 'XHHS_2', length: 16, nullable: true })
  xhhs_2: string;

  @Column({ type: 'varchar', name: 'MZYS_2', length: 10, nullable: true })
  mzys_2: string;

  @Column({ type: 'varchar', name: 'SSFJ', length: 500, nullable: true })
  ssfj: string;

  @Column({ type: 'varchar', name: 'SSTH', length: 500, nullable: true })
  ssth: string;

  @Column({ type: 'decimal', name: 'MZWCBZ', precision: 1, scale: 0, nullable: true })
  mzwcbz: number;

  @Column({ type: 'varchar', name: 'SSKS', length: 30, nullable: true })
  ssks: string;

  @Column({ type: 'decimal', name: 'SQLX', precision: 1, scale: 0, nullable: true })
  sqlx: number;

  @Column({ type: 'varchar', name: 'zdbm', length: 30, nullable: true })
  zdbm: string;

  @Column({ type: 'varchar', name: 'lszd', length: 20, nullable: true })
  lszd: string;

  @Column({ type: 'varchar', name: 'sslx', length: 10, nullable: true })
  sslx: string;

  @Column({ type: 'varchar', name: 'SXYS', length: 10, nullable: true })
  sxys: string;

  @Column({ type: 'varchar', name: 'bzxx1', length: 30, nullable: true })
  bzxx1: string;

  @Column({ type: 'varchar', name: 'bzxx2', length: 30, nullable: true })
  bzxx2: string;

  @Column({ type: 'varchar', name: 'bzxx3', length: 30, nullable: true })
  bzxx3: string;

  @Column({ type: 'varchar', name: 'ssdm', length: 30, nullable: true })
  ssdm: string;

  @ManyToOne(() => SmSssq, { cascade: false })
  @JoinColumn({ name: 'SQDH', referencedColumnName: 'sqdh' })
  smSssqEntity: SmSssq;

  @ManyToOne(() => BasOpr, {
    cascade: false, // 禁用级联操作
  })
  @JoinColumn({ name: 'ssdm', referencedColumnName: 'icdcm' })
  ssdmEntity: BasOpr;

  @ManyToOne(() => h11_brxx, { cascade: false })
  @JoinColumn({ name: 'zyid', referencedColumnName: 'zyid' })
  h11BrxxEntity: h11_brxx;

  @ManyToOne(() => Mzff, {
    cascade: false, // 禁用级联操作
  })
  @JoinColumn({ name: 'mzdm', referencedColumnName: 'mzid' })
  mzdmEntity: Mzff;
}
