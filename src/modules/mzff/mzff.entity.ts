import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: '__mzff', schema: 'dbo' })
export class Mzff {
  @PrimaryColumn({
    type: 'varchar',
    name: 'mzid',
    length: 10,
    collation: 'Chinese_PRC_CI_AS',
  })
  mzid: string;

  @Column({
    type: 'varchar',
    name: 'mzffmc',
    length: 20,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  mzffmc?: string;

  @Column({
    type: 'varchar',
    name: 'szbm',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  szbm?: string;

  @Column({
    type: 'varchar',
    name: 'pybm',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  pybm?: string;

  @Column({
    type: 'varchar',
    name: 'wbbm',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  wbbm?: string;

  @Column({
    type: 'varchar',
    name: 'qtbm',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  qtbm?: string;

  @Column({
    type: 'varchar',
    name: 'gjbm',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  gjbm?: string;

  @Column({
    type: 'varchar',
    name: 'gjmc',
    length: 30,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  gjmc?: string;

  @Column({
    type: 'varchar',
    name: 'bz1',
    length: 10,
    nullable: true,
    collation: 'Chinese_PRC_CI_AS',
  })
  bz1?: string;
}
