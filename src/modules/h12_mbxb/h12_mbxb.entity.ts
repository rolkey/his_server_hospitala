// src/h12_mbxb/h12_mbxb.entity.ts
import { Entity, PrimaryColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';

@Entity({ name: 'h12_mbxb', schema: 'sunsoft.dbo' })
export class H12_mbxb {
  @PrimaryColumn({ name: 'mblx', type: 'smallint' })
  mblx: number;

  @PrimaryColumn({ name: 'mbid', type: 'char', length: 12 })
  mbid: string;

  @PrimaryColumn({ name: 'mxxh', type: 'int' })
  mxxh: number;

  @Column({ name: 'xmid', type: 'varchar', length: 50, nullable: true })
  xmid: string | null;

  @Column({ name: 'xmmc', type: 'varchar', length: 100, nullable: true })
  xmmc: string | null;

  @Column({ name: 'jfyl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jfyl: number | null;

  @Column({ name: 'sjyl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  sjyl: number | null;

  @Column({ name: 'syffid', type: 'varchar', length: 10, nullable: true })
  syffid: string | null;

  @Column({ name: 'syplid', type: 'varchar', length: 10, nullable: true })
  syplid: string | null;

  @Column({ name: 'xmgg', type: 'varchar', length: 60, nullable: true })
  xmgg: string | null;

  @Column({ name: 'xmdw', type: 'varchar', length: 60, nullable: true })
  xmdw: string | null;

  @Column({ name: 'xmdj', type: 'decimal', precision: 16, scale: 4, nullable: true })
  xmdj: number | null;

  @Column({ name: 'typbz', type: 'varchar', length: 2, nullable: true })
  typbz: string | null;

  @Column({ name: 'tcbz', type: 'smallint', nullable: true })
  tcbz: number | null;

  @Column({ name: 'scdh', type: 'varchar', length: 10, nullable: true })
  scdh: string | null;

  @Column({ name: 'fylbid', type: 'varchar', length: 10, nullable: true })
  fylbid: string | null;

  @Column({ name: 'sfje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  sfje: number | null;

  @Column({ name: 'sfbz', type: 'smallint', nullable: true })
  sfbz: number | null;

  @Column({ name: 'fybz', type: 'varchar', length: 10, nullable: true })
  fybz: string | null;

  @Column({ name: 'bzxx', type: 'varchar', length: 200, nullable: true })
  bzxx: string | null;

  @Column({ name: 'zflx', type: 'varchar', length: 10, nullable: true })
  zflx: string | null;

  @Column({ name: 'xmzl', type: 'smallint', nullable: true })
  xmzl: number | null;

  @Column({ name: 'cjid', type: 'varchar', length: 10, nullable: true })
  cjid: string | null;

  @Column({ name: 'scph', type: 'varchar', length: 10, nullable: true })
  scph: string | null;

  @Column({ name: 'pfjg', type: 'decimal', precision: 16, scale: 4, nullable: true })
  pfjg: number | null;

  @Column({ name: 'szbz', type: 'smallint', nullable: true })
  szbz: number | null;

  @Column({ name: 'sjyl1', type: 'varchar', length: 10, nullable: true })
  sjyl1: string | null;

  @Column({ name: 'mrcs', type: 'tinyint', default: 0, nullable: true })
  mrcs: number | null;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'bz2', type: 'varchar', length: 10, nullable: true })
  bz2: string | null;

  @Column({ name: 'jldw', type: 'varchar', length: 10, nullable: true })
  jldw: string | null;

  @Column({ name: 'gsid', type: 'varchar', length: 30, nullable: true })
  gsid: string | null;

  @Column({ name: 'ypfl', type: 'varchar', length: 30, nullable: true })
  ypfl: string | null;

  @Column({ name: 'dwjb', type: 'int', default: 0, nullable: true })
  dwjb: number | null;

  @Column({ name: 'kyfs', type: 'int', default: 0, nullable: true })
  kyfs: number | null;

  @Column({ name: 'yzzh', type: 'decimal', precision: 12, scale: 0, nullable: true })
  yzzh: number | null;

  @Column({ name: 'yzmxxh', type: 'decimal', precision: 12, scale: 0, nullable: true })
  yzmxxh: number | null;

  @Column({ name: 'qt1', type: 'varchar', length: 30, nullable: true })
  qt1: string | null;

  @Column({ name: 'ltbz', type: 'varchar', length: 2, default: '', nullable: true })
  ltbz: string | null;

  @ManyToOne(() => h00_syff)
  @JoinColumn({ name: 'syffid', referencedColumnName: 'syffid' })
  syffidEntity: h00_syff;

  @ManyToOne(() => h00_sypl)
  @JoinColumn({ name: 'syplid', referencedColumnName: 'syplid' })
  syplidEntity: h00_sypl;
}
