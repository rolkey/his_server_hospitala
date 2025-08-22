import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';

@Entity('h11_yjk')
export class H11Yjk {
  @PrimaryColumn({ name: 'sjhm', type: 'varchar', length: 10 })
  sjhm: string;

  @PrimaryColumn({ name: 'sfsj', type: 'datetime' })
  @DateTransformer()
  sfsj: Date;

  @Column({ name: 'sjlx', type: 'smallint' })
  sjlx: number;

  @Column({ name: 'zybh', type: 'varchar', length: 12, nullable: true })
  zybh: string | null;

  @Column({ name: 'zyid', type: 'varchar', length: 12 })
  zyid: string;

  @Column({ name: 'brxm', type: 'varchar', length: 30, nullable: true })
  brxm: string | null;

  @Column({ name: 'ksid', type: 'varchar', length: 10 })
  ksid: string;

  @Column({ name: 'ksmc', type: 'varchar', length: 30 })
  ksmc: string;

  @Column({ name: 'fkfsid', type: 'varchar', length: 10 })
  fkfsid: string;

  @Column({ name: 'fkfsmc', type: 'varchar', length: 30 })
  fkfsmc: string;

  @Column({ name: 'yjje', type: 'decimal', precision: 16, scale: 4 })
  yjje: number;

  @Column({ name: 'hbhl', type: 'decimal', precision: 16, scale: 4 })
  hbhl: number;

  @Column({ name: 'rmbje', type: 'decimal', precision: 16, scale: 4 })
  rmbje: number;

  @Column({ name: 'zphm', type: 'varchar', length: 20, nullable: true })
  zphm: string | null;

  @Column({ name: 'yhid', type: 'varchar', length: 10, nullable: true })
  yhid: string | null;

  @Column({ name: 'yhzh', type: 'varchar', length: 20, nullable: true })
  yhzh: string | null;

  @Column({ name: 'sfyid', type: 'varchar', length: 10 })
  sfyid: string;

  @Column({ name: 'sfyxm', type: 'varchar', length: 30 })
  sfyxm: string;

  @Column({ name: 'sjzt', type: 'smallint' })
  sjzt: number;

  @Column({ name: 'zfyid', type: 'varchar', length: 10, nullable: true })
  zfyid: string | null;

  @Column({ name: 'zfyxm', type: 'varchar', length: 30, nullable: true })
  zfyxm: string | null;

  @Column({ name: 'zfyy', type: 'varchar', length: 30, nullable: true })
  zfyy: string | null;

  @Column({ name: 'jkrm', type: 'varchar', length: 30, nullable: true })
  jkrm: string | null;

  @Column({ name: 'jsbz', type: 'smallint' })
  jsbz: number;

  @Column({ name: 'jsdh', type: 'varchar', length: 10, nullable: true })
  jsdh: string | null;

  @Column({ name: 'tksj', type: 'datetime', nullable: true })
  @DateTransformer()
  tksj: Date | null;

  @Column({ name: 'bzxx', type: 'varchar', length: 60, nullable: true })
  bzxx: string | null;

  @Column({ name: 'bzxx1', type: 'varchar', length: 20, nullable: true })
  bzxx1: string | null;

  @Column({ name: 'jzrq', type: 'datetime', nullable: true })
  @DateTransformer()
  jzrq: Date | null;

  @Column({ name: 'jzbz', type: 'tinyint', nullable: true, default: 0 })
  jzbz: number | null;

  @Column({ name: 'jkdh', type: 'varchar', length: 12, nullable: true })
  jkdh: string | null;

  @Column({ name: 'fyksid', type: 'varchar', length: 20, nullable: true })
  fyksid: string | null;

  @Column({ name: 'bzxx2', type: 'varchar', length: 20, nullable: true })
  bzxx2: string | null;

  @Column({ name: 'dzfp', type: 'varchar', length: 30, nullable: true })
  dzfp: string | null;
}
