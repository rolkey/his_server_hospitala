import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'h15_sszb', schema: 'sunsoft.dbo' })
export class H15Sszb {
  @PrimaryColumn({
    name: 'ssid',
    type: 'varchar',
    length: 12,
    nullable: false,
    default: '',
  })
  ssid: string;

  @PrimaryColumn({
    name: 'zyid',
    type: 'varchar',
    length: 12,
    nullable: false,
    default: '',
  })
  zyid: string;

  @Column({
    name: 'zybh',
    type: 'varchar',
    length: 12,
    nullable: false,
    default: '',
  })
  zybh: string;

  @PrimaryColumn({
    name: 'xh',
    type: 'int',
    nullable: false,
  })
  xh: number;

  @Column({
    name: 'ysid',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  ysid: string;

  @Column({
    name: 'ssysid',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  ssysid: string;

  @Column({
    name: 'brxm',
    type: 'varchar',
    length: 30,
    nullable: true,
    default: '',
  })
  brxm: string;

  @PrimaryColumn({
    name: 'ksid',
    type: 'varchar',
    length: 10,
    nullable: false,
    default: '',
  })
  ksid: string;

  @Column({
    name: 'nl',
    type: 'int',
    nullable: true,
  })
  nl: number;

  @Column({
    name: 'cwid',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  cwid: string;

  @Column({
    name: 'xbid',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  xbid: string;

  @Column({
    name: 'ssrq',
    type: 'datetime',
    nullable: true,
  })
  ssrq: Date;

  @Column({
    name: 'ssmc',
    type: 'varchar',
    length: 200,
    nullable: true,
    default: '',
  })
  ssmc: string;

  @Column({
    name: 'lryid',
    type: 'varchar',
    length: 10,
    nullable: true,
    default: '',
  })
  lryid: string;

  @Column({
    name: 'kbid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  kbid: string;

  @Column({
    name: 'yszje',
    type: 'decimal',
    precision: 16,
    scale: 4,
    nullable: true,
    default: 0,
  })
  yszje: number;

  @Column({
    name: 'ssj',
    type: 'varchar',
    length: 16,
    nullable: true,
    default: '',
  })
  ssj: string;

  @Column({
    name: 'sslb',
    type: 'smallint',
    nullable: true,
  })
  sslb: number;

  @Column({
    name: 'xhhs',
    type: 'varchar',
    length: 16,
    nullable: true,
    default: '',
  })
  xhhs: string;

  @Column({
    name: 'xshs',
    type: 'varchar',
    length: 16,
    nullable: true,
    default: '',
  })
  xshs: string;

  @Column({
    name: 'ssxz',
    type: 'smallint',
    nullable: true,
  })
  ssxz: number;

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
    name: 'fyksid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  fyksid: string;

  @Column({
    name: 'brlx',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  brlx: string;

  @Column({
    name: 'bz1',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  bz1: string;

  @Column({
    name: 'bz2',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  bz2: string;

  @Column({
    name: 'zqksid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  zqksid: string;
}
