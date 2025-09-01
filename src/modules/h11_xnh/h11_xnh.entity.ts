import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('H11_xnh')
export class H11Xnh {
  @PrimaryColumn({ name: 'fphm', type: 'varchar', length: 15 })
  fphm: string;

  @Column({ name: 'zyid', type: 'varchar', length: 12, nullable: true })
  zyid: string | null;

  @Column({ name: 'zyh', type: 'varchar', length: 12, nullable: true })
  zyh: string | null;

  @Column({ name: 'brxm', type: 'varchar', length: 10, nullable: true })
  brxm: string | null;

  @Column({ name: 'ylzh', type: 'varchar', length: 20, nullable: true })
  ylzh: string | null;

  @Column({ name: 'fyhj', type: 'decimal', precision: 18, scale: 2, nullable: true })
  fyhj: number | null;

  @Column({ name: 'kbhj', type: 'decimal', precision: 18, scale: 2, nullable: true })
  kbhj: number | null;

  @Column({ name: 'sjhj', type: 'decimal', precision: 18, scale: 2, nullable: true })
  sjhj: number | null;

  @Column({ name: 'bsbl', type: 'decimal', precision: 18, scale: 2, nullable: true })
  bsbl: number | null;

  @Column({ name: 'ljfyhj', type: 'decimal', precision: 18, scale: 2, nullable: true })
  ljfyhj: number | null;

  @Column({ name: 'ljfykb', type: 'decimal', precision: 18, scale: 2, nullable: true })
  ljfykb: number | null;

  @Column({ name: 'ljsjhj', type: 'decimal', precision: 18, scale: 2, nullable: true })
  ljsjhj: number | null;

  @Column({ name: 'lxdz', type: 'varchar', length: 10, nullable: true })
  lxdz: string | null;

  @Column({ name: 'jgmc', type: 'varchar', length: 10, nullable: true })
  jgmc: string | null;

  @Column({ name: 'sfje', type: 'decimal', precision: 16, scale: 2, nullable: true })
  sfje: number | null;

  @Column({ name: 'dbje', type: 'decimal', precision: 12, scale: 2, nullable: true })
  dbje: number | null;

  @Column({ name: 'yhje', type: 'decimal', precision: 12, scale: 2, nullable: true })
  yhje: number | null;

  @Column({ name: 'yhkh', type: 'varchar', length: 20, nullable: true })
  yhkh: string | null;

  @Column({ name: 'je1', type: 'decimal', precision: 12, scale: 2, nullable: true })
  je1: number | null;

  @Column({ name: 'je2', type: 'decimal', precision: 12, scale: 2, nullable: true })
  je2: number | null;

  @Column({ name: 'bz1', type: 'varchar', length: 60, nullable: true })
  bz1: string | null;

  @Column({ name: 'xnhj', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  xnhj: number | null;

  @Column({ name: 'je3', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  je3: number | null;

  @Column({ name: 'szbz', type: 'tinyint', nullable: true, default: 0 })
  szbz: number | null;

  @Column({ name: 'mzbc', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  mzbc: number | null;

  @Column({ name: 'qtje1', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  qtje1: number | null;

  @Column({ name: 'qtje2', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  qtje2: number | null;

  @Column({ name: 'qtje3', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  qtje3: number | null;

  @Column({ name: 'qtje4', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  qtje4: number | null;

  @Column({ name: 'bzxx', type: 'varchar', length: 30, nullable: true })
  bzxx: string | null;

  @Column({ name: 'zfje', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  zfje: number | null;

  @Column({ name: 'qt1', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  qt1: number | null;

  @Column({ name: 'qt2', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  qt2: number | null;

  @Column({ name: 'qt3', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  qt3: number | null;

  @Column({ name: 'qt4', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  qt4: number | null;

  @Column({ name: 'yfje', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  yfje: number | null;

  @Column({ name: 'yfje1', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  yfje1: number | null;

  @Column({ name: 'yfje2', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  yfje2: number | null;

  @Column({ name: 'yfje3', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  yfje3: number | null;

  @Column({ name: 'yfje4', type: 'decimal', precision: 12, scale: 2, nullable: true, default: 0 })
  yfje4: number | null;
}
