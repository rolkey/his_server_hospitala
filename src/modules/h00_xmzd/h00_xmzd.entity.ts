import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'h00_xmzd', schema: 'dbo' })
export class H00_xmzd {
  @PrimaryColumn({ type: 'tinyint', default: 1 })
  xmzl: number;

  @PrimaryColumn({ type: 'varchar', length: 50, default: '' })
  xmid: string;

  @PrimaryColumn({ type: 'varchar', length: 60 })
  ggxh: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  cjid: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  scph: string | null;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  pfjg: number | null;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  sfdj: number | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  jldw: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  xmmc: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  szbm: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pybm: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  wbbm: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  qtbm: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  tcid: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  tcmc: string | null;

  @Column({ type: 'int', default: 1, nullable: true })
  sfbz: number | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  fybz: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  fylbid: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bzxx: string | null;

  @Column({ type: 'datetime', nullable: true })
  sxrq: Date | null;

  @Column({ type: 'varchar', length: 12, default: '', nullable: true })
  zflx: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  yjid: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  sgfzfblid: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  qgfzfblid: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  ybzfblid: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  htzfblid: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  jzzfblid: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  tczfblid: string | null;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  kcsl: number | null;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  sqsl: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  ypid: string | null;

  @Column({ type: 'int', default: 1, nullable: true })
  dwjb: number | null;

  @Column({ type: 'tinyint', default: 1, nullable: true })
  yxbz: number | null;

  @Column({ type: 'smallint', nullable: true })
  dw_grade: number | null;

  @Column({ type: 'int', default: 1, nullable: true })
  dw_xs: number | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  sfdw: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  ypfl: string | null;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true })
  zfbl: number | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  kcdw: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  bzmc: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bzdm: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  zwmc: string | null;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  price_max: number | null;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  price_min: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  safe_class: string | null;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  safe_percent: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cwflid: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  yjid1: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ybid: string | null;

  @Column({ type: 'varchar', length: 1, nullable: true })
  ybbz: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  uploadcode: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  fyfs: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  bz1: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  bz2: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  bz3: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  code: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gjybmc: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gjybbm: string | null;

  @Column({ type: 'varchar', length: 250, nullable: true })
  sm: string | null;

  @Column({ type: 'varchar', length: 2, default: '', nullable: true })
  mbfl: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  createksid: string | null;

  @Column({ type: 'varchar', length: 10, default: '', nullable: true })
  creater: string | null;

  @Column({ type: 'smallint', default: 0, nullable: true })
  kzbz: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  mccs: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  mrcs: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  mrsl: number | null;

  @Column({ type: 'smallint', default: 0, nullable: true })
  qt1: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  qt2: number | null;

  @Column({ type: 'varchar', length: 30, default: '', nullable: true })
  qtxx1: string | null;

  @Column({ type: 'varchar', length: 60, default: '', nullable: true })
  qtxx2: string | null;

  @Column({ type: 'smallint', default: 0, nullable: true })
  jkbz: number | null;
}
