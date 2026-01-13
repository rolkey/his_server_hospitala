import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'BasOpr', schema: 'dbo' })
export class BasOpr {
  @PrimaryColumn({ type: 'int', name: 'OprID' })
  oprId: number;

  @Column({
    type: 'nvarchar',
    name: 'ICDCM',
    length: 128,
    collation: 'Chinese_PRC_CI_AS',
  })
  icdcm: string;

  @Column({
    type: 'nvarchar',
    name: 'Opr',
    length: 128,
    collation: 'Chinese_PRC_CI_AS',
  })
  opr: string;

  @Column({
    type: 'nvarchar',
    name: 'GBID',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  gbId: string;

  @Column({
    type: 'nvarchar',
    name: 'HelpCode',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  helpCode: string;

  @Column({
    type: 'nvarchar',
    name: 'ElseHelpCode',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  elseHelpCode: string;

  @Column({
    type: 'nvarchar',
    name: 'ParentID',
    length: 16,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  parentId: string;

  @Column({ type: 'int', name: 'Grade', nullable: true })
  grade: number;

  @Column({ type: 'int', name: 'LeafFlag', nullable: true })
  leafFlag: number;

  @Column({ type: 'int', name: 'OprDegreeId', nullable: true })
  oprDegreeId: number;

  @Column({ type: 'int', name: 'StopFlag', nullable: true })
  stopFlag: number;

  @Column({ type: 'int', name: 'SysFlag', nullable: true })
  sysFlag: number;

  @Column({
    type: 'nvarchar',
    name: 'KeyWord',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  keyWord: string;

  @Column({
    type: 'varchar',
    name: 'pybm',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  pybm: string;

  @Column({
    type: 'varchar',
    name: 'wbbm',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  wbbm: string;

  @Column({
    type: 'varchar',
    name: 'qtbm',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  qtbm: string;

  @Column({
    type: 'varchar',
    name: 'ybbm',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  ybbm: string;

  @Column({
    type: 'varchar',
    name: 'ybmc',
    length: 100,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  ybmc: string;

  @Column({
    type: 'varchar',
    name: 'bzbm',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzbm: string;

  @Column({
    type: 'varchar',
    name: 'bzmc',
    length: 100,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzmc: string;

  @Column({
    type: 'varchar',
    name: 'qtdm',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  qtdm: string;

  @Column({
    type: 'varchar',
    name: 'qtmc',
    length: 100,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  qtmc: string;

  @Column({
    type: 'varchar',
    name: 'bzxx',
    length: 60,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bzxx: string;

  @Column({
    type: 'varchar',
    name: 'lx',
    length: 1,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  lx: string;

  @Column({
    type: 'varchar',
    name: 'yxbz',
    length: 1,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  yxbz: string;
}
