import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';
import { Jbbmicd10 } from '../jbbmicd/jbbmicd10.entity';

@Entity('h23_rytz')
export class H23Rytz {
  @PrimaryColumn({ name: 'tzdh', type: 'varchar', length: 10 })
  tzdh: string;

  @Column({ name: 'brxm', type: 'varchar', length: 30, nullable: true })
  brxm: string | null;

  @Column({ name: 'mzid', type: 'varchar', length: 12, default: '' })
  mzid: string;

  @Column({ name: 'brxb', type: 'varchar', length: 10, default: '' })
  brxb: string;

  @Column({ name: 'brlxid', type: 'varchar', length: 10, default: '' })
  brlxid: string;

  @Column({ name: 'rysj', type: 'datetime', nullable: true })
  @DateTransformer()
  rysj: Date | null;

  @Column({ name: 'ryqk', type: 'varchar', length: 254, default: '' })
  ryqk: string;

  @Column({ name: 'bznr', type: 'varchar', length: 100, default: '' })
  bznr: string;

  @Column({ name: 'kdksid', type: 'varchar', length: 10, default: '' })
  kdksid: string;

  @Column({ name: 'lxdz', type: 'varchar', length: 100, nullable: true })
  lxdz: string | null;

  @Column({ name: 'tzdlx', type: 'smallint', default: 0 })
  tzdlx: number;

  @Column({ name: 'ryksid', type: 'varchar', length: 10, default: '' })
  ryksid: string;

  @Column({ name: 'ysid', type: 'varchar', length: 10, default: '' })
  ysid: string;

  @Column({ name: 'hsid', type: 'varchar', length: 10, default: '' })
  hsid: string;

  @Column({ name: 'sxysid', type: 'varchar', length: 10, default: '' })
  sxysid: string;

  @Column({ name: 'rybz', type: 'smallint', default: 0 })
  rybz: number;

  @Column({ name: 'brnl', type: 'varchar', length: 10, nullable: true })
  brnl: string | null;

  @Column({ name: 'nldw', type: 'varchar', length: 10, nullable: true })
  nldw: string | null;

  @Column({ name: 'brnl1', type: 'varchar', length: 10, nullable: true })
  brnl1: string | null;

  @Column({ name: 'nldw1', type: 'varchar', length: 10, nullable: true })
  nldw1: string | null;

  @Column({ name: 'csrq', type: 'datetime', nullable: true })
  csrq: Date | null;

  @Column({ name: 'sfzh', type: 'varchar', length: 18, nullable: true })
  sfzh: string | null;

  @Column({ name: 'hyzkmc', type: 'varchar', length: 20, nullable: true })
  hyzkmc: string | null;

  @Column({ name: 'hyid', type: 'varchar', length: 20, nullable: true })
  hyid: string | null;

  @Column({ name: 'mzmc', type: 'varchar', length: 18, nullable: true })
  mzmc: string | null;

  @Column({ name: 'lxdh', type: 'varchar', length: 15, nullable: true })
  lxdh: string | null;

  @Column({ name: 'bzxx1', type: 'varchar', length: 15, nullable: true })
  bzxx1: string | null;

  @Column({ name: 'bzxx2', type: 'varchar', length: 15, nullable: true })
  bzxx2: string | null;

  @Column({ name: 'ryff', type: 'varchar', length: 2, nullable: true })
  ryff: string | null;

  @Column({ name: 'sfdm', type: 'varchar', length: 15, nullable: true })
  sfdm: string | null;

  @Column({ name: 'sjdm', type: 'varchar', length: 15, nullable: true })
  sjdm: string | null;

  @Column({ name: 'jgdm', type: 'varchar', length: 15, nullable: true })
  jgdm: string | null;

  @Column({ name: 'xjdm', type: 'varchar', length: 15, nullable: true })
  xjdm: string | null;

  @Column({ name: 'hkyb', type: 'varchar', length: 10, nullable: true })
  hkyb: string | null;

  @Column({ name: 'lxrm', type: 'varchar', length: 8, nullable: true })
  lxrm: string | null;

  @Column({ name: 'lxrdh', type: 'varchar', length: 12, nullable: true })
  lxrdh: string | null;

  @Column({ name: 'dbry', type: 'varchar', length: 8, nullable: true })
  dbry: string | null;

  @Column({ name: 'zyys', type: 'varchar', length: 8, nullable: true })
  zyys: string | null;

  @Column({ name: 'bz4', type: 'varchar', length: 10, nullable: true })
  bz4: string | null;

  @Column({ name: 'bz1', type: 'varchar', length: 20, nullable: true })
  bz1: string | null;

  @Column({ name: 'gxid', type: 'varchar', length: 2, nullable: true })
  gxid: string | null;

  @Column({ name: 'hsidn', type: 'varchar', length: 8, nullable: true })
  hsidn: string | null;

  @Column({ name: 'yjk', type: 'decimal', precision: 16, scale: 2, nullable: true })
  yjk: number | null;

  @Column({ name: 'lxrsfzh', type: 'varchar', length: 20, nullable: true })
  lxrsfzh: string | null;

  @Column({ name: 'lxrdz', type: 'varchar', length: 100, nullable: true })
  lxrdz: string | null;

  @Column({ name: 'GG1', type: 'varchar', length: 12, nullable: true })
  GG1: string | null;

  @Column({ name: 'GG2', type: 'varchar', length: 12, nullable: true })
  GG2: string | null;

  @Column({ name: 'GG3', type: 'varchar', length: 12, nullable: true })
  GG3: string | null;

  @Column({ name: 'XZZ1', type: 'varchar', length: 12, nullable: true })
  XZZ1: string | null;

  @Column({ name: 'XZZ2', type: 'varchar', length: 12, nullable: true })
  XZZ2: string | null;

  @Column({ name: 'XZZ3', type: 'varchar', length: 12, nullable: true })
  XZZ3: string | null;

  @Column({ name: 'XZZ4', type: 'varchar', length: 12, nullable: true })
  XZZ4: string | null;

  @Column({ name: 'XZZ5', type: 'varchar', length: 80, nullable: true })
  XZZ5: string | null;

  @Column({ name: 'HKDZ1', type: 'varchar', length: 12, nullable: true })
  HKDZ1: string | null;

  @Column({ name: 'HKDZ2', type: 'varchar', length: 12, nullable: true })
  HKDZ2: string | null;

  @Column({ name: 'HKDZ3', type: 'varchar', length: 12, nullable: true })
  HKDZ3: string | null;

  @Column({ name: 'HKDZ4', type: 'varchar', length: 12, nullable: true })
  HKDZ4: string | null;

  @Column({ name: 'HKDZ5', type: 'varchar', length: 80, nullable: true })
  HKDZ5: string | null;

  @Column({ name: 'hkyb1', type: 'varchar', length: 8, nullable: true })
  hkyb1: string | null;

  @Column({ name: 'gzdw', type: 'varchar', length: 60, nullable: true })
  gzdw: string | null;

  @Column({ name: 'dwdh', type: 'varchar', length: 15, nullable: true })
  dwdh: string | null;

  @Column({ name: 'dwyb', type: 'varchar', length: 8, nullable: true })
  dwyb: string | null;

  @ManyToOne(() => Jbbmicd10)
  @JoinColumn({ name: 'ryqk', referencedColumnName: 'bzbm' })
  ryqkEntity: Jbbmicd10;
}
