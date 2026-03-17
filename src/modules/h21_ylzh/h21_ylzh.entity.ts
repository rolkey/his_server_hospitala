import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';
import { H00Brlb } from '../h00_brlb/h00_brlb.entity';
import { H00Gxzd } from '../h00_gxzd/h00_gxzd.entity';

@Entity('h21_ylzh')
export class H21Ylzh {
  @PrimaryColumn({ name: 'ylzh', type: 'varchar', length: 20 })
  ylzh: string;

  @Column({ name: 'yllx', type: 'varchar', length: 10, nullable: true })
  yllx: string | null;

  @Column({ name: 'brxm', type: 'varchar', length: 60, nullable: true })
  brxm: string | null;

  @Column({ name: 'brnl', type: 'varchar', length: 10, nullable: true })
  brnl: string | null;

  @Column({ name: 'xbid', type: 'varchar', length: 10, nullable: true })
  xbid: string | null;

  @Column({ name: 'jtdz', type: 'varchar', length: 60, nullable: true })
  jtdz: string | null;

  @Column({ name: 'lxdh', type: 'varchar', length: 15, nullable: true })
  lxdh: string | null;

  @Column({ name: 'lxry', type: 'varchar', length: 10, nullable: true })
  lxry: string | null;

  @Column({ name: 'zdqk', type: 'varchar', length: 30, nullable: true })
  zdqk: string | null;

  @Column({ name: 'jzys', type: 'varchar', length: 10, nullable: true })
  jzys: string | null;

  @Column({ name: 'zzys', type: 'varchar', length: 10, nullable: true })
  zzys: string | null;

  @Column({ name: 'ywry', type: 'varchar', length: 10, nullable: true })
  ywry: string | null;

  @Column({ name: 'ywdh', type: 'varchar', length: 15, nullable: true })
  ywdh: string | null;

  @Column({ name: 'djry', type: 'varchar', length: 10, nullable: true })
  djry: string | null;

  @Column({ name: 'djsj', type: 'datetime', nullable: true })
  djsj: Date | null;

  @Column({ name: 'yxbz', type: 'smallint', nullable: true })
  yxbz: number | null;

  @Column({ name: 'yjk', type: 'numeric', precision: 18, scale: 2, nullable: true })
  yjk: number | null;

  @Column({ name: 'syje', type: 'numeric', precision: 18, scale: 2, nullable: true })
  syje: number | null;

  @Column({ name: 'jf', type: 'decimal', precision: 18, scale: 2, nullable: true })
  jf: number | null;

  @Column({ name: 'jfsy', type: 'decimal', precision: 18, scale: 2, nullable: true })
  jfsy: number | null;

