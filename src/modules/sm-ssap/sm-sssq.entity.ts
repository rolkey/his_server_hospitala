import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { Jbbmicd10 } from '../jbbmicd/jbbmicd10.entity';
import { Mzff } from '../mzff/mzff.entity';

@Entity({ name: 'SM_SSSQ', schema: 'dbo' })
export class SmSssq {
  @PrimaryColumn({ type: 'decimal', name: 'SQDH', precision: 10, scale: 0 })
  sqdh: number;

  @Column({
    type: 'varchar',
    name: 'zyid',
    length: 20,
    nullable: true,
  })
  zyid: string;

  @Column({
    type: 'varchar',
    name: 'ZYH',
    length: 30,
    nullable: true,
  })
  zyh: string;

  @Column({
    type: 'varchar',
    name: 'SSKS',
    length: 30,
    nullable: true,
  })
  ssks: string;

  @Column({
    type: 'varchar',
    name: 'SQKS',
    length: 30,
    nullable: true,
  })
  sqks: string;

  @Column({
    type: 'varchar',
    name: 'SQYS',
    length: 10,
    nullable: true,
  })
  sqys: string;

  @Column({ type: 'datetime', name: 'SQRQ', nullable: true })
  sqrq: Date;

  @Column({ type: 'datetime', name: 'SSRQ', nullable: true })
  ssrq: Date;

  @Column({
    type: 'varchar',
    name: 'SSDM',
    length: 30,
    nullable: true,
  })
  ssdm: string;

  @Column({
    type: 'varchar',
    name: 'SSNM',
    length: 200,
    nullable: true,
  })
  ssnm: string;

  @Column({
    type: 'varchar',
    name: 'SSYS',
    length: 10,
    nullable: true,
  })
  ssys: string;

  @Column({
    type: 'varchar',
    name: 'SSYZ',
    length: 10,
    nullable: true,
  })
  ssyz: string;

  @Column({
    type: 'varchar',
    name: 'SSEZ',
    length: 10,
    nullable: true,
  })
  ssez: string;

  @Column({
    type: 'varchar',
    name: 'SSSZ',
    length: 10,
    nullable: true,
  })
  sssz: string;

  @Column({
    type: 'varchar',
    name: 'mzdm',
    length: 30,
    nullable: true,
  })
  mzdm: string;

  @Column({
    type: 'varchar',
    name: 'MZYS',
    length: 10,
    nullable: true,
  })
  mzys: string;

  @Column({ type: 'decimal', name: 'TJBZ', precision: 1, scale: 0, nullable: true })
  tjbz: number;

  @Column({ type: 'decimal', name: 'APBZ', precision: 1, scale: 0, nullable: true })
  apbz: number;

  @Column({ type: 'decimal', name: 'ZFBZ', precision: 1, scale: 0, nullable: true })
  zfbz: number;

  @Column({
    type: 'varchar',
    name: 'TXKS',
    length: 30,
    nullable: true,
  })
  txks: string;

  @Column({
    type: 'varchar',
    name: 'CZGH',
    length: 10,
    nullable: true,
  })
  czgh: string;

  @Column({ type: 'decimal', name: 'SQTL', precision: 1, scale: 0, nullable: true })
  sqtl: number;

  @Column({ type: 'decimal', name: 'SQZD', precision: 10, scale: 0, nullable: true })
  sqzd: number;

  @Column({
    type: 'varchar',
    name: 'bzxx',
    length: 255,
    nullable: true,
  })
  bzxx: string;

  @Column({ type: 'decimal', name: 'SQLX', precision: 1, scale: 0, nullable: true })
  sqlx: number;

  @Column({ type: 'datetime', name: 'ssapsj', nullable: true })
  ssapsj: Date;

  @Column({
    type: 'varchar',
    name: 'zdbm',
    length: 30,
    nullable: true,
  })
  zdbm: string;

  @Column({
    type: 'varchar',
    name: 'lszd',
    length: 20,
    nullable: true,
  })
  lszd: string;

  @Column({
    type: 'varchar',
    name: 'sslx',
    length: 10,
    nullable: true,
  })
  sslx: string;

  @Column({
    type: 'varchar',
    name: 'shbz',
    length: 1,
    nullable: true,
  })
  shbz: string;

  @Column({
    type: 'varchar',
    name: 'bzxx1',
    length: 30,
    nullable: true,
  })
  bzxx1: string;

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

  @ManyToOne(() => h11_brxx, {
    cascade: false, // 禁用级联操作
  })
  @JoinColumn({ name: 'zyid', referencedColumnName: 'zyid' })
  h11BrxxEntity: h11_brxx;

  @ManyToOne(() => Jbbmicd10, {
    cascade: false, // 禁用级联操作
  })
  @JoinColumn({ name: 'zdbm', referencedColumnName: 'icd10' })
  jbbmicd10Entity: Jbbmicd10;

  @ManyToOne(() => Mzff, {
    cascade: false, // 禁用级联操作
  })
  @JoinColumn({ name: 'mzdm', referencedColumnName: 'mzid' })
  mzdmEntity: Mzff;
}
