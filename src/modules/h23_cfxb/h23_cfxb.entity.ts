import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h23_cfxb', { schema: 'dbo' })
export class H23Cfxb {
  @PrimaryColumn({ name: 'cfid', type: 'varchar', length: 12 })
  cfid: string;

  @PrimaryColumn({ name: 'mxxh', type: 'int' })
  mxxh: number;

  @Column({ name: 'fylbid', type: 'varchar', length: 10 })
  fylbid: string;

  @Column({ name: 'xmid', type: 'varchar', length: 50, nullable: true })
  xmid: string | null;

  @Column({ name: 'xmlx', type: 'smallint' })
  xmlx: number;

  @Column({ name: 'xmmc', type: 'varchar', length: 100, nullable: true })
  xmmc: string | null;

  @Column({ name: 'syffid', type: 'varchar', length: 10, default: '' })
  syffid: string;

  @Column({ name: 'fybz', type: 'varchar', length: 10, default: '' })
  fybz: string;

  @Column({ name: 'zflxid', type: 'varchar', length: 12, default: '' })
  zflxid: string;

  @Column({ name: 'syplid', type: 'varchar', length: 10, default: '' })
  syplid: string;

  @Column({ name: 'zfbl', type: 'decimal', precision: 16, scale: 4, default: 0 })
  zfbl: number;

  @Column({ name: 'gg', type: 'varchar', length: 60, nullable: true })
  gg: string | null;

  @Column({ name: 'days', type: 'tinyint', default: 0 })
  days: number;

  @Column({ name: 'cjid', type: 'varchar', length: 10, default: '' })
  cjid: string;

  @Column({ name: 'tzbz', type: 'tinyint', default: 0 })
  tzbz: number;

  @Column({ name: 'dj', type: 'decimal', precision: 16, scale: 4, default: 0 })
  dj: number;

  @Column({ name: 'zscs', type: 'tinyint', default: 0 })
  zscs: number;

  @Column({ name: 'yzcs', type: 'tinyint', default: 0 })
  yzcs: number;

  @Column({ name: 'scph', type: 'varchar', length: 10, default: '' })
  scph: string;

  @Column({ name: 'sl', type: 'decimal', precision: 16, scale: 4, default: 0 })
  sl: number;

  @Column({ name: 'pfjg', type: 'decimal', precision: 16, scale: 4, default: 0 })
  pfjg: number;

  @Column({ name: 'dw', type: 'varchar', length: 60, nullable: true })
  dw: string | null;

  @Column({ name: 'sfbz', type: 'smallint', default: 0 })
  sfbz: number;

  @Column({ name: 'yldw', type: 'varchar', length: 10, default: '' })
  yldw: string;

  @Column({ name: 'mcyl', type: 'decimal', precision: 16, scale: 4, default: 0 })
  mcyl: number;

  @Column({ name: 'yysl', type: 'decimal', precision: 16, scale: 4, default: 0 })
  yysl: number;

  @Column({ name: 'bz', type: 'varchar', length: 200, default: '', nullable: true })
  bz: string | null;

  @Column({ name: 'tempsl', type: 'varchar', length: 12, default: '', nullable: true })
  tempsl: string | null;

  @Column({ name: 'ksid', type: 'varchar', length: 12, default: '', nullable: true })
  ksid: string | null;

  @Column({ name: 'fy', type: 'smallint', default: 0, nullable: true })
  fy: number | null;

  @Column({ name: 'ypid', type: 'varchar', length: 12, default: '', nullable: true })
  ypid: string | null;

  @Column({ name: 'dw_grade', type: 'smallint', default: 0, nullable: true })
  dwGrade: number | null;

  @Column({ name: 'dwjb', type: 'int', default: 0, nullable: true })
  dwjb: number | null;

  @Column({ name: 'zfje', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  zfje: number | null;

  @Column({ name: 'ypfl', type: 'varchar', length: 10, default: '', nullable: true })
  ypfl: string | null;

  @Column({ name: 'bzmc', type: 'varchar', length: 100, nullable: true })
  bzmc: string | null;

  @Column({ name: 'bzdm', type: 'varchar', length: 50, default: '', nullable: true })
  bzdm: string | null;

  @Column({ name: 'wcbz', type: 'int', default: 0 })
  wcbz: number;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'kyts', type: 'tinyint', default: 0, nullable: true })
  kyts: number | null;

  @Column({ name: 'mrcs', type: 'tinyint', default: 0, nullable: true })
  mrcs: number | null;

  @Column({ name: 'mxsph', type: 'varchar', length: 20, nullable: true })
  mxsph: string | null;

  @Column({ name: 'ybshbz', type: 'varchar', length: 2, nullable: true })
  ybshbz: string | null;

  @Column({ name: 'scpc', type: 'varchar', length: 20, nullable: true })
  scpc: string | null;

  @Column({ name: 'bzxx1', type: 'varchar', length: 10, nullable: true })
  bzxx1: string | null;

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

  @Column({ name: 'sjbz', type: 'tinyint', default: 1, nullable: true })
  sjbz: number | null;

  @Column({ name: 'ykbz', type: 'tinyint', default: 0, nullable: true })
  ykbz: number | null;

  @Column({ name: 'ybbz', type: 'tinyint', default: 1, nullable: true })
  ybbz: number | null;

  @Column({ name: 'gjybbm', type: 'varchar', length: 50, default: '', nullable: true })
  gjybbm: string | null;

  @Column({ name: 'gjybmc', type: 'varchar', length: 100, default: '', nullable: true })
  gjybmc: string | null;

  @Column({ name: 'ybzfje', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  ybzfje: number | null;

  @Column({ name: 'ybcje', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  ybcje: number | null;

  @Column({ name: 'ybzfbl', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  ybzfbl: number | null;

  @Column({ name: 'hllb', type: 'varchar', length: 6, nullable: true })
  hllb: string | null;

  @Column({ name: 'qtlb', type: 'varchar', length: 6, nullable: true })
  qtlb: string | null;

  @Column({ name: 'yzxx', type: 'varchar', length: 60, default: '', nullable: true })
  yzxx: string | null;

  @Column({ name: 'sxrq', type: 'datetime', nullable: true })
  sxrq: Date | null;

  @Column({ name: 'scrq', type: 'datetime', nullable: true })
  scrq: Date | null;
}
