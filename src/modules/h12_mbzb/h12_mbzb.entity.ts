// src/h12_mbzb/h12_mbzb.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'h12_mbzb', schema: 'sunsoft.dbo' })
export class H12_mbzb {
  @PrimaryColumn({ name: 'mbid', type: 'char', length: 12 })
  mbid: string;

  @PrimaryColumn({ name: 'mblx', type: 'smallint' })
  mblx: number;

  @Column({ name: 'mbmc', type: 'varchar', length: 50, nullable: true })
  mbmc: string | null;

  @Column({ name: 'mbbz', type: 'varchar', length: 30, nullable: true })
  mbbz: string | null;

  @Column({ name: 'pybm', type: 'varchar', length: 20, nullable: true })
  pybm: string | null;

  @Column({ name: 'wbbm', type: 'varchar', length: 20, nullable: true })
  wbbm: string | null;

  @Column({ name: 'qtbm', type: 'varchar', length: 20, nullable: true })
  qtbm: string | null;

  @Column({ name: 'ksid', type: 'varchar', length: 10, nullable: true })
  ksid: string | null;

  @Column({ name: 'mbfl', type: 'varchar', length: 10, nullable: true })
  mbfl: string | null;

  @Column({ name: 'ysid', type: 'varchar', length: 10, nullable: true })
  ysid: string | null;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'bz2', type: 'varchar', length: 10, nullable: true })
  bz2: string | null;

  @Column({ name: 'bz3', type: 'varchar', length: 10, nullable: true })
  bz3: string | null;
}
