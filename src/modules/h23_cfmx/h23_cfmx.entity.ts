import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

import { H30_ypzd } from '@/modules/h30_ypzd/h30_ypzd.entity';
import { h00_syff } from '@/modules/h00_syff/h00_syff.entity';

@Entity('h23_cfmx', { schema: 'dbo' })
export class H23Cfmx {
  @PrimaryColumn({ name: 'cfid', type: 'varchar', length: 12 })
  cfid: string;

  @PrimaryColumn({ name: 'mxxh', type: 'int' })
  mxxh: number;

  @Column({ name: 'fylbid', type: 'varchar', length: 10, nullable: true })
  fylbid: string | null;

  @Column({ name: 'xmid', type: 'varchar', length: 50, nullable: true })
  xmid: string | null;

  @Column({ name: 'xmlx', type: 'smallint', nullable: true })
  xmlx: number | null;

  @Column({ name: 'xmmc', type: 'varchar', length: 100, nullable: true })
  xmmc: string | null;

  @Column({ name: 'syffid', type: 'varchar', length: 10, nullable: true, default: '' })
  syffid: string | null;

  @Column({ name: 'fybz', type: 'varchar', length: 10, nullable: true, default: '' })
  fybz: string | null;

  @Column({ name: 'zflxid', type: 'varchar', length: 12, nullable: true, default: '' })
  zflxid: string | null;

  @Column({ name: 'syplid', type: 'varchar', length: 10, nullable: true, default: '' })
  syplid: string | null;

  @Column({ name: 'zfbl', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  zfbl: number | null;

  @Column({ name: 'gg', type: 'varchar', length: 60, nullable: true })
  gg: string | null;

  @Column({ name: 'days', type: 'tinyint', nullable: true, default: 0 })
  days: number | null;

  @Column({ name: 'cjid', type: 'varchar', length: 10, nullable: true, default: '' })
  cjid: string | null;

  @Column({ name: 'tzbz', type: 'tinyint', nullable: true, default: 0 })
  tzbz: number | null;

  @Column({ name: 'dj', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  dj: number | null;

  @Column({ name: 'zscs', type: 'tinyint', nullable: true, default: 0 })
  zscs: number | null;

  @Column({ name: 'yzcs', type: 'tinyint', nullable: true, default: 0 })
  yzcs: number | null;

  @Column({ name: 'scph', type: 'varchar', length: 10, nullable: true, default: '' })
  scph: string | null;

  @Column({ name: 'sl', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  sl: number | null;

  @Column({ name: 'pfjg', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  pfjg: number | null;

  @Column({ name: 'dw', type: 'varchar', length: 60, nullable: true })
  dw: string | null;

  @Column({ name: 'sfbz', type: 'smallint', nullable: true, default: 0 })
  sfbz: number | null;

  @Column({ name: 'yldw', type: 'varchar', length: 10, nullable: true, default: '' })
  yldw: string | null;

  @Column({ name: 'mcyl', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  mcyl: number | null;

  @Column({ name: 'yysl', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  yysl: number | null;

  @Column({ name: 'bz', type: 'varchar', length: 200, nullable: true, default: '' })
  bz: string | null;

  @Column({ name: 'tempsl', type: 'varchar', length: 12, nullable: true, default: '' })
  tempsl: string | null;

  @Column({ name: 'ksid', type: 'varchar', length: 12, nullable: true, default: '' })
  ksid: string | null;

  @Column({ name: 'fy', type: 'smallint', nullable: true, default: 0 })
  fy: number | null;

  @Column({ name: 'ypid', type: 'varchar', length: 12, nullable: true, default: '' })
  ypid: string | null;

  @Column({ name: 'dw_grade', type: 'smallint', nullable: true, default: 0 })
  dwGrade: number | null;

  @Column({ name: 'dwjb', type: 'int', nullable: true, default: 0 })
  dwjb: number | null;

  @Column({ name: 'zfje', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  zfje: number | null;

  @Column({ name: 'ypfl', type: 'varchar', length: 10, nullable: true, default: '' })
  ypfl: string | null;

  @Column({ name: 'bzmc', type: 'varchar', length: 100, nullable: true })
  bzmc: string | null;

  @Column({ name: 'bzdm', type: 'varchar', length: 50, nullable: true, default: '' })
  bzdm: string | null;

  @Column({ name: 'mxsph', type: 'varchar', length: 20, nullable: true })
  mxsph: string | null;

  @Column({ name: 'ybshbz', type: 'varchar', length: 2, nullable: true })
  ybshbz: string | null;

  @Column({ name: 'scpc', type: 'varchar', length: 20, nullable: true })
  scpc: string | null;

  @Column({ name: 'bzxx1', type: 'varchar', length: 10, nullable: true })
  bzxx1: string | null;

  @Column({ name: 'kyts', type: 'tinyint', nullable: true })
  kyts: number | null;

  @Column({ name: 'wcbz', type: 'tinyint', nullable: true })
  wcbz: number | null;

  @Column({ name: 'mrcs', type: 'tinyint', nullable: true })
  mrcs: number | null;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'jcmd', type: 'varchar', length: 60, nullable: true })
  jcmd: string | null;

  @Column({ name: 'jcbw', type: 'varchar', length: 30, nullable: true })
  jcbw: string | null;

  @Column({ name: 'zxks', type: 'varchar', length: 10, nullable: true })
  zxks: string | null;

  @Column({ name: 'yjry', type: 'varchar', length: 10, nullable: true })
  yjry: string | null;

  @Column({ name: 'yjrq', type: 'datetime', nullable: true })
  yjrq: Date | null;

  @Column({ name: 'fjbz', type: 'smallint', nullable: true })
  fjbz: number | null;

  @Column({ name: 'ysbz', type: 'smallint', nullable: true })
  ysbz: number | null;

  @Column({ name: 'chzh', type: 'varchar', length: 10, nullable: true })
  chzh: string | null;

  @Column({ name: 'sjbz', type: 'tinyint', nullable: true, default: 1 })
  sjbz: number | null;

  @Column({ name: 'ykbz', type: 'tinyint', nullable: true, default: 0 })
  ykbz: number | null;

  @Column({ name: 'ybbz', type: 'tinyint', nullable: true, default: 1 })
  ybbz: number | null;

  @Column({ name: 'gjybbm', type: 'varchar', length: 50, nullable: true, default: '' })
  gjybbm: string | null;

  @Column({ name: 'gjybmc', type: 'varchar', length: 100, nullable: true, default: '' })
  gjybmc: string | null;

  @Column({ name: 'ybzfje', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  ybzfje: number | null;

  @Column({ name: 'ybcje', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  ybcje: number | null;

  @Column({ name: 'ybzfbl', type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  ybzfbl: number | null;

  @Column({ name: 'hllb', type: 'varchar', length: 6, nullable: true })
  hllb: string | null;

  @Column({ name: 'qtlb', type: 'varchar', length: 6, nullable: true })
  qtlb: string | null;

  @Column({ name: 'yzxx', type: 'varchar', length: 60, nullable: true, default: '' })
  yzxx: string | null;

  @Column({ name: 'sxrq', type: 'datetime', nullable: true })
  sxrq: Date | null;

  @Column({ name: 'scrq', type: 'datetime', nullable: true })
  scrq: Date | null;

  @ManyToOne(() => H30_ypzd)
  @JoinColumn({ name: 'xmid', referencedColumnName: 'ypid' })
  ypzdEntity: H30_ypzd;

  @ManyToOne(() => h00_syff)
  @JoinColumn({ name: 'syffid', referencedColumnName: 'syffid' })
  syffEntity: h00_syff;
}
