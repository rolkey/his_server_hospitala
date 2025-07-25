import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('__syspar_new', { schema: 'dbo' })
export class SysparNew {
  @PrimaryColumn({
    name: 'syid',
    type: 'char',
    length: 10,
    nullable: false,
  })
  syid: string;

  @PrimaryColumn({
    name: 'prid',
    type: 'char',
    length: 200,
    nullable: false,
  })
  prid: string;

  @Column({
    name: 'pnam',
    type: 'char',
    length: 200,
    default: '',
    collation: 'Chinese_PRC_CI_AS',
    nullable: true,
  })
  pnam?: string;

  @Column({
    name: 'pval',
    type: 'char',
    length: 200,
    default: '',
    collation: 'Chinese_PRC_CI_AS',
    nullable: true,
  })
  pval?: string;
}
