import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { DateTransformer } from '@/common/transformers/date.transformer';
import { h00_fylb } from '../h00_fylb/h00_fylb.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { h13_yzzxcs } from './h13_yzzxcs.entity';

@Index('h12_yzxb_mxxh', ['zyid', 'mxxh'], {})
@Index('h12_yzxb_x', ['zyid', 'yzlx', 'yzxh', 'mxxh'], { unique: true })
@Index('h12_yzxb_yzrq', ['zyid', 'yzrq'], {})
@Index('h12_yzxb_yzzh', ['zyid', 'yzzh'], {})
@Index('H12_YZXB_ZYID', ['zyid'], {})
@Entity('h12_yzxb', { schema: 'dbo' })
export class h12_yzxb {
  @PrimaryColumn('smallint', { primary: true, name: 'yzlx' })
  yzlx: number;

  @PrimaryColumn('int', { primary: true, name: 'yzxh' })
  yzxh: number;

  @PrimaryColumn('char', { primary: true, name: 'zyid', length: 12 })
  zyid: string;

  @PrimaryColumn('int', { primary: true, name: 'mxxh' })
  mxxh: number;

  @Column('char', { name: 'zybh', length: 12 })
  zybh: string;

  @Column('int', { name: 'zycs' })
  zycs: number;

  @Column('char', { name: 'ksrq', nullable: true, length: 5 })
  ksrq: string | null;

  @Column('char', { name: 'kssj', nullable: true, length: 10 })
  kssj: string | null;

  @Column('varchar', { name: 'xmid', nullable: true, length: 50 })
  xmid: string | null;

  @Column('varchar', { name: 'xmmc', nullable: true, length: 250 })
  xmmc: string | null;

  @Column('decimal', { name: 'jfyl', nullable: true, precision: 16, scale: 4 })
  jfyl: number | null;

  @Column('decimal', { name: 'sjyl', nullable: true, precision: 16, scale: 4 })
  sjyl: number | null;

  @Column('char', { name: 'syffid', nullable: true, length: 10 })
  syffid: string | null;

  @ManyToOne(() => h00_syff)
  @JoinColumn({ name: 'syffid', referencedColumnName: 'syffid' })
  syffidEntity: h00_syff;

  @Column('char', { name: 'syplid', nullable: true, length: 10 })
  syplid: string | null;

  @ManyToOne(() => h00_sypl)
  @JoinColumn({ name: 'syplid', referencedColumnName: 'syplid' })
  syplidEntity: h00_sypl;

  @Column('varchar', { name: 'xmgg', nullable: true, length: 60 })
  xmgg: string | null;

  @Column('varchar', { name: 'xmdw', nullable: true, length: 60 })
  xmdw: string | null;

  @Column('decimal', { name: 'xmdj', nullable: true, precision: 16, scale: 4 })
  xmdj: number | null;

  @Column('char', { name: 'typbz', nullable: true, length: 2 })
  typbz: string | null;

  @Column('smallint', { name: 'fybzf', nullable: true })
  fybzf: number | null;

  @Column('smallint', { name: 'tcbz', nullable: true })
  tcbz: number | null;

