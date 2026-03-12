import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';

@Entity('h00_brlb', { schema: 'dbo' })
export class H00Brlb {
  @PrimaryColumn({ name: 'brlbid', type: 'varchar', length: 10 })
  brlbid: string;

  @Column({ name: 'brlbmc', type: 'varchar', length: 30, nullable: true })
  brlbmc: string | null;

  @Column({ name: 'szbm', type: 'varchar', length: 20, nullable: true })
  szbm: string | null;

  @Column({ name: 'pybm', type: 'varchar', length: 20, nullable: true })
  pybm: string | null;

  @Column({ name: 'wbbm', type: 'varchar', length: 20, nullable: true })
  wbbm: string | null;

  @Column({ name: 'qtbm', type: 'varchar', length: 20, nullable: true })
  qtbm: string | null;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'bz2', type: 'varchar', length: 10, nullable: true })
  bz2: string | null;

  @Column({ name: 'zfbl', type: 'decimal', precision: 18, scale: 2, nullable: true })
  zfbl: number | null;

  @Column({ name: 'data_sta', type: 'datetime', nullable: true })
  @DateTransformer()
  dataSta: Date | null;

  @Column({ name: 'data_end', type: 'datetime', nullable: true })
  @DateTransformer()
  dataEnd: Date | null;

  @Column({ name: 'je1', type: 'decimal', precision: 18, scale: 2, nullable: true })
  je1: number | null;

  @Column({ name: 'je2', type: 'decimal', precision: 18, scale: 2, nullable: true })
  je2: number | null;

  @Column({ name: 'hbbz', type: 'int', default: 0, nullable: true })
  hbbz: number | null;

  @Column({ name: 'yxbz', type: 'int', default: 0, nullable: true })
  yxbz: number | null;

  @Column({ name: 'brdl', type: 'varchar', length: 10, nullable: true })
  brdl: string | null;
}
