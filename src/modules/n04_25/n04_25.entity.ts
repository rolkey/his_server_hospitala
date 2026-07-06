import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'N04_25', schema: 'dbo' })
export class N0425 {
  @PrimaryColumn({ name: 'zyid', type: 'varchar', length: 12, nullable: false })
  zyid: string;

  @Column({ name: 'csrq', type: 'datetime', nullable: true })
  csrq: Date;

  @Column({ name: 'xb', type: 'varchar', length: 2, nullable: true })
  xb: string;

  @Column({ name: 'fmfs', type: 'varchar', length: 2, nullable: true })
  fmfs: string;

  @Column({ name: 'yzqk', type: 'varchar', length: 2, nullable: true })
  yzqk: string;

  @Column({ name: 'fmjg', type: 'varchar', length: 2, nullable: true })
  fmjg: string;

  @Column({ name: 'hx', type: 'varchar', length: 10, nullable: true })
  hx: string;

  @Column({ name: 'zg', type: 'varchar', length: 10, nullable: true })
  zg: string;

  @Column({ name: 'xx', type: 'varchar', length: 2, nullable: true })
  xx: string;

  @Column({ name: 'fath', type: 'varchar', length: 10, nullable: true })
  fath: string;

  @Column({ name: 'math', type: 'varchar', length: 10, nullable: true })
  math: string;

  @Column({ name: 'zdbm', type: 'varchar', length: 10, nullable: true })
  zdbm: string;

  @Column({ name: 'zdmc', type: 'varchar', length: 60, nullable: true })
  zdmc: string;

  @Column({ name: 'zdbm1', type: 'varchar', length: 10, nullable: true })
  zdbm1: string;

  @Column({ name: 'zdmc1', type: 'varchar', length: 60, nullable: true })
  zdmc1: string;

  @Column({ name: 'bzxx', type: 'varchar', length: 30, nullable: true })
  bzxx: string;

  @Column({ name: 'bzxx1', type: 'varchar', length: 30, nullable: true })
  bzxx1: string;

  @Column({ name: 'bzxx2', type: 'varchar', length: 30, nullable: true })
  bzxx2: string;

  @Column({ name: 'sjbz', type: 'int', nullable: true, default: 0 })
  sjbz: number;
}