  @Column('char', { name: 'ksys', nullable: true, length: 10 })
  ksys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'ksys', referencedColumnName: 'usid' })
  ksysEntity: usrcat;

  @Column('char', { name: 'scdh', nullable: true, length: 12 })
  scdh: string | null;

  @Column('char', { name: 'kshs', nullable: true, length: 10 })
  kshs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'kshs', referencedColumnName: 'usid' })
  kshsEntity: usrcat;

  @Column('char', { name: 'jsys', nullable: true, length: 10 })
  jsys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'jsys', referencedColumnName: 'usid' })
  jsysEntity: usrcat;

  @Column('char', { name: 'jshs', nullable: true, length: 10 })
  jshs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'jshs', referencedColumnName: 'usid' })
  jshsEntity: usrcat;

  @Column('char', { name: 'jsrq', nullable: true, length: 5 })
  jsrq: string | null;

  @Column('char', { name: 'jssj', nullable: true, length: 10 })
  jssj: string | null;

  @Column('char', { name: 'fylbid', nullable: true, length: 10 })
  fylbid: string | null;

  @ManyToOne(() => h00_fylb)
  @JoinColumn({ name: 'fylbid', referencedColumnName: 'fylbid' })
  fylbidEntity: h00_fylb;

  @Column('decimal', { name: 'sfje', nullable: true, precision: 16, scale: 4 })
  sfje: number | null;

  @Column('smallint', { name: 'sjbz', nullable: true, default: () => '(1)' })
  sjbz: number | null;

  @Column('smallint', { name: 'sfbz', nullable: true })
  sfbz: number | null;

  @Column('smallint', { name: 'jsbz', nullable: true })
  jsbz: number | null;

  @Column('smallint', { name: 'zxbz', nullable: true })
  zxbz: number | null;

  @Column('smallint', { name: 'tzbz', nullable: true })
  tzbz: number | null;

  @Column('char', { name: 'fybz', nullable: true, length: 10 })
  fybz: string | null;

  @Column('varchar', { name: 'bzxx', nullable: true, length: 200 })
  bzxx: string | null;

  @Column('char', { name: 'lryid', nullable: true, length: 10 })
  lryid: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'lryid', referencedColumnName: 'usid' })
  lryidEntity: usrcat;

  @Column('smallint', { name: 'hdbz', nullable: true, default: () => '(0)' })
  hdbz: number | null;

  @Column('char', { name: 'hdsj', nullable: true, length: 10 })
  hdsj: string | null;

  @Column('int', { name: 'zxcs', nullable: true })
  zxcs: number | null;

  @Column('char', { name: 'zxrq', nullable: true, length: 10 })
  @DateTransformer()
  zxrq: string | null;

  @Column('smallint', { name: 'tpbz', nullable: true })
  tpbz: number | null;

  @Column('char', { name: 'zflx', nullable: true, length: 10 })
  zflx: string | null;

  @Column('char', { name: 'ksnf', nullable: true, length: 4 })
  ksnf: string | null;

  @Column('char', { name: 'jsnf', nullable: true, length: 4 })
  jsnf: string | null;

  @Column('char', { name: 'kssxys', nullable: true, length: 10 })
  kssxys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'kssxys', referencedColumnName: 'usid' })
  kssxysEntity: usrcat;

  @Column('char', { name: 'kssxhs', nullable: true, length: 10 })
  kssxhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'kssxhs', referencedColumnName: 'usid' })
  kssxhsEntity: usrcat;

  @Column('char', { name: 'jssxys', nullable: true, length: 10 })
  jssxys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'jssxys', referencedColumnName: 'usid' })
  jssxysEntity: usrcat;

  @Column('char', { name: 'jssxhs', nullable: true, length: 10 })
  jssxhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'jssxhs', referencedColumnName: 'usid' })
  jssxhsEntity: usrcat;

  @Column('smallint', { name: 'xmzl', nullable: true })
  xmzl: number | null;

  @Column('char', { name: 'cjid', nullable: true, length: 10 })
  cjid: string | null;

  @Column('char', { name: 'scph', nullable: true, length: 10 })
  scph: string | null;

  @Column('decimal', { name: 'pfjg', nullable: true, precision: 16, scale: 4 })
  pfjg: number | null;

  @Column('char', { name: 'hdhs', nullable: true, length: 10 })
  hdhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'hdhs', referencedColumnName: 'usid' })
  hdhsEntity: usrcat;

  @Column('char', { name: 'zxhs', nullable: true, length: 10 })
  zxhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'zxhs', referencedColumnName: 'usid' })
  zxhsEntity: usrcat;

  @Column('char', { name: 'zxsj', nullable: true, length: 20 })
  zxsj: string | null;

  @Column('smallint', { name: 'tybz', nullable: true })
  tybz: number | null;

  @Column('int', { name: 'kyts', nullable: true })
  kyts: number | null;

  @Column('decimal', { name: 'yhbl', nullable: true, precision: 5, scale: 2 })
  yhbl: number | null;

  @Column('char', { name: 'jldw', nullable: true, length: 10 })
  jldw: string | null;

  @Column('int', { name: 'clbz', nullable: true, default: () => '(0)' })
  clbz: number | null;

  @Column('smallint', { name: 'dw_grade', nullable: true })
  dwGrade: number | null;

  @Column('int', { name: 'dw_xs', nullable: true })
  dwXs: number | null;

  @Column('char', { name: 'ypid', nullable: true, length: 12 })
  ypid: string | null;

  @Column('varchar', { name: 'ksid', nullable: true, length: 8 })
  ksid: string | null;

  @ManyToOne(() => ksmc)
  @JoinColumn({ name: 'ksid', referencedColumnName: 'ksid' })
  ksidEntity: ksmc;

  @Column('numeric', { name: 'YZZH', nullable: true, precision: 18, scale: 0 })
  yzzh: number | null;

  @Column('int', { name: 'ysbz', nullable: true, default: () => '(0)' })
  ysbz: number | null;

  @Column('char', { name: 'sjyl1', nullable: true, length: 10 })
  sjyl1: string | null;

  @Column('int', { name: 'srcs', nullable: true })
  srcs: number | null;

  @Column('datetime', { name: 'yzrq', nullable: true })
  @DateTransformer()
  yzrq: Date | null;

  @Column('datetime', { name: 'tzrq', nullable: true })
  @DateTransformer()
  tzrq: Date | null;

  @Column('int', { name: 'mrcs', nullable: true })
  mrcs: number | null;

  @Column('tinyint', { name: 'tjbz', nullable: true, default: () => '(0)' })
  tjbz: number | null;

  @Column('int', { name: 'kyfs', nullable: true, default: () => '(0)' })
  kyfs: number | null;

  @Column('tinyint', { name: 'ybbz', nullable: true, default: () => '(1)' })
  ybbz: number | null;

  @Column('varchar', {
    name: 'gjybbm',
    nullable: true,
    length: 50,
    default: () => "''",
  })
  gjybbm: string | null;

  @Column('varchar', {
    name: 'gjybmc',
    nullable: true,
    length: 100,
    default: () => "''",
  })
  gjybmc: string | null;

  @Column('tinyint', { name: 'yzzt', nullable: true, default: () => '(0)' })
  yzzt: number | null;

  @Column('varchar', {
    name: 'ltbz',
    nullable: true,
    length: 2,
    default: () => "''",
  })
  ltbz: string | null;

  @Column('varchar', {
    name: 'psbz',
    nullable: true,
    length: 1,
    default: () => "''",
  })
  psbz: string | null;

  @Column('varchar', {
    name: 'bsjg',
    nullable: true,
    length: 10,
    default: () => "''",
  })
  bsjg: string | null;

  @Column('varchar', {
    name: 'hshd',
    nullable: true,
    length: 8,
    default: () => "''",
  })
  hshd: string | null;

  @Column('datetime', { name: 'hshdrq', nullable: true })
  @DateTransformer()
  hshdrq: Date | null;

  @Column('varchar', {
    name: 'qt1',
    nullable: true,
    length: 10,
    default: () => "''",
  })
  qt1: string | null;

  @Column('decimal', {
    name: 'zfbl',
    nullable: true,
    precision: 16,
    scale: 2,
    default: () => '(1)',
  })
  zfbl: number | null;

  @ManyToOne(() => h12_yzzb, (h12_yzzb) => h12_yzzb.h12_yzxbList)
  @JoinColumn({ name: 'zyid', referencedColumnName: 'zyid' })
  h12_yzzb: h12_yzzb;

  @OneToMany(() => h13_yzzxcs, (h13_yzzxcs) => h13_yzzxcs.h12_yzxb)
  h13_yzzxcsList: h13_yzzxcs[];
}
