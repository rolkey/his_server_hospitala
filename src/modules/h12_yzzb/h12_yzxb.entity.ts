import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { DateTransformer } from '@/common/transformers/date.transformer';
import { h00_fylb } from '../h00_fylb/h00_fylb.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { varcharNumberTransformer } from '@/utils/varchar-number.transformer'; // 引入 transformer
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';

@Index('h12_yzxb_mxxh', ['zyid', 'mxxh'], {})
@Index('h12_yzxb_x', ['zyid', 'yzlx', 'yzxh', 'mxxh'], { unique: true })
@Index('h12_yzxb_yzrq', ['zyid', 'yzrq'], {})
@Index('h12_yzxb_yzzh', ['zyid', 'yzzh'], {})
@Index('H12_YZXB_ZYID', ['zyid'], {})
@Entity('h12_yzxb', { schema: 'dbo' })
export class h12_yzxb {
  @PrimaryColumn('smallint', { primary: true, name: 'yzlx', update: false })
  yzlx: number;

  @PrimaryColumn('int', { primary: true, name: 'yzxh', update: false })
  yzxh: number;

  @PrimaryColumn('varchar', { primary: true, name: 'zyid', length: 12, update: false })
  zyid: string;

  @PrimaryColumn('int', { primary: true, name: 'mxxh', update: false })
  mxxh: number;

  @Column('varchar', { name: 'zybh', length: 12 })
  zybh: string;

  @Column('int', { name: 'zycs' })
  zycs: number;

  @Column('varchar', { name: 'ksrq', nullable: true, length: 5 })
  ksrq: string | null;

  @Column('varchar', { name: 'kssj', nullable: true, length: 10 })
  kssj: string | null;

  @Column('varchar', { name: 'xmid', nullable: true, length: 50 })
  xmid: string | null;

  @Column('varchar', { name: 'xmmc', nullable: true, length: 250 })
  xmmc: string | null;

  @Column('decimal', { name: 'jfyl', nullable: true, precision: 16, scale: 4 })
  jfyl: number | null;

  @Column('decimal', { name: 'sjyl', nullable: true, precision: 16, scale: 4 })
  sjyl: number | null;

  @Column('varchar', { name: 'syffid', nullable: true, length: 10 })
  syffid: string | null;

  @ManyToOne(() => h00_syff)
  @JoinColumn({ name: 'syffid', referencedColumnName: 'syffid' })
  syffidEntity: h00_syff;

  @Column('varchar', { name: 'syplid', nullable: true, length: 10 })
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

  @Column('varchar', { name: 'typbz', nullable: true, length: 2 })
  typbz: string | null;

  @Column('smallint', { name: 'fybzf', nullable: true })
  fybzf: number | null;

  @Column('smallint', { name: 'tcbz', nullable: true })
  tcbz: number | null;

