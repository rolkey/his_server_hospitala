// src/entities/temp-sfxm.entity.ts
import { Column, Entity } from 'typeorm';

@Entity({ name: '#temp_sfxm' })
export class TempSfxm {
  @Column({ name: 'xmzl', type: 'int' })
  xmzl: number;

  @Column({ name: 'xmid', type: 'varchar', length: 50, nullable: true })
  xmid: string;

  @Column({ name: 'ggxh', type: 'varchar', length: 60, nullable: true })
  ggxh: string;

  @Column({ name: 'pfjg', type: 'decimal', precision: 16, scale: 4, nullable: true })
  pfjg: number;

  @Column({ name: 'cjid', type: 'varchar', length: 60, nullable: true })
  cjid: string;

  @Column({ name: 'scph', type: 'varchar', length: 30, nullable: true })
  scph: string;

  @Column({ name: 'sfdj', type: 'decimal', precision: 16, scale: 4, nullable: true })
  sfdj: number;

  @Column({ name: 'jldw', type: 'varchar', length: 60, nullable: true })
  jldw: string;

  @Column({ name: 'xmmc', type: 'varchar', length: 100, nullable: true })
  xmmc: string;

  @Column({ name: 'szbm', type: 'varchar', length: 20, nullable: true })
  szbm: string;

  @Column({ name: 'pybm', type: 'varchar', length: 20, nullable: true })
  pybm: string;

  @Column({ name: 'wbbm', type: 'varchar', length: 20, nullable: true })
  wbbm: string;

  @Column({ name: 'qtbm', type: 'varchar', length: 20, nullable: true })
  qtbm: string;

  @Column({ name: 'tcid', type: 'varchar', length: 10, nullable: true })
  tcid: string;

  @Column({ name: 'tcmc', type: 'varchar', length: 100, nullable: true })
  tcmc: string;

  @Column({ name: 'sfbz', type: 'int', nullable: true })
  sfbz: number;

  @Column({ name: 'fybz', type: 'varchar', length: 10, nullable: true })
  fybz: string;

  @Column({ name: 'fylbid', type: 'varchar', length: 10, nullable: true })
  fylbid: string;

  @Column({ name: 'bzxx', type: 'varchar', length: 50, nullable: true })
  bzxx: string;

  @Column({ name: 'zflx', type: 'varchar', length: 10, nullable: true })
  zflx: string;

  @Column({ name: 'ybfl', type: 'varchar', length: 20, nullable: true })
  ybfl: string;

  @Column({ name: 'zzfl', type: 'int', nullable: true })
  zzfl: number;

  @Column({ name: 'nhfl', type: 'varchar', length: 20, nullable: true })
  nhfl: string;

  @Column({ name: 'spmc', type: 'varchar', length: 100, nullable: true })
  spmc: string;

  @Column({ name: 'ghid', type: 'varchar', length: 10, nullable: true })
  ghid: string;

  @Column({ name: 'ksid', type: 'varchar', length: 10, nullable: true })
  ksid: string;

  @Column({ name: 'psbz', type: 'int', nullable: true })
  psbz: number;

  @Column({ name: 'ksbz', type: 'varchar', length: 10, nullable: true })
  ksbz: string;

  @Column({ name: 'qtbz', type: 'int', nullable: true })
  qtbz: number;

  @Column({ name: 'hldw', type: 'varchar', length: 8, nullable: true })
  hldw: string;

  @Column({ name: 'hlxs', type: 'decimal', precision: 16, scale: 4, nullable: true })
  hlxs: number;

  @Column({ name: 'ypflbm', type: 'varchar', length: 20, nullable: true })
  ypflbm: string;

  @Column({ name: 'ysxs', type: 'int', nullable: true })
  ysxs: number;

  @Column({ name: 'tjfl', type: 'varchar', length: 10, nullable: true })
  tjfl: string;

  @Column({ name: 'pwjj', type: 'int', nullable: true })
  pwjj: number;

  @Column({ name: 'syffid', type: 'varchar', length: 10, nullable: true })
  syffid: string;

  @Column({ name: 'kcsl', type: 'decimal', precision: 16, scale: 4, default: 0 })
  kcsl: number;

  @Column({ name: 'je', type: 'int', nullable: true })
  je: number;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string;

  @Column({ name: 'scpc', type: 'varchar', length: 30, nullable: true })
  scpc: string;

  @Column({ name: 'mzsl', type: 'decimal', precision: 16, scale: 4, default: 0 })
  mzsl: number;

  @Column({ name: 'zysl', type: 'decimal', precision: 16, scale: 4, default: 0 })
  zysl: number;

  @Column({ name: 'bz2', type: 'varchar', length: 20, nullable: true })
  bz2: string;

  @Column({ name: 'bz3', type: 'varchar', length: 20, nullable: true })
  bz3: string;

  @Column({ name: 'bz4', type: 'varchar', length: 20, nullable: true })
  bz4: string;

  @Column({ name: 'bz5', type: 'varchar', length: 20, nullable: true })
  bz5: string;

  @Column({ name: 'bz6', type: 'varchar', length: 50, nullable: true })
  bz6: string;

  @Column({ name: 'bz7', type: 'varchar', length: 200, nullable: true })
  bz7: string;

  @Column({ name: 'bz8', type: 'varchar', length: 30, nullable: true })
  bz8: string;

  @Column({ name: 'bz9', type: 'varchar', length: 100, nullable: true })
  bz9: string;

  @Column({ name: 'bz10', type: 'varchar', length: 100, nullable: true })
  bz10: string;

  @Column({ name: 'sxrq', type: 'datetime', nullable: true })
  sxrq: Date;

  @Column({ name: 'bz11', type: 'varchar', length: 30, nullable: true })
  bz11: string;

  @Column({ name: 'bz12', type: 'varchar', length: 30, nullable: true })
  bz12: string;

  @Column({ name: 'zbbz', type: 'int', nullable: true })
  zbbz: number;
}
