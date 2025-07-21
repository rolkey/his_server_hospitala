import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { h12_yzxb } from './h12_yzxb.entity';
import { h00_fylb } from '../h00_fylb/h00_fylb.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { DateTransformer } from '@/common/transformers/date.transformer';
@Index('h13_yzzxcs_fydh', ['fydh'], {})
@Index('H13_YZZXCS_JSDH', ['zyid', 'jsdh'], {})
@Index('h13_yzzxcs_maxid', ['zyid', 'maxid'], {})
@Index('h13_yzzxcs_mxxh', ['zyid', 'mxxh'], {})
@Index('h13_yzzxcs_x', ['yzlx', 'yzxh', 'mxxh', 'zyid', 'zxrq'], {
  unique: true,
})
@Index('h13_yzzxcs_zxrq', ['zyid', 'zxrq'], {})
@Index('h13_zyidzxrq', ['zyid'], {})
@Entity('h13_yzzxcs', { schema: 'dbo' })
export class h13_yzzxcs {
  @Column('int', { primary: true, name: 'yzxh' })
  yzxh: number;

  @Column('int', { primary: true, name: 'mxxh' })
  mxxh: number;

  @Column('int', { primary: true, name: 'yzlx' })
  yzlx: number;

  @Column('char', { primary: true, name: 'zyid', length: 12 })
  zyid: string;

  @Column('datetime', { primary: true, name: 'zxrq' })
  @DateTransformer()
  zxrq: Date;

  @Column('char', { name: 'ksid', nullable: true, length: 10 })
  ksid: string | null;

  @ManyToOne(() => ksmc)
  @JoinColumn({ name: 'ksid', referencedColumnName: 'ksid' })
  ksidEntity: ksmc;

  @Column('char', { name: 'fydh', nullable: true, length: 12 })
  fydh: string | null;

  @Column('char', { name: 'zybh', nullable: true, length: 12 })
  zybh: string | null;

  @Column('decimal', { name: 'jfyl', nullable: true, precision: 16, scale: 4 })
  jfyl: number | null;

  @Column('decimal', { name: 'xmdj', nullable: true, precision: 16, scale: 4 })
  xmdj: number | null;

  @Column('smallint', { name: 'sfbz', nullable: true })
  sfbz: number | null;

  @Column('char', { name: 'fylbid', nullable: true, length: 10 })
  fylbid: string | null;

  @ManyToOne(() => h00_fylb)
  @JoinColumn({ name: 'fylbid', referencedColumnName: 'fylbid' })
  fylbidEntity: h00_fylb;

  @Column('char', { name: 'jsdh', nullable: true, length: 10 })
  jsdh: string | null;

  @Column('smallint', { name: 'jsbz', nullable: true, default: () => '(0)' })
  jsbz: number | null;

  @Column('int', { name: 'zxcs2', nullable: true })
  zxcs2: number | null;

  @Column('char', { name: 'zxhs', nullable: true, length: 10 })
  zxhs: string | null;

  @Column('char', { name: 'zxsj', nullable: true, length: 20 })
  zxsj: string | null;

  @Column('char', { name: 'zflx', nullable: true, length: 12 })
  zflx: string | null;

  @Column('char', { name: 'syffid', nullable: true, length: 10 })
  syffid: string | null;

  @Column('int', { name: 'bzxcs', nullable: true, default: () => '(0)' })
  bzxcs: number | null;

  @Column('char', { name: 'tyrid', nullable: true, length: 10 })
  tyrid: string | null;

  @Column('datetime', { name: 'tysj', nullable: true })
  @DateTransformer()
  tysj: Date | null;

  @Column('decimal', {
    name: 'sqtysl',
    nullable: true,
    precision: 16,
    scale: 4,
  })
  sqtysl: number | null;

  @Column('decimal', {
    name: 'sjtysl',
    nullable: true,
    precision: 16,
    scale: 4,
  })
  sjtysl: number | null;

  @Column('char', { name: 'syrid', nullable: true, length: 10 })
  syrid: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'syrid', referencedColumnName: 'usid' })
  syridEntity: usrcat;

  @Column('datetime', { name: 'sysj', nullable: true })
  @DateTransformer()
  sysj: Date | null;

  @Column('int', { name: 'kyts', nullable: true })
  kyts: number | null;

  @Column('decimal', { name: 'zfbl', nullable: true, precision: 16, scale: 4 })
  zfbl: number | null;

  @Column('smallint', { name: 'fybz', nullable: true, default: () => '(0)' })
  fybz: number | null;

  @Column('datetime', { name: 'fysj', nullable: true })
  @DateTransformer()
  fysj: Date | null;

  @Column('char', { name: 'fyrid', nullable: true, length: 10 })
  fyrid: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'fyrid', referencedColumnName: 'usid' })
  fyridEntity: usrcat;

  @Column('decimal', { name: 'zxcs', nullable: true, precision: 16, scale: 4 })
  zxcs: number | null;

  @Column('char', { name: 'zkksid', nullable: true, length: 10 })
  zkksid: string | null;

  @ManyToOne(() => ksmc)
  @JoinColumn({ name: 'zkksid', referencedColumnName: 'ksid' })
  zkksidEntity: ksmc;

  @Column('int', { name: 'clbz', nullable: true, default: () => '(0)' })
  clbz: number | null;

  @Column('int', { name: 'dybz', nullable: true, default: () => '(0)' })
  dybz: number | null;

  @Column('int', { name: 'xnhbz', nullable: true })
  xnhbz: number | null;

  @Column('decimal', { name: 'jzje', nullable: true, precision: 12, scale: 2 })
  jzje: number | null;

  @Column('char', { name: 'jzry', nullable: true, length: 10 })
  jzry: string | null;

  @Column('char', { name: 'ybfl', nullable: true, length: 8 })
  ybfl: string | null;

  @PrimaryGeneratedColumn({ type: 'int', name: 'maxid' })
  maxid: number;

  @Column('varchar', { name: 'scph', nullable: true, length: 12 })
  scph: string | null;

  @Column('varchar', { name: 'cjid', nullable: true, length: 30 })
  cjid: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 10 })
  bz1: string | null;

  @Column('decimal', {
    name: 'zfje',
    nullable: true,
    precision: 12,
    scale: 4,
    default: () => '(0)',
  })
  zfje: number | null;

  @Column('decimal', {
    name: 'pfjg',
    nullable: true,
    precision: 12,
    scale: 4,
    default: () => '(0)',
  })
  pfjg: number | null;

  @Column('varchar', { name: 'xmid', nullable: true, length: 50 })
  xmid: string | null;

  @Column('varchar', { name: 'yjry', nullable: true, length: 10 })
  yjry: string | null;

  @Column('datetime', { name: 'yjrq', nullable: true })
  @DateTransformer()
  yjrq: Date | null;

  @Column('numeric', {
    name: 'YZZH',
    nullable: true,
    precision: 18,
    scale: 0,
    default: () => '(0)',
  })
  yzzh: number | null;

  @Column('datetime', { name: 'czrq', nullable: true })
  @DateTransformer()
  czrq: Date | null;

  @Column('varchar', { name: 'scpc', nullable: true, length: 30 })
  scpc: string | null;

  @ManyToOne(() => h12_yzxb, (h12_yzxb) => h12_yzxb.h13_yzzxcsList)
  @JoinColumn({ name: 'zyid', referencedColumnName: 'zyid' })
  h12_yzxb: h12_yzxb;
}
