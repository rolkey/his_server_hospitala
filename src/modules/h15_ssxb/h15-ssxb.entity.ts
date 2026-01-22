import {
  Entity,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ValueTransformer,
} from 'typeorm';
import { H15Sszb } from '../h15_sszb/h15-sszb.entity';
import { H15SsxbTf } from '../h15_ssxb_tf/h15-ssxb-tf.entity';

@Entity({ name: 'h15_ssxb', schema: 'dbo' })
export class H15Ssxb {
  @Column({
    name: 'ssid',
    type: 'varchar',
    length: 12,
    nullable: false,
    default: '',
  })
  ssid: string;

  @Column({
    name: 'zyid',
    type: 'varchar',
    length: 12,
    nullable: false,
    default: '',
  })
  zyid: string;

  @Column({
    name: 'ssmxid',
    type: 'int',
    nullable: false,
  })
  ssmxid: number;

  @Column({
    name: 'czid',
    type: 'varchar',
    length: 12,
    nullable: false,
    default: '',
  })
  czid: string;

  @Column({
    name: 'xh',
    type: 'int',
    nullable: false,
  })
  xh: number;

  @Column({
    name: 'ksid',
    type: 'varchar',
    length: 8,
    nullable: false,
    default: '',
  })
  ksid: string;

  @Column({
    name: 'xmmc',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  xmmc: string;

  @Column({
    name: 'xmid',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  xmid: string;

  @Column({
    name: 'xmgg',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  xmgg: string;

  @Column({
    name: 'xmdw',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  xmdw: string;

  @Column({
    name: 'xmdj',
    type: 'decimal',
    precision: 16,
    scale: 4,
    nullable: true,
    default: 0,
  })
  xmdj: number;

  @Column({
    name: 'jfyl',
    type: 'decimal',
    precision: 16,
    scale: 4,
    nullable: true,
    default: 0,
  })
  jfyl: number;

  @Column({
    name: 'syffid',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  syffid: string;

  @Column({
    name: 'typbz',
    type: 'varchar',
    length: 2,
    nullable: true,
    default: '',
  })
  typbz: string;

  @Column({
    name: 'tcbz',
    type: 'tinyint',
    nullable: true,
  })
  tcbz: number;

  @Column({
    name: 'zflx',
    type: 'varchar',
    length: 12,
    nullable: true,
    default: '',
  })
  zflx: string;

  @Column({
    name: 'fylbid',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  fylbid: string;

  @Column({
    name: 'tpbz',
    type: 'tinyint',
    nullable: true,
  })
  tpbz: number;

  @Column({
    name: 'fybz',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  fybz: string;

  @Column({
    name: 'jsbz',
    type: 'smallint',
    nullable: true,
  })
  jsbz: number;

  @Column({
    name: 'jsdh',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  jsdh: string;

  @Column({
    name: 'sfbz',
    type: 'smallint',
    nullable: true,
    default: 1,
  })
  sfbz: number;

  @Column({
    name: 'ssrq',
    type: 'datetime',
    nullable: true,
  })
  ssrq: Date;

  @Column({
    name: 'mbid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  mbid: string;

  @Column({
    name: 'zfbl',
    type: 'decimal',
    precision: 16,
    scale: 4,
    nullable: true,
  })
  zfbl: number;

  @Column({
    name: 'ybfl',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  ybfl: string;

  @Column({
    name: 'xnhbz',
    type: 'int',
    nullable: true,
  })
  xnhbz: number;

  @Column({
    name: 'jzje',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  jzje: number;

  @Column({
    name: 'jzry',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  jzry: string;

  @PrimaryColumn('integer', {
    name: 'maxid',
    insert: false,
    update: false,
    // transformer: numberToStringTransformer,
  })
  maxid: number;

  @Column({
    name: 'scph',
    type: 'varchar',
    length: 12,
    nullable: true,
  })
  scph: string;

  @Column({
    name: 'pfjg',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
    default: 0,
  })
  pfjg: number;

  @Column({
    name: 'ypdh',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  ypdh: string;

  @Column({
    name: 'scpc',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  scpc: string;

  @Column({
    name: 'cjid',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  cjid: string;

  @Column({
    name: 'bz1',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  bz1: string;

  @Column({
    name: 'bz2',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  bz2: string;

  @Column({
    name: 'xmzl',
    type: 'tinyint',
    nullable: true,
    default: 1,
  })
  xmzl: number;

  @Column({
    name: 'tjbz',
    type: 'tinyint',
    nullable: true,
    default: 0,
  })
  tjbz: number;

  @Column({
    name: 'sjbz',
    type: 'tinyint',
    nullable: true,
    default: 0,
  })
  sjbz: number;

  @Column({
    name: 'fydh',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  fydh: string;

  @Column({
    name: 'zxksid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  zxksid: string;

  @Column({
    name: 'sjtysl',
    type: 'decimal',
    precision: 16,
    scale: 4,
    nullable: true,
    default: 0,
  })
  sjtysl: number;

  @Column({
    name: 'fysj',
    type: 'datetime',
    nullable: true,
  })
  fysj: Date;

  @Column({
    name: 'ybbz',
    type: 'tinyint',
    nullable: true,
    default: 1,
  })
  ybbz: number;

  @Column({
    name: 'gjybbm',
    type: 'varchar',
    length: 50,
    nullable: true,
    default: '',
  })
  gjybbm: string;

  @Column({
    name: 'gjybmc',
    type: 'varchar',
    length: 100,
    nullable: true,
    default: '',
  })
  gjybmc: string;

  @Column({
    name: 'syplid',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  syplid: string;

  @Column({
    name: 'sjjl',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  sjjl: string;

  @Column({
    name: 'jldw',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  jldw: string;

  @Column({
    name: 'ksys',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  ksys: string;

  @Column({
    name: 'kssxys',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  kssxys: string;

  @Column({
    name: 'kshs',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  kshs: string;

  @Column({
    name: 'hdhs',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  hdhs: string;

  @Column({
    name: 'hdrq',
    type: 'datetime',
    nullable: true,
  })
  hdrq: Date;

  @Column({
    name: 'hdbz',
    type: 'smallint',
    nullable: true,
    default: 0,
  })
  hdbz: number;

  @Column({
    name: 'sxrq',
    type: 'datetime',
    nullable: true,
  })
  sxrq: Date;

  @Column({
    name: 'scrq',
    type: 'datetime',
    nullable: true,
  })
  scrq: Date;

  @Column({
    name: 'fyrid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  fyrid: string;

  @Column({
    name: 'tcid',
    type: 'varchar',
    length: 15,
    nullable: true,
    default: '',
  })
  tcid: string;

  @Column({
    name: 'tcmc',
    type: 'varchar',
    length: 60,
    nullable: true,
    default: '',
  })
  tcmc: string;

  @ManyToOne(() => H15Sszb, {
    cascade: false, // 禁用级联操作
  })
  @JoinColumn({ name: 'ssid', referencedColumnName: 'ssid' })
  h15SszbEntity: H15Sszb;

  @OneToMany(() => H15SsxbTf, (h15SsxbTf) => h15SsxbTf.h15SsxbEntity)
  h15SsxbTfs: H15SsxbTf[];
}
