// src/modules/h30_ypzd/h30_ypzd.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'h30_ypzd', schema: 'sunsoft.dbo' })
export class H30_ypzd {
  @PrimaryColumn({ type: 'varchar', length: 50, default: '' })
  ypid: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  zwmc: string;

  @Column({ type: 'char', length: 20, default: '', nullable: true })
  bzbm: string;

  @Column({ type: 'char', length: 10, default: '', nullable: true })
  ypflid: string;

  @Column({ type: 'char', length: 20, default: '', nullable: true })
  ypflbm: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  ypgg: string;

  @Column({ type: 'char', length: 20, default: '', nullable: true })
  yphl: string;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  hlxs: number;

  @Column({ type: 'char', length: 8, default: '', nullable: true })
  hldw: string;

  @Column({ type: 'char', length: 10, default: '', nullable: true })
  jxflid: string;

  @Column({ type: 'char', length: 40, default: '', nullable: true })
  spmc: string;

  @Column({ type: 'char', length: 40, default: '', nullable: true })
  ywmc: string;

  @Column({ type: 'char', length: 40, default: '', nullable: true })
  ldmc: string;

  @Column({ type: 'char', length: 20, default: '', nullable: true })
  szbm: string;

  @Column({ type: 'char', length: 20, default: '', nullable: true })
  pybm: string;

  @Column({ type: 'char', length: 20, default: '', nullable: true })
  wbbm: string;

  @Column({ type: 'char', length: 20, default: '', nullable: true })
  qtbm: string;

  @Column({ type: 'char', length: 10, default: '', nullable: true })
  syffid: string;

  @Column({ type: 'char', length: 10, default: '', nullable: true })
  syplid: string;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  ycjl: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  yrjl: number;

  @Column({ type: 'char', length: 8, default: '', nullable: true })
  yjjl: string;

  @Column({ type: 'char', length: 8, default: '', nullable: true })
  ejjl: string;

  @Column({ type: 'char', length: 8, default: '', nullable: true })
  sjjl: string;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 1, nullable: true })
  yexs: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 1, nullable: true })
  esxs: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 1, nullable: true })
  ysxs: number;

  @Column({ type: 'char', length: 10, default: '', nullable: true })
  cfqj: string;

  @Column({ type: 'smallint', default: 0, nullable: true })
  zzbz: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  pwjj: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  qtjj: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  dybz: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  mzbz: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  gzbz: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  jsl1: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  jsl2: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  jkbz: number;

  @Column({ type: 'smallint', default: 1, nullable: true })
  ybfl: number;

  @Column({ type: 'smallint', default: 1, nullable: true })
  abcfl: number;

  @Column({ type: 'char', length: 10, default: '', nullable: true })
  fylbid: string;

  @Column({ type: 'char', length: 10, default: '', nullable: true })
  zflx: string;

  @Column({ type: 'char', length: 200, default: '', nullable: true })
  zyyt: string;

  @Column({ type: 'char', length: 200, default: '', nullable: true })
  yfyl: string;

  @Column({ type: 'char', length: 200, default: '', nullable: true })
  zysx: string;

  @Column({ type: 'char', length: 100, default: '', nullable: true })
  zcff: string;

  @Column({ type: 'char', length: 200, default: '', nullable: true })
  bzxx: string;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 1, nullable: true })
  bfxs: number;

  @Column({ type: 'smallint', nullable: true })
  ypfl: number;

  @Column({ type: 'int', nullable: true })
  sj1: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bz1: string;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true })
  lsj: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true })
  pfj: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  ksid: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  uploadcode: string;

  @Column({ type: 'smallint', nullable: true })
  zzrz: number;

  @Column({ type: 'smallint', nullable: true })
  swjp: number;

  @Column({ type: 'smallint', nullable: true })
  qt1: number;

  @Column({ type: 'smallint', nullable: true })
  qt2: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  gsid: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  qtbz1: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  qtbz2: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  code: string;

  @Column({ type: 'smallint', nullable: true })
  qt3: number;

  @Column({ type: 'smallint', nullable: true })
  qt4: number;

  @Column({ type: 'smallint', nullable: true })
  qt5: number;

  @Column({ type: 'smallint', nullable: true })
  qt6: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  qtbz3: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  qtbz4: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  qtbz5: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  gg: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  pzwh: string;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true })
  xlsj: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ybgg: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ybjx: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  ybcj: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  zzh: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  zzmc: string;

  @Column({ type: 'tinyint', nullable: true })
  synf: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  meno: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lb: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lbbig: string;

  @Column({ type: 'datetime', nullable: true })
  cjrq: Date;

  @Column({ type: 'varchar', length: 80, nullable: true })
  zzgg: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  clcz: string;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true })
  pric: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  cd: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  gsmc: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gjybbm: string;

  @Column({ type: 'varchar', length: 100, default: '', nullable: true })
  gjybmc: string;

  @Column({ type: 'smallint', default: 0, nullable: true })
  qt7: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  qt8: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  kzbz: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  mccs: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  mrcs: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  mrsl: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  ksshl: number;

  @Column({ type: 'varchar', length: 50, default: '', nullable: true })
  zsm: string;
}
