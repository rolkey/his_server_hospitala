import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';

@Entity('h11_jszb')
export class H11Jszb {
  @PrimaryColumn({ name: 'jsdh', type: 'varchar', length: 10 })
  jsdh: string;

  @Column({ name: 'zybh', type: 'varchar', length: 12, nullable: true })
  zybh: string | null;

  @Column({ name: 'brxm', type: 'varchar', length: 30, nullable: true })
  brxm: string | null;

  @Column({ name: 'xbid', type: 'varchar', length: 10, nullable: true })
  xbid: string | null;

  @DateTransformer()
  @Column({ name: 'rysj', type: 'datetime', nullable: true })
  rysj: Date | null;

  @Column({ name: 'zyid', type: 'varchar', length: 12, nullable: true })
  zyid: string | null;

  @Column({ name: 'jslx', type: 'int', nullable: true })
  jslx: number | null;

  @Column({ name: 'jsje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jsje: number | null;

  @Column({ name: 'zfje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  zfje: number | null;

  @Column({ name: 'gfje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  gfje: number | null;

  @Column({ name: 'jmje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jmje: number | null;

  @Column({ name: 'qfje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  qfje: number | null;

  @Column({ name: 'ssje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  ssje: number | null;

  @Column({ name: 'jmlxid', type: 'varchar', length: 10, nullable: true })
  jmlxid: string | null;

  @Column({ name: 'fpzh', type: 'varchar', length: 20, nullable: true })
  fpzh: string | null;

  @Column({ name: 'yjje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  yjje: number | null;

  @Column({ name: 'syje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  syje: number | null;

  @DateTransformer()
  @Column({ name: 'zzsj', type: 'datetime', nullable: true })
  zzsj: Date | null;

  @Column({ name: 'ksid', type: 'varchar', length: 10, nullable: true })
  ksid: string | null;

  @Column({ name: 'ksmc', type: 'varchar', length: 30, nullable: true })
  ksmc: string | null;

  @Column({ name: 'jsyid', type: 'varchar', length: 10, nullable: true })
  jsyid: string | null;

  @Column({ name: 'jssj', type: 'datetime', nullable: true })
  @DateTransformer()
  jssj: Date | null;

  @Column({ name: 'jsyxm', type: 'varchar', length: 30, nullable: true })
  jsyxm: string | null;

  @Column({ name: 'fpbz', type: 'int', nullable: true })
  fpbz: number | null;

  @Column({ name: 'czf', type: 'decimal', precision: 16, scale: 4, nullable: true })
  czf: number | null;

  @Column({ name: 'sjzt', type: 'int', nullable: true })
  sjzt: number | null;

  @DateTransformer()
  @Column({ name: 'sfsj', type: 'datetime', nullable: true })
  sfsj: Date | null;

  @Column({ name: 'fphm', type: 'varchar', length: 10, nullable: true })
  fphm: string | null;
}
