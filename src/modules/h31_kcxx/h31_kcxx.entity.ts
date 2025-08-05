import { AfterLoad, Column, Entity } from 'typeorm';

@Entity('h31_kcxx', { schema: 'dbo' })
export class H31_kcxx {
  @Column('varchar', { primary: true, name: 'ksid', length: 10, default: '' })
  ksid: string;

  @Column('varchar', { primary: true, name: 'ypid', length: 50 })
  ypid: string;

  @Column('varchar', { name: 'ypgg', nullable: true, length: 60 })
  ypgg: string | null;

  @Column('varchar', { name: 'cjid', nullable: true, length: 60 })
  cjid: string | null;

  @Column('varchar', { name: 'scph', length: 10, default: '' })
  scph: string;

  @Column('decimal', { name: 'lsjg', precision: 16, scale: 4, default: 0 })
  lsjg: number;

  @Column('decimal', { name: 'pfjg', precision: 16, scale: 4, default: 0 })
  pfjg: number;

  @Column('varchar', { name: 'gsid', nullable: true, length: 10, default: '' })
  gsid: string | null;

  @Column('varchar', { name: 'jldw', nullable: true, length: 60 })
  jldw: string | null;

  @Column('decimal', { name: 'sqsl', precision: 16, scale: 4, default: 0 })
  sqsl: number;

  @Column('decimal', { name: 'kcsl', precision: 16, scale: 4, default: 0 })
  kcsl: number;

  @Column('decimal', { name: 'lsj1', precision: 16, scale: 4, default: 0 })
  lsj1: number;

  @Column('decimal', { name: 'lsj2', precision: 16, scale: 4, default: 0 })
  lsj2: number;

  @Column('decimal', { name: 'lsj3', precision: 16, scale: 4, default: 0 })
  lsj3: number;

  @Column('datetime', { name: 'sxrq', nullable: true })
  sxrq: Date | null;

  @Column('datetime', { name: 'bjrq', nullable: true })
  bjrq: Date | null;

  @Column('varchar', { name: 'fjhm', nullable: true, length: 20 })
  fjhm: string | null;

  @Column('varchar', { name: 'hjhm', nullable: true, length: 20 })
  hjhm: string | null;

  @Column('varchar', { name: 'hjch', nullable: true, length: 20 })
  hjch: string | null;

  @Column('varchar', { name: 'hjwh', nullable: true, length: 20 })
  hjwh: string | null;

  @Column('smallint', { name: 'sxbz', default: 0 })
  sxbz: number;

  @Column('smallint', { name: 'yxbz', default: 0 })
  yxbz: number;

  @Column('smallint', { name: 'djbz', default: 0 })
  djbz: number;

  @Column('varchar', { name: 'fphm', nullable: true, length: 20, default: '' })
  fphm: string | null;

  @Column('varchar', { name: 'pzwh', nullable: true, length: 60 })
  pzwh: string | null;

  @Column('smallint', { name: 'xzbz', default: 0 })
  xzbz: number;

  @Column('datetime', { name: 'sj', nullable: true })
  sj: Date | null;

  @Column('int', { name: 'gmp', nullable: true })
  gmp: number | null;

  @Column('int', { name: 'zbbz', nullable: true })
  zbbz: number | null;

  @Column('varchar', { name: 'scpc', nullable: true, length: 12 })
  scpc: string | null;

  @Column('varchar', { name: 'xdw', nullable: true, length: 20 })
  xdw: string | null;

  @Column('decimal', { name: 'xsl', precision: 12, scale: 4, default: 0 })
  xsl: number;

  @Column('decimal', { name: 'dfsl', precision: 12, scale: 4, default: 0 })
  dfsl: number;

  @Column('decimal', { name: 'mzdfsl', precision: 12, scale: 4, default: 0 })
  mzdfsl: number;

  @Column('decimal', { name: 'ssdfsl', precision: 12, scale: 4, default: 0 })
  ssdfsl: number;

  @Column('decimal', { name: 'xlsjg', precision: 12, scale: 4, default: 0 })
  xlsjg: number;

  @Column('decimal', { name: 'xpfjg', precision: 12, scale: 4, default: 0 })
  xpfjg: number;

  @Column('datetime', { name: 'scrq', nullable: true })
  scrq: Date | null;

  @Column('varchar', { name: 'zsm', length: 50, default: '' })
  zsm: string;

  @AfterLoad()
  trim() {
    if (this.ksid) {
      this.ksid = this.ksid.trim();
    }
    if (this.ypid) {
      this.ypid = this.ypid.trim();
    }
    if (this.scph) {
      this.scph = this.scph.trim();
    }
    if (this.gsid) {
      this.gsid = this.gsid.trim();
    }
    if (this.fphm) {
      this.fphm = this.fphm.trim();
    }
    if (this.zsm) {
      this.zsm = this.zsm.trim();
    }
  }
}
