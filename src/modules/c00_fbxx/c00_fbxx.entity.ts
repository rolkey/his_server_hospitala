import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'c00_fbxx', schema: 'dbo' })
export class C00Fbxx {
  @PrimaryColumn('integer', {
    name: 'jlxh',
    comment: '记录序号',
  })
  jlxh: number;

  @Column({
    name: 'syid',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '收银ID',
  })
  syid: string;

  @Column({
    name: 'fksid',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '付款ID',
  })
  fksid: string;

  @Column({
    name: 'sksid',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '收款ID',
  })
  sksid: string;

  @Column({
    name: 'usid',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '用户ID',
  })
  usid: string;

  @Column({
    name: 'zyid',
    type: 'nchar',
    length: 20,
    nullable: true,
    comment: '住院ID',
  })
  zyid: string;

  @Column({
    name: 'xmid',
    type: 'nchar',
    length: 15,
    nullable: true,
    comment: '项目ID',
  })
  xmid: string;

  @Column({
    name: 'xmmc',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '项目名称',
  })
  xmmc: string;

  @Column({
    name: 'sm',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '说明',
  })
  sm: string;

  @Column({
    name: 'fbry',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '发布人员',
  })
  fbry: string;

  @Column({
    name: 'ckry',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '查看人员',
  })
  ckry: string;

  @Column({
    name: 'zt',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '状态',
  })
  zt: string;

  @Column({
    name: 'yxbz',
    type: 'tinyint',
    nullable: true,
    comment: '有效标志',
  })
  yxbz: number;

  @Column({
    name: 'bzxx',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '备注信息',
  })
  bzxx: string;

  @Column({
    name: 'bzxx1',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '备注信息1',
  })
  bzxx1: string;

  @Column({
    name: 'bzxx2',
    type: 'nchar',
    length: 10,
    nullable: true,
    comment: '备注信息2',
  })
  bzxx2: string;

  @Column({
    name: 'fbsj',
    type: 'datetime',
    nullable: true,
    comment: '发布时间',
  })
  fbsj: Date;

  @Column({
    name: 'mxxh',
    type: 'int',
    default: 0,
    comment: '明细序号',
  })
  mxxh: number;

  @Column({
    name: 'yzzh',
    type: 'int',
    default: 0,
    comment: '医嘱组合',
  })
  yzzh: number;

  @Column({
    name: 'xmbh',
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: '项目编号',
  })
  xmbh: string;

  @Column({
    name: 'zh',
    type: 'decimal',
    precision: 18,
    scale: 0,
    default: 0,
    comment: '账号',
  })
  zh: number;

  @Column({
    name: 'xsl',
    type: 'decimal',
    precision: 12,
    scale: 4,
    default: 0,
    comment: '销售率',
  })
  xsl: number;

  @Column({
    name: 'jfyl',
    type: 'decimal',
    precision: 12,
    scale: 4,
    default: 0,
    comment: '计费用量',
  })
  jfyl: number;

  @Column({
    name: 'yzlx',
    type: 'int',
    default: 0,
    comment: '医嘱类型',
  })
  yzlx: number;

  @Column({
    name: 'zxrq',
    type: 'datetime',
    nullable: true,
    comment: '执行日期',
  })
  zxrq: Date;
}
