// src/entities/xmzd.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h00_xmzd')
export class Xmzd {
  @PrimaryColumn({ name: 'xmid', length: 50 })
  xmid: string;

  @Column({ name: 'xmzl', type: 'int' })
  xmzl: number;

  @Column({ name: 'ggxh', length: 60, nullable: true })
  ggxh: string;

  @Column({ name: 'pfjg', type: 'decimal', precision: 16, scale: 4, nullable: true })
  pfjg: number;

  @Column({ name: 'cjid', length: 60, nullable: true })
  cjid: string;

  @Column({ name: 'scph', length: 30, nullable: true })
  scph: string;

  @Column({ name: 'sfdj', type: 'decimal', precision: 16, scale: 4, nullable: true })
  sfdj: number;

  @Column({ name: 'jldw', length: 60, nullable: true })
  jldw: string;

  @Column({ name: 'xmmc', length: 100, nullable: true })
  xmmc: string;

  @Column({ name: 'szbm', length: 20, nullable: true })
  szbm: string;

  @Column({ name: 'pybm', length: 20, nullable: true })
  pybm: string;

  @Column({ name: 'wbbm', length: 20, nullable: true })
  wbbm: string;

  @Column({ name: 'qtbm', length: 20, nullable: true })
  qtbm: string;

  @Column({ name: 'tcid', length: 10, nullable: true })
  tcid: string;

  @Column({ name: 'tcmc', length: 100, nullable: true })
  tcmc: string;

  @Column({ name: 'sfbz', type: 'int', nullable: true })
  sfbz: number;

  @Column({ name: 'fybz', length: 10, nullable: true })
  fybz: string;

  @Column({ name: 'fylbid', length: 10, nullable: true })
  fylbid: string;

  @Column({ name: 'bzxx', length: 50, nullable: true })
  bzxx: string;

  @Column({ name: 'zflx', length: 10, nullable: true })
  zflx: string;

  @Column({ name: 'ypfl', length: 20, nullable: true })
  ypfl: string;

  @Column({ name: 'tczfblid', length: 10, nullable: true })
  tczfblid: string;

  @Column({ name: 'sgfzfblid', length: 20, nullable: true })
  sgfzfblid: string;

  @Column({ name: 'qgfzfblid', length: 20, nullable: true })
  qgfzfblid: string;

  @Column({ name: 'cwflid', length: 20, nullable: true })
  cwflid: string;

  @Column({ name: 'sfdw', length: 100, nullable: true })
  sfdw: string;

  @Column({ name: 'gjybbm', length: 50, nullable: true })
  gjybbm: string;

  @Column({ name: 'sm', length: 200, nullable: true })
  sm: string;

  @Column({ name: 'gjybmc', length: 100, nullable: true })
  gjybmc: string;

  @Column({ name: 'htzfblid', length: 10, nullable: true })
  htzfblid: string;

  @Column({ name: 'dwjb', type: 'int', nullable: true })
  dwjb: number;

  @Column({ name: 'yxbz', type: 'int', default: 1 })
  yxbz: number;
}
