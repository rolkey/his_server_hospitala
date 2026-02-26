import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity('h23_cfzb')
export class H23Cfzb {
  @PrimaryColumn({ name: 'cfid', type: 'varchar', length: 12 })
  cfid: string;

  @Column({ name: 'xjfpid', type: 'varchar', length: 12, nullable: true })
  xjfpid: string | null;

  @Column({ name: 'ffbz', type: 'tinyint', nullable: true })
  ffbz: number | null;

  @Column({ name: 'jzfpid', type: 'varchar', length: 12, nullable: true })
  jzfpid: string | null;

  @Column({ name: 'mzid', type: 'varchar', length: 12, nullable: true })
  mzid: string | null;

  @Column({ name: 'tyxjfpid', type: 'varchar', length: 12, nullable: true })
  tyxjfpid: string | null;

  @Column({ name: 'dyfpbz', type: 'smallint', nullable: true })
  dyfpbz: number | null;

  @Column({ name: 'ghid', type: 'varchar', length: 12, nullable: true })
  ghid: string | null;

  @Column({ name: 'tyjzfpid', type: 'varchar', length: 12, nullable: true })
  tyjzfpid: string | null;

  @Column({ name: 'brlxid', type: 'varchar', length: 10, nullable: true })
  brlxid: string | null;

  @Column({ name: 'brxm', type: 'varchar', length: 60, nullable: true })
  brxm: string | null;

  @Column({ name: 'brzt', type: 'smallint', nullable: true })
  brzt: number | null;

  @Column({ name: 'kfksid', type: 'varchar', length: 10, nullable: true })
  kfksid: string | null;

  @Column({ name: 'kfysid', type: 'varchar', length: 10, nullable: true })
  kfysid: string | null;

  @Column({ name: 'ypf', type: 'decimal', precision: 16, scale: 4 })
  ypf: number;

  @Column({ name: 'sxysid', type: 'varchar', length: 10, nullable: true })
  sxysid: string | null;

  @Column({ name: 'kfsj', type: 'datetime', nullable: true })
  kfsj: Date | null;

  @Column({ name: 'ypfzfbl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  ypfzfbl: number | null;

  @Column({ name: 'fyhj', type: 'decimal', precision: 16, scale: 4, nullable: true })
  fyhj: number | null;

  @Column({ name: 'hdysid', type: 'varchar', length: 10, nullable: true })
  hdysid: string | null;

  @Column({ name: 'qtfzfbl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  qtfzfbl: number | null;

  @Column({ name: 'yfid', type: 'varchar', length: 10, nullable: true })
  yfid: string | null;

  @Column({ name: 'sjfy', type: 'decimal', precision: 16, scale: 4, nullable: true })
  sjfy: number | null;

  @Column({ name: 'fybz', type: 'smallint', nullable: true })
  fybz: number | null;

  @Column({ name: 'zxbz', type: 'smallint', nullable: true })
  zxbz: number | null;

  @Column({ name: 'fyrid', type: 'varchar', length: 10, nullable: true })
  fyrid: string | null;

  @Column({ name: 'cyfs', type: 'decimal', precision: 16, scale: 4, nullable: true })
  cyfs: number | null;

  @Column({ name: 'tfsj', type: 'datetime', nullable: true })
  tfsj: Date | null;

  @Column({ name: 'tfysid', type: 'varchar', length: 10, nullable: true })
  tfysid: string | null;

  @Column({ name: 'tfyy', type: 'varchar', length: 80, nullable: true })
  tfyy: string | null;

  @Column({ name: 'tfsyrid', type: 'varchar', length: 10, nullable: true })
  tfsyrid: string | null;

  @Column({ name: 'cflx', type: 'smallint', nullable: true })
  cflx: number | null;

  @Column({ name: 'tfsysj', type: 'datetime', nullable: true })
  tfsysj: Date | null;

  @Column({ name: 'cfzt', type: 'smallint', nullable: true })
  cfzt: number | null;

  @Column({ name: 'icd', type: 'varchar', length: 12, nullable: true })
  icd: string | null;

  @Column({ name: 'brzs', type: 'varchar', length: 30, nullable: true })
  brzs: string | null;

  @Column({ name: 'yf', type: 'varchar', length: 50, nullable: true })
  yf: string | null;

  @Column({ name: 'brnl', type: 'varchar', length: 3, nullable: true })
  brnl: string | null;

  @Column({ name: 'etys', type: 'varchar', length: 2, nullable: true })
  etys: string | null;

  @Column({ name: 'brxb', type: 'varchar', length: 4, nullable: true })
  brxb: string | null;

  @Column({ name: 'sfr', type: 'varchar', length: 10, nullable: true })
  sfr: string | null;

  @Column({ name: 'ksid', type: 'varchar', length: 10, nullable: true })
  ksid: string | null;

  @Column({ name: 'zfje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  zfje: number | null;

  @Column({ name: 'sfrid', type: 'varchar', length: 10, nullable: true })
  sfrid: string | null;

  @Column({ name: 'zfrid', type: 'varchar', length: 10, nullable: true })
  zfrid: string | null;

  @Column({ name: 'zfrq', type: 'datetime', nullable: true })
  zfrq: Date | null;

  @Column({ name: 'yblx', type: 'varchar', length: 10, nullable: true })
  yblx: string | null;

  @Column({ name: 'ybzh', type: 'varchar', length: 20, nullable: true })
  ybzh: string | null;

  @Column({ name: 'gzksid', type: 'varchar', length: 10, nullable: true })
  gzksid: string | null;

  @Column({ name: 'ybdjh', type: 'varchar', length: 20, nullable: true })
  ybdjh: string | null;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'ylzh', type: 'varchar', length: 20, nullable: true })
  ylzh: string | null;

  @Column({ name: 'zhj', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  zhj: number | null;

  @Column({ name: 'fyid', type: 'varchar', length: 1, nullable: true, default: '0' })
  fyid: string | null;

  @Column({ name: 'sflx', type: 'varchar', length: 2, nullable: true })
  sflx: string | null;

  @Column({ name: 'sxys', type: 'varchar', length: 10, nullable: true })
  sxys: string | null;

  @Column({ name: 'dybz', type: 'int', nullable: true, default: 0 })
  dybz: number | null;
}