  @Column({ name: 'bzxx', type: 'varchar', length: 30, nullable: true })
  bzxx: string | null;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'oylzh', type: 'varchar', length: 20, nullable: true })
  oylzh: string | null;

  @Column({ name: 'oylzh1', type: 'varchar', length: 20, nullable: true })
  oylzh1: string | null;

  @Column({ name: 'je1', type: 'numeric', precision: 16, scale: 2, nullable: true })
  je1: number | null;

  @Column({ name: 'je2', type: 'numeric', precision: 16, scale: 2, nullable: true })
  je2: number | null;

  @Column({ name: 'rq1', type: 'datetime', nullable: true })
  rq1: Date | null;

  @Column({ name: 'rq2', type: 'datetime', nullable: true })
  rq2: Date | null;

  @Column({ name: 'hyzk', type: 'varchar', length: 10, nullable: true })
  hyzk: string | null;

  @Column({ name: 'mz', type: 'varchar', length: 10, nullable: true })
  mz: string | null;

  @Column({ name: 'mjly', type: 'varchar', length: 10, nullable: true })
  mjly: string | null;

  @Column({ name: 'gj', type: 'varchar', length: 10, nullable: true })
  gj: string | null;

  @Column({ name: 'zy', type: 'varchar', length: 10, nullable: true })
  zy: string | null;

  @Column({ name: 'xx', type: 'varchar', length: 10, nullable: true })
  xx: string | null;

  @Column({ name: 'lxdz', type: 'varchar', length: 60, nullable: true })
  lxdz: string | null;

  @Column({ name: 'gzdz', type: 'varchar', length: 60, nullable: true })
  gzdz: string | null;

  @Column({ name: 'dh', type: 'varchar', length: 15, nullable: true })
  dh: string | null;

  @Column({ name: 'email', type: 'varchar', length: 15, nullable: true })
  email: string | null;

  @Column({ name: 'yzbm', type: 'varchar', length: 10, nullable: true })
  yzbm: string | null;

  @Column({ name: 'fkfs', type: 'varchar', length: 8, nullable: true })
  fkfs: string | null;

  @Column({ name: 'ybzh', type: 'varchar', length: 15, nullable: true })
  ybzh: string | null;

  @Column({ name: 'hybz', type: 'varchar', length: 2, nullable: true })
  hybz: string | null;

  @Column({ name: 'hypw', type: 'varchar', length: 8, nullable: true })
  hypw: string | null;

  @Column({ name: 'bzxx1', type: 'varchar', length: 60, nullable: true })
  bzxx1: string | null;

  @Column({ name: 'bzxx2', type: 'varchar', length: 60, nullable: true })
  bzxx2: string | null;

  @Column({ name: 'nldw', type: 'varchar', length: 4, nullable: true })
  nldw: string | null;

  @Column({ name: 'sfzh', type: 'varchar', length: 18, nullable: true })
  sfzh: string | null;

  @Column({ name: 'csrq', type: 'datetime', nullable: true })
  @DateTransformer()
  csrq: Date | null;

  @Column({ name: 'patient_id', type: 'varchar', length: 20, nullable: true })
  patientId: string | null;

  @Column({ name: 'dqdm1', type: 'varchar', length: 20, nullable: true })
  dqdm1: string | null;

  @Column({ name: 'dqdm2', type: 'varchar', length: 20, nullable: true })
  dqdm2: string | null;

  @Column({ name: 'dqdm3', type: 'varchar', length: 20, nullable: true })
  dqdm3: string | null;

  @Column({ name: 'dqdm4', type: 'varchar', length: 20, nullable: true })
  dqdm4: string | null;

  @Column({ name: 'dqdm5', type: 'varchar', length: 20, nullable: true })
  dqdm5: string | null;

  @Column({ name: 'abocode', type: 'varchar', length: 4, nullable: true })
  abocode: string | null;

  @Column({ name: 'rhcode', type: 'varchar', length: 4, nullable: true })
  rhcode: string | null;

  @Column({ name: 'xlcode', type: 'varchar', length: 4, nullable: true })
  xlcode: string | null;

  @Column({ name: 'xwcode', type: 'varchar', length: 4, nullable: true })
  xwcode: string | null;

  @Column({ name: 'gxid', type: 'varchar', length: 4, nullable: true })
  gxid: string | null;

  @Column({ name: 'bkh', type: 'varchar', length: 10, nullable: true })
  bkh: string | null;

  @Column({ name: 'jkh', type: 'varchar', length: 20, nullable: true })
  jkh: string | null;

  @Column({ name: 'gms', type: 'varchar', length: 80, nullable: true })
  gms: string | null;

  @Column({ name: 'bls', type: 'varchar', length: 20, nullable: true })
  bls: string | null;

  @Column({ name: 'bzz1', type: 'varchar', length: 10, nullable: true })
  bzz1: string | null;

  @Column({ name: 'bzz2', type: 'varchar', length: 10, nullable: true })
  bzz2: string | null;

  @Column({ name: 'bzz3', type: 'varchar', length: 10, nullable: true })
  bzz3: string | null;

  @Column({ name: 'dqdm6', type: 'varchar', length: 60, nullable: true })
  dqdm6: string | null;

  @Column({ name: 'dzjkk', type: 'varchar', length: 100, default: '' })
  dzjkk: string;

  @Column({ name: 'infection_sync', type: 'varchar', length: 1, nullable: true })
  infectionSync: string | null;

  @Column({ name: 'pybm', type: 'varchar', length: 20, nullable: true })
  pybm: string | null;

  @Column({ name: 'wbbm', type: 'varchar', length: 20, nullable: true })
  wbbm: string | null;

  @Column({ name: 'qtbm', type: 'varchar', length: 20, nullable: true })
  qtbm: string | null;

  @Column({ name: 'openid', type: 'varchar', length: 128, nullable: true })
  openid: string | null;

  @ManyToOne(() => H00Brlb)
  @JoinColumn({ name: 'bzxx1', referencedColumnName: 'brlbid' })
  brlbEntity: H00Brlb;

  @ManyToOne(() => H00Gxzd)
  @JoinColumn({ name: 'gxid', referencedColumnName: 'gxid' })
  gxdzEntity: H00Gxzd;
}
