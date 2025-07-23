// src/entities/syspar.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('__syspar')
export class Syspar {
  @PrimaryColumn({ name: 'syid', length: 10 })
  syid: string;

  @PrimaryColumn({ name: 'prid', length: 50 })
  prid: string;

  @Column({ name: 'pnam', length: 100 })
  pnam: string;

  @Column({ name: 'pval', length: 255 })
  pval: string;
}
