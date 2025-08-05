import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'h00_tcxb', schema: 'dbo' })
export class H00Tcxb {
  @PrimaryColumn({ name: 'tcid', type: 'varchar', length: 10, default: '' })
  tcid: string;

  @PrimaryColumn({ name: 'mxxh', type: 'int', default: 0 })
  mxxh: number;

  @Column({ name: 'xmid', type: 'varchar', length: 50, nullable: true })
  xmid: string | null;

  @Column({ name: 'xmmc', type: 'varchar', length: 100, nullable: true })
  xmmc: string | null;

  @Column({ name: 'dwzl', type: 'tinyint', default: 0, nullable: true })
  dwzl: number | null;

  @Column({ name: 'jldw', type: 'varchar', length: 60, nullable: true })
  jldw: string | null;

  @Column({ name: 'jldj', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  jldj: number | null;

  @Column({ name: 'jlsl', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  jlsl: number | null;

  @Column({ name: 'slsx', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  slsx: number | null;

  @Column({ name: 'slxx', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  slxx: number | null;

  @Column({ name: 'sfbz', type: 'tinyint', default: 0, nullable: true })
  sfbz: number | null;

  @Column({ name: 'xzbz', type: 'tinyint', default: 1, nullable: true })
  xzbz: number | null;

  @Column({ name: 'fybz', type: 'varchar', length: 10, default: '', nullable: true })
  fybz: string | null;

  @Column({ name: 'fylbid', type: 'varchar', length: 10, default: '', nullable: true })
  fylbid: string | null;

  @Column({ name: 'cjid', type: 'varchar', length: 60, nullable: true })
  cjid: string | null;

  @Column({ name: 'scph', type: 'varchar', length: 10, default: '', nullable: true })
  scph: string | null;

  @Column({ name: 'pfjg', type: 'decimal', precision: 16, scale: 4, default: 0, nullable: true })
  pfjg: number | null;

  @Column({ name: 'xmgg', type: 'varchar', length: 60, nullable: true })
  xmgg: string | null;

  @Column({ name: 'zflx', type: 'varchar', length: 10, default: '', nullable: true })
  zflx: string | null;

  @Column({ name: 'xmzl', type: 'smallint', nullable: true })
  xmzl: number | null;

  @Column({ name: 'bzxx', type: 'varchar', length: 20, nullable: true })
  bzxx: string | null;

  @Column({ name: 'syffid', type: 'varchar', length: 10, nullable: true })
  syffid: string | null;

  @Column({ name: 'syplid', type: 'varchar', length: 10, nullable: true })
  syplid: string | null;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'bz2', type: 'varchar', length: 10, nullable: true })
  bz2: string | null;

  @Column({ name: 'bz3', type: 'varchar', length: 10, nullable: true })
  bz3: string | null;

  @Column({ name: 'qt2', type: 'varchar', length: 30, nullable: true })
  qt2: string | null;

  @Column({ name: 'qt3', type: 'varchar', length: 30, nullable: true })
  qt3: string | null;

  @Column({ name: 'ltbz', type: 'varchar', length: 2, default: '', nullable: true })
  ltbz: string | null;
}
