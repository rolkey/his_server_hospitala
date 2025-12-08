import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';

@Entity({ name: 'h22_SFJL', schema: 'dbo' })
export class H22Sfjl {
  @PrimaryColumn({ type: 'char', length: 12 })
  lsh: string;

  @Column({ type: 'char', length: 10, nullable: true })
  usid?: string;

  @Column({ type: 'char', length: 10, nullable: true })
  unam?: string;

  @Column({ type: 'datetime', nullable: true })
  @DateTransformer()
  rq?: Date;

  @Column({ type: 'datetime', nullable: true })
  @DateTransformer()
  s_date?: Date;

  @Column({ type: 'datetime', nullable: true })
  @DateTransformer()
  e_date?: Date;

  @Column({ type: 'char', length: 12, nullable: true })
  s_fphm?: string;

  @Column({ type: 'char', length: 12, nullable: true })
  e_fphm?: string;

  @Column({ type: 'int', nullable: true })
  jsbz?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  jshj?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  mzje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  mzybje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  mzjzje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  mzxnhje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  mzgfje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  mzjbje?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mzfphm?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mzzfhm?: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zyje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zybjk?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zytk?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zyyjk?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zyjsk?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zyybje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zygfje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zyxnhje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  zyjbje?: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  qtje?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  zyfphm?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  zyzfhm?: string;

  @Column({ type: 'int', nullable: true })
  shbz?: number;

  @Column({ type: 'char', length: 10, nullable: true })
  shry?: string;

  @Column({ type: 'datetime', nullable: true })
  @DateTransformer()
  shrq?: Date;

  @Column({ type: 'char', length: 10, nullable: true })
  sjzt?: string;

  @Column({ type: 'char', length: 30, nullable: true })
  bzxx?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mzs?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  zys?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  yjks?: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  mzpos?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  zyyjkpos?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  zyjspos?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  qtje1?: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  qtje2?: number;

  @Column({ type: 'smallint', nullable: true, default: 0 })
  jslx?: number;

  @Column({ type: 'varchar', length: 10, nullable: true, default: '0' })
  fyid?: string;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  xjje?: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  yhje?: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  wxje?: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  jmje?: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  kje?: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  bsje?: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  qte1?: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, nullable: true, default: 0 })
  qte2?: number;
}
