import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';

@Entity('h23_mzzd', { schema: 'dbo' })
export class H23Mzzd {
  @PrimaryColumn({ name: 'mzid', type: 'varchar', length: 12 })
  mzid: string;

  @PrimaryColumn({ name: 'zdxh', type: 'decimal', precision: 18, scale: 0 })
  zdxh: number;

  @PrimaryColumn({ name: 'cfid', type: 'varchar', length: 20 })
  cfid: string;

  @Column({ name: 'zdmc', type: 'varchar', length: 60, nullable: true })
  zdmc: string | null;

  @Column({ name: 'bzmc', type: 'varchar', length: 80, nullable: true })
  bzmc: string | null;

  @Column({ name: 'zdbm', type: 'varchar', length: 30, nullable: true })
  zdbm: string | null;

  @Column({ name: 'zdbq', type: 'varchar', length: 10, nullable: true })
  zdbq: string | null;

  @Column({ name: 'zdlx', type: 'varchar', length: 10, nullable: true })
  zdlx: string | null;

  @Column({ name: 'bzxx', type: 'varchar', length: 30, nullable: true })
  bzxx: string | null;

  @Column({ name: 'bzxx1', type: 'varchar', length: 30, nullable: true })
  bzxx1: string | null;

  @Column({ name: 'sjbz', type: 'int', default: 0, nullable: true })
  sjbz: number | null;

  @Column({ name: 'fjbm', type: 'varchar', length: 30, nullable: true })
  fjbm: string | null;

  @Column({ name: 'fjmc', type: 'varchar', length: 60, nullable: true })
  fjmc: string | null;

  @Column({ name: 'tjbz', type: 'smallint', nullable: true })
  tjbz: number | null;

  @Column({ name: 'tjsj', type: 'datetime', nullable: true })
  @DateTransformer()
  tjsj: Date | null;

  @Column({ name: 'djsj', type: 'datetime', nullable: true })
  @DateTransformer()
  djsj: Date | null;

  @Column({ name: 'ysid', type: 'varchar', length: 10, nullable: true })
  ysid: string | null;

  @Column({ name: 'bz1', type: 'varchar', length: 20, nullable: true })
  bz1: string | null;

  @Column({ name: 'bz2', type: 'varchar', length: 20, nullable: true })
  bz2: string | null;

  @Column({ name: 'bz3', type: 'varchar', length: 20, nullable: true })
  bz3: string | null;

  @Column({ name: 'icd10', type: 'varchar', length: 30, nullable: true })
  icd10: string | null;

  @Column({ name: 'zwmc', type: 'varchar', length: 100, nullable: true })
  zwmc: string | null;

  @Column({ name: 'zyzb', type: 'varchar', length: 30, nullable: true, default: '' })
  zyzb: string | null;

  @Column({ name: 'cyzd2', type: 'varchar', length: 30, nullable: true, default: '' })
  cyzd2: string | null;

  @Column({ name: 'cyzd3', type: 'varchar', length: 30, nullable: true, default: '' })
  cyzd3: string | null;

  @Column({ name: 'cyzd4', type: 'varchar', length: 30, nullable: true, default: '' })
  cyzd4: string | null;

  @Column({ name: 'cyzd5', type: 'varchar', length: 30, nullable: true, default: '' })
  cyzd5: string | null;
}