  @Column('varchar', { name: 'ksys', nullable: true, length: 10 })
  ksys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'ksys', referencedColumnName: 'usid' })
  ksysEntity: usrcat;

  @Column('varchar', { name: 'scdh', nullable: true, length: 12 })
  scdh: string | null;

  @Column('varchar', { name: 'kshs', nullable: true, length: 10 })
  kshs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'kshs', referencedColumnName: 'usid' })
  kshsEntity: usrcat;

  @Column('varchar', { name: 'jsys', nullable: true, length: 10 })
  jsys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'jsys', referencedColumnName: 'usid' })
  jsysEntity: usrcat;

  @Column('varchar', { name: 'jshs', nullable: true, length: 10 })
  jshs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'jshs', referencedColumnName: 'usid' })
  jshsEntity: usrcat;

  @Column('varchar', { name: 'jsrq', nullable: true, length: 5 })
  jsrq: string | null;

  @Column('varchar', { name: 'jssj', nullable: true, length: 10 })
  jssj: string | null;

  @Column('varchar', { name: 'fylbid', nullable: true, length: 10 })
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

  @Column('varchar', { name: 'fybz', nullable: true, length: 10 })
  fybz: string | null;

  @Column('varchar', { name: 'bzxx', nullable: true, length: 200 })
  bzxx: string | null;

  @Column('varchar', { name: 'lryid', nullable: true, length: 10 })
  lryid: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'lryid', referencedColumnName: 'usid' })
  lryidEntity: usrcat;

  @Column('smallint', { name: 'hdbz', nullable: true, default: () => '(0)' })
  hdbz: number | null;

  @Column('varchar', { name: 'hdsj', nullable: true, length: 10 })
  hdsj: string | null;

  @Column('int', { name: 'zxcs', nullable: true })
  zxcs: number | null;

  @Column('varchar', { name: 'zxrq', nullable: true, length: 10 })
  @DateTransformer()
  zxrq: string | null;

  @Column('smallint', { name: 'tpbz', nullable: true })
  tpbz: number | null;

  @Column('varchar', { name: 'zflx', nullable: true, length: 10 })
  zflx: string | null;

  @Column('varchar', { name: 'ksnf', nullable: true, length: 4 })
  ksnf: string | null;

  @Column('varchar', { name: 'jsnf', nullable: true, length: 4 })
  jsnf: string | null;

  @Column('varchar', { name: 'kssxys', nullable: true, length: 10 })
  kssxys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'kssxys', referencedColumnName: 'usid' })
  kssxysEntity: usrcat;

  @Column('varchar', { name: 'kssxhs', nullable: true, length: 10 })
  kssxhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'kssxhs', referencedColumnName: 'usid' })
  kssxhsEntity: usrcat;

  @Column('varchar', { name: 'jssxys', nullable: true, length: 10 })
  jssxys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'jssxys', referencedColumnName: 'usid' })
  jssxysEntity: usrcat;

  @Column('varchar', { name: 'jssxhs', nullable: true, length: 10 })
  jssxhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'jssxhs', referencedColumnName: 'usid' })
  jssxhsEntity: usrcat;

  @Column('smallint', { name: 'xmzl', nullable: true })
  xmzl: number | null;

  @Column('varchar', { name: 'cjid', nullable: true, length: 10 })
  cjid: string | null;

  @Column('varchar', { name: 'scph', nullable: true, length: 10 })
  scph: string | null;

  @Column('decimal', { name: 'pfjg', nullable: true, precision: 16, scale: 4 })
  pfjg: number | null;

  @Column('varchar', { name: 'hdhs', nullable: true, length: 10 })
  hdhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'hdhs', referencedColumnName: 'usid' })
  hdhsEntity: usrcat;

  @Column('varchar', { name: 'zxhs', nullable: true, length: 10 })
  zxhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'zxhs', referencedColumnName: 'usid' })
  zxhsEntity: usrcat;

  @Column('varchar', { name: 'zxsj', nullable: true, length: 20 })
  zxsj: string | null;

  @Column('smallint', { name: 'tybz', nullable: true })
  tybz: number | null;

  @Column('int', { name: 'kyts', nullable: true })
  kyts: number | null;

  @Column('decimal', { name: 'yhbl', nullable: true, precision: 5, scale: 2 })
  yhbl: number | null;

  @Column('varchar', { name: 'jldw', nullable: true, length: 10 })
  jldw: string | null;

  @Column('int', { name: 'clbz', nullable: true, default: () => '(0)' })
  clbz: number | null;

  @Column('smallint', { name: 'dw_grade', nullable: true })
  dw_grade: number | null;

  @Column('decimal', { name: 'dw_xs', nullable: true, precision: 16, scale: 4 })
  dw_xs: number | '';

  @Column('varchar', { name: 'ypid', nullable: true, length: 12 })
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

  @Column({
    type: 'varchar', // 数据库字段类型
    length: 10, // 数据库字段长度
    // transformer: varcharNumberTransformer, // 应用我们创建的 transformer
    nullable: true, // 根据你的表定义设置是否允许 NULL
  })
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

  @ManyToOne(() => h12_yzzb, (h12_yzzb) => h12_yzzb.h12_yzxbList, {
    cascade: false, // 禁用级联操作
  })
  @JoinColumn({ name: 'zyid', referencedColumnName: 'zyid' })
  h12_yzzb: h12_yzzb;

  isNew: boolean;

  //   @OneToMany(() => h13_yzzxcs, (h13_yzzxcs) => h13_yzzxcs.h12_yzxb, {
  //     cascade: false, // 禁用级联操作
  //   })
  //   h13_yzzxcsList: h13_yzzxcs[];
  @OneToMany(() => h13_yzzxcs, (h13_yzzxcs) => h13_yzzxcs.h12_yzxb, {
    cascade: false, // 禁用级联操作
  })
  h13_yzzxcsList: h13_yzzxcs[];
}
