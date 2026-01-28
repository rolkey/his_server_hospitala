import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { H31Lyjl } from './h31_lyjl.entity';

@Entity('h31_lymx')
export class H31Lymx {
  @Column({ primary: true, name: 'ksid', type: 'varchar', length: 10 })
  ksid: string;

  @Column({ primary: true, name: 'djlb', type: 'varchar', length: 20 })
  djlb: string;

  @Column({ primary: true, name: 'djbh', type: 'varchar', length: 12 })
  djbh: string;

  @PrimaryColumn({ name: 'fyxh', type: 'int' })
  fyxh: number;

  @Column({ name: 'cwid', type: 'varchar', length: 20, nullable: true })
  cwid: string | null;

  @Column({ name: 'zybh', type: 'varchar', length: 20, nullable: true })
  zybh: string | null;

  @Column({ name: 'brxm', type: 'varchar', length: 10, nullable: true })
  brxm: string | null;

  @Column({ name: 'xbid', type: 'varchar', length: 4, nullable: true })
  xbid: string | null;

  @Column({ name: 'brnl', type: 'varchar', length: 10, nullable: true })
  brnl: string | null;

  @Column({ name: 'zxrq', type: 'datetime', nullable: true })
  zxrq: Date | null;

  @Column({ name: 'xmmc', type: 'varchar', length: 100, nullable: true })
  xmmc: string | null;

  @Column({ name: 'ggxh', type: 'varchar', length: 60, nullable: true })
  ggxh: string | null;

  @Column({ name: 'sl', type: 'decimal', precision: 18, scale: 4, nullable: true })
  sl: number | null;

  @Column({ name: 'xmdw', type: 'varchar', length: 60, nullable: true })
  xmdw: string | null;

  @Column({ name: 'syplid', type: 'varchar', length: 20, nullable: true })
  syplid: string | null;

  @Column({ name: 'syffid', type: 'varchar', length: 20, nullable: true })
  syffid: string | null;

  @Column({ name: 'xmdj', type: 'decimal', precision: 18, scale: 4, nullable: true })
  xmdj: number | null;

  @Column({ name: 'pfjg', type: 'decimal', precision: 18, scale: 4, nullable: true })
  pfjg: number | null;

  @Column({ name: 'je', type: 'decimal', precision: 18, scale: 4, nullable: true })
  je: number | null;

  @Column({ name: 'xmid', type: 'varchar', length: 50, nullable: true })
  xmid: string | null;

  @Column({ name: 'ksys', type: 'varchar', length: 10, nullable: true })
  ksys: string | null;

  @Column({ name: 'scph', type: 'varchar', length: 20, nullable: true })
  scph: string | null;

  @Column({ name: 'scpc', type: 'varchar', length: 20, nullable: true })
  scpc: string | null;

  @Column({ name: 'cjid', type: 'varchar', length: 60, nullable: true })
  cjid: string | null;

  @Column({ name: 'dyflid', type: 'smallint', nullable: true })
  dyflid: number | null;

  @Column({ name: 'bz1', type: 'varchar', length: 20, nullable: true })
  bz1: string | null;

  @Column({ name: 'bz2', type: 'varchar', length: 60, nullable: true })
  bz2: string | null;

  @Column({ name: 'bz3', type: 'varchar', length: 60, nullable: true })
  bz3: string | null;

  @Column({ name: 'bz4', type: 'varchar', length: 20, nullable: true })
  bz4: string | null;

  @Column({ name: 'bz5', type: 'varchar', length: 20, nullable: true })
  bz5: string | null;

  @Column({ name: 'xsl', type: 'decimal', precision: 12, scale: 4, default: 0 })
  xsl: number;

  @Column({ name: 'xdw', type: 'varchar', length: 20, default: '' })
  xdw: string;

  @Column({ name: 'xlsjg', type: 'decimal', precision: 12, scale: 4, default: 0 })
  xlsjg: number;

  @Column({ name: 'xpfjg', type: 'decimal', precision: 12, scale: 4, default: 0 })
  xpfjg: number;

  @Column({ name: 'sjjl', type: 'varchar', length: 10, nullable: true })
  sjjl: string | null;

  @Column({ name: 'jldw', type: 'varchar', length: 30, nullable: true })
  jldw: string | null;

  @Column({ name: 'cyfs', type: 'int', nullable: true })
  cyfs: number | null;

  @Column({ name: 'bzxx', type: 'varchar', length: 60, nullable: true })
  bzxx: string | null;

  @Column({ name: 'gjybbm', type: 'varchar', length: 60, nullable: true })
  gjybbm: string | null;

  @Column({ name: 'sxrq', type: 'datetime', nullable: true })
  sxrq: Date | null;

  @Column({ name: 'zyid', type: 'varchar', length: 15, nullable: true })
  zyid: string | null;

  @Column({ name: 'maxid', type: 'int', nullable: true })
  maxid: number | null;

  @Column({ name: 'ywlx', type: 'varchar', length: 2, nullable: true })
  ywlx: string | null;

  @Column({ name: 'tpbz', type: 'varchar', length: 3, nullable: true })
  tpbz: string | null;

  @Column({ name: 'fylbid', type: 'varchar', length: 3, nullable: true })
  fylbid: string | null;

  @Column({ name: 'zkksid', type: 'varchar', length: 10, nullable: true })
  zkksid: string | null;

  @Column({ name: 'srcs', type: 'int', nullable: true })
  srcs: number | null;

  @Column({ name: 'mrcs', type: 'int', nullable: true })
  mrcs: number | null;

  @Column({ name: 'mxxh', type: 'int', nullable: true })
  mxxh: number | null;

  @Column({ name: 'yzlx', type: 'int', nullable: true })
  yzlx: number | null;

  @Column({ name: 'yzxh', type: 'int', nullable: true })
  yzxh: number | null;

  @Column({ name: 'lczd', type: 'varchar', length: 60, nullable: true })
  lczd: string | null;

  @Column({ name: 'yzzh', type: 'int', nullable: true })
  yzzh: number | null;

  @Column({ name: 'kshs', type: 'varchar', length: 10, nullable: true })
  kshs: string | null;

  @Column({ name: 'kssxhs', type: 'varchar', length: 10, nullable: true })
  kssxhs: string | null;

  @Column({ name: 'kssxys', type: 'varchar', length: 10, nullable: true })
  kssxys: string | null;

  @ManyToOne(() => H31Lyjl, (H31Lyjl) => H31Lyjl.H31LymxList)
  @JoinColumn({ name: 'djbh' })
  H31Lyjl: H31Lyjl;
}
