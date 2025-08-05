// src/h00_tcxb_zyfj/entity/h00_tcxb_zyfj.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'h00_tcxb_zyfj', schema: 'sunsoft.dbo' })
export class H00TcxbZyfj {
  @PrimaryColumn({ name: 'tcid', type: 'varchar', length: 20 })
  tcid: string;

  @PrimaryColumn({ name: 'mxxh', type: 'int' })
  mxxh: number;

  @Column({ name: 'xmid', type: 'varchar', length: 50 })
  xmid: string;

  @Column({ name: 'xmmc', type: 'varchar', length: 100, nullable: true })
  xmmc: string | null;

  @Column({ name: 'dwzl', type: 'tinyint', nullable: true })
  dwzl: number | null;

  @Column({ name: 'jldw', type: 'varchar', length: 60, nullable: true })
  jldw: string | null;

  @Column({ name: 'jldj', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jldj: number | null;

  @Column({ name: 'jlsl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jlsl: number | null;

  @Column({ name: 'slsx', type: 'decimal', precision: 16, scale: 4, nullable: true })
  slsx: number | null;

  @Column({ name: 'slxx', type: 'decimal', precision: 16, scale: 4, nullable: true })
  slxx: number | null;

  @Column({ name: 'sfbz', type: 'tinyint', nullable: true })
  sfbz: number | null;

  @Column({ name: 'xzbz', type: 'tinyint', nullable: true })
  xzbz: number | null;

  @Column({ name: 'fybz', type: 'varchar', length: 10, nullable: true })
  fybz: string | null;

  @Column({ name: 'fylbid', type: 'varchar', length: 10, nullable: true })
  fylbid: string | null;

  @Column({ name: 'cjid', type: 'varchar', length: 60, nullable: true })
  cjid: string | null;

  @Column({ name: 'scph', type: 'varchar', length: 10, nullable: true })
  scph: string | null;

  @Column({ name: 'pfjg', type: 'decimal', precision: 16, scale: 4, nullable: true })
  pfjg: number | null;

  @Column({ name: 'xmgg', type: 'varchar', length: 60, nullable: true })
  xmgg: string | null;

  @Column({ name: 'zflx', type: 'varchar', length: 10, nullable: true })
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

  @Column({ name: 'ltbz', type: 'varchar', length: 2, nullable: true })
  ltbz: string | null;

  @Column({ name: 'sjyl1', type: 'varchar', length: 20, nullable: true })
  sjyl1: string | null;

  @Column({ name: 'xmdw', type: 'varchar', length: 60, nullable: true })
  xmdw: string | null;

  @Column({ name: 'typbz', type: 'varchar', length: 10, nullable: true })
  typbz: string | null;

  @Column({ name: 'kyfs', type: 'smallint', nullable: true })
  kyfs: number | null;

  @Column({ name: 'kyts', type: 'smallint', nullable: true })
  kyts: number | null;
}
