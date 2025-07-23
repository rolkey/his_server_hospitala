// src/entities/kcxx.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h31_kcxx')
export class Kcxx {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'ypid', length: 50 })
  ypid: string;

  @Column({ name: 'ksid', length: 10 })
  ksid: string;

  @Column({ name: 'pfjg', type: 'decimal', precision: 16, scale: 4, nullable: true })
  pfjg: number;

  @Column({ name: 'cjid', length: 60, nullable: true })
  cjid: string;

  @Column({ name: 'scph', length: 30, nullable: true })
  scph: string;

  @Column({ name: 'lsjg', type: 'decimal', precision: 16, scale: 4, nullable: true })
  lsjg: number;

  @Column({ name: 'gsid', length: 10, nullable: true })
  gsid: string;

  @Column({ name: 'xsl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  xsl: number;

  @Column({ name: 'dfsl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  dfsl: number;

  @Column({ name: 'mzdfsl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  mzdfsl: number;

  @Column({ name: 'ssdfsl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  ssdfsl: number;

  @Column({ name: 'scpc', length: 30, nullable: true })
  scpc: string;

  @Column({ name: 'sxrq', type: 'datetime', nullable: true })
  sxrq: Date;

  @Column({ name: 'yxbz', type: 'int', default: 1 })
  yxbz: number;
}
