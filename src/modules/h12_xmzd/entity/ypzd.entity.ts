// src/entities/ypzd.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h30_ypzd')
export class Ypzd {
  @PrimaryColumn({ name: 'ypid', length: 50 })
  ypid: string;

  @Column({ name: 'ypgg', length: 60, nullable: true })
  ypgg: string;

  @Column({ name: 'ysxs', type: 'int', nullable: true })
  ysxs: number;

  @Column({ name: 'sjjl', length: 60, nullable: true })
  sjjl: string;

  @Column({ name: 'zwmc', length: 100, nullable: true })
  zwmc: string;

  @Column({ name: 'szbm', length: 20, nullable: true })
  szbm: string;

  @Column({ name: 'pybm', length: 20, nullable: true })
  pybm: string;

  @Column({ name: 'wbbm', length: 20, nullable: true })
  wbbm: string;

  @Column({ name: 'qtbm', length: 20, nullable: true })
  qtbm: string;

  @Column({ name: 'ypflid', length: 10, nullable: true })
  ypflid: string;

  @Column({ name: 'abcfl', type: 'int', nullable: true })
  abcfl: number;

  @Column({ name: 'ybfl', length: 20, nullable: true })
  ybfl: string;

  @Column({ name: 'zzbz', type: 'int', nullable: true })
  zzbz: number;

  @Column({ name: 'jsl1', type: 'int', nullable: true })
  jsl1: number;

  @Column({ name: 'cfqj', length: 10, nullable: true })
  cfqj: string;

  @Column({ name: 'hldw', length: 8, nullable: true })
  hldw: string;

  @Column({ name: 'hlxs', type: 'decimal', precision: 16, scale: 4, nullable: true })
  hlxs: number;

  @Column({ name: 'ypflbm', length: 20, nullable: true })
  ypflbm: string;

  @Column({ name: 'fylbid', length: 10, nullable: true })
  fylbid: string;

  @Column({ name: 'syplid', length: 10, nullable: true })
  syplid: string;

  @Column({ name: 'pwjj', type: 'int', nullable: true })
  pwjj: number;

  @Column({ name: 'syffid', length: 10, nullable: true })
  syffid: string;

  @Column({ name: 'bz1', length: 10, nullable: true })
  bz1: string;

  @Column({ name: 'jsl2', type: 'int', nullable: true })
  jsl2: number;

  @Column({ name: 'qt6', type: 'int', nullable: true })
  qt6: number;

  @Column({ name: 'ypfl', length: 10, nullable: true })
  ypfl: string;

  @Column({ name: 'gjybbm', length: 50, nullable: true })
  gjybbm: string;

  @Column({ name: 'zysx', length: 200, nullable: true })
  zysx: string;

  @Column({ name: 'gjybmc', length: 100, nullable: true })
  gjybmc: string;

  @Column({ name: 'qt7', type: 'int', nullable: true })
  qt7: number;
}
