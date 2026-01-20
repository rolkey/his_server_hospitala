import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';

@Entity({ name: 'h13_yzzxcs_delete', schema: 'dbo' })
export class H13YzzxcsDelete {
  @PrimaryColumn({ name: 'yzxh', type: 'int' })
  yzxh: number;

  @PrimaryColumn({ name: 'mxxh', type: 'int' })
  mxxh: number;

  @PrimaryColumn({ name: 'yzlx', type: 'int' })
  yzlx: number;

  @PrimaryColumn({ name: 'zyid', type: 'varchar', length: 12 })
  zyid: string;

  @PrimaryColumn({ name: 'zxrq', type: 'datetime' })
  zxrq: Date;

  @Column({ name: 'ksid', type: 'varchar', length: 10, nullable: true })
  ksid: string | null;

  @Column({ name: 'fydh', type: 'varchar', length: 12, nullable: true })
  fydh: string | null;

  @Column({ name: 'zybh', type: 'varchar', length: 12, nullable: true })
  zybh: string | null;

  @Column({ name: 'jfyl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jfyl: number | null;

  @Column({ name: 'xmdj', type: 'decimal', precision: 16, scale: 4, nullable: true })
  xmdj: number | null;

  @Column({ name: 'sfbz', type: 'smallint', nullable: true })
  sfbz: number | null;

  @Column({ name: 'fylbid', type: 'varchar', length: 10, nullable: true })
  fylbid: string | null;

  @Column({ name: 'jsdh', type: 'varchar', length: 10, nullable: true })
  jsdh: string | null;

  @Column({ name: 'jsbz', type: 'smallint', default: 0, nullable: true })
  jsbz: number | null;

  @Column({ name: 'zxcs2', type: 'int', nullable: true })
  zxcs2: number | null;

  @Column({ name: 'zxhs', type: 'varchar', length: 10, nullable: true })
  zxhs: string | null;

  @Column({ name: 'zxsj', type: 'varchar', length: 20, nullable: true })
  zxsj: string | null;

  @Column({ name: 'zflx', type: 'varchar', length: 12, nullable: true })
  zflx: string | null;

  @Column({ name: 'syffid', type: 'varchar', length: 10, nullable: true })
  syffid: string | null;

  @Column({ name: 'bzxcs', type: 'int', default: 0, nullable: true })
  bzxcs: number | null;

  @Column({ name: 'tyrid', type: 'varchar', length: 10, nullable: true })
  tyrid: string | null;

  @Column({ name: 'tysj', type: 'datetime', nullable: true })
  tysj: Date | null;

  @Column({ name: 'sqtysl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  sqtysl: number | null;

  @Column({ name: 'sjtysl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  sjtysl: number | null;

  @Column({ name: 'syrid', type: 'varchar', length: 10, nullable: true })
  syrid: string | null;

  @Column({ name: 'sysj', type: 'datetime', nullable: true })
  sysj: Date | null;

  @Column({ name: 'kyts', type: 'int', nullable: true })
  kyts: number | null;

  @Column({ name: 'zfbl', type: 'decimal', precision: 16, scale: 4, nullable: true })
  zfbl: number | null;

  @Column({ name: 'fybz', type: 'smallint', default: 0, nullable: true })
  fybz: number | null;

  @Column({ name: 'fysj', type: 'datetime', nullable: true })
  fysj: Date | null;

  @Column({ name: 'fyrid', type: 'varchar', length: 10, nullable: true })
  fyrid: string | null;

  @Column({ name: 'zxcs', type: 'decimal', precision: 16, scale: 4, nullable: true })
  zxcs: number | null;

  @Column({ name: 'zkksid', type: 'varchar', length: 10, nullable: true })
  zkksid: string | null;

  @Column({ name: 'clbz', type: 'int', default: 0, nullable: true })
  clbz: number | null;

  @Column({ name: 'dybz', type: 'int', default: 0, nullable: true })
  dybz: number | null;

  @Column({ name: 'xnhbz', type: 'int', nullable: true })
  xnhbz: number | null;

  @Column({ name: 'jzje', type: 'decimal', precision: 12, scale: 2, nullable: true })
  jzje: number | null;

  @Column({ name: 'jzry', type: 'varchar', length: 10, nullable: true })
  jzry: string | null;

  @Column({ name: 'ybfl', type: 'varchar', length: 8, nullable: true })
  ybfl: string | null;

  @PrimaryColumn({
    name: 'maxid',
    type: 'int',
    nullable: false,
    insert: false,
    update: false,
  })
  maxid: number;

  @Column({ name: 'scph', type: 'varchar', length: 12, nullable: true })
  scph: string | null;

  @Column({ name: 'cjid', type: 'varchar', length: 30, nullable: true })
  cjid: string | null;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ name: 'zfje', type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  zfje: number | null;

  @Column({ name: 'pfjg', type: 'decimal', precision: 12, scale: 4, default: 0, nullable: true })
  pfjg: number | null;

  @Column({ name: 'xmid', type: 'varchar', length: 50, nullable: true })
  xmid: string | null;

  @Column({ name: 'yjry', type: 'varchar', length: 10, nullable: true })
  yjry: string | null;

  @Column({ name: 'yjrq', type: 'datetime', nullable: true })
  yjrq: Date | null;

  @Column({ name: 'YZZH', type: 'numeric', precision: 18, scale: 0, default: 0, nullable: true })
  yzzh: number | null;

  @Column({ name: 'czrq', type: 'datetime', nullable: true })
  czrq: Date | null;

  @Column({ name: 'scpc', type: 'varchar', length: 30, nullable: true })
  scpc: string | null;

  @Column({ name: 'sxrq', type: 'datetime', nullable: true })
  sxrq: Date | null;

  @Column({ name: 'scrq', type: 'datetime', nullable: true })
  scrq: Date | null;

  @Column({ name: 'sctfrq', type: 'datetime', nullable: true, insert: false })
  sctfrq: Date | null;

  @ManyToOne(() => h13_yzzxcs, { cascade: false })
  @JoinColumn([
    { name: 'yzxh', referencedColumnName: 'yzxh' },
    { name: 'mxxh', referencedColumnName: 'mxxh' },
    { name: 'yzlx', referencedColumnName: 'yzlx' },
    { name: 'zyid', referencedColumnName: 'zyid' },
    { name: 'zxcs2', referencedColumnName: 'maxid' },
  ])
  h13_yzzxcs?: h13_yzzxcs;

  @ManyToOne(() => H00_xmzd, { cascade: false })
  @JoinColumn([{ name: 'xmid', referencedColumnName: 'xmid' }])
  h00XmzdEntiry?: H00_xmzd;
}
