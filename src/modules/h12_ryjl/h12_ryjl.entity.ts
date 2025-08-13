import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'h12_ryjl', schema: 'dbo' })
export class H12Ryjl {
  @PrimaryColumn({
    name: 'zyid',
    type: 'varchar',
    length: 20,
  })
  zyid: string;

  @PrimaryColumn({
    name: 'lx',
    type: 'varchar',
    length: 10,
  })
  lx: string;

  @Column({
    name: 'brcsz',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  brcsz: string | null;

  @Column({
    name: 'zs',
    type: 'varchar',
    length: 254,
    nullable: true,
  })
  zs: string | null;

  @Column({
    name: 'xbs',
    type: 'varchar',
    length: 254,
    nullable: true,
  })
  xbs: string | null;

  @Column({
    name: 'jws',
    type: 'varchar',
    length: 254,
    nullable: true,
  })
  jws: string | null;

  @Column({
    name: 'grs',
    type: 'varchar',
    length: 254,
    nullable: true,
  })
  grs: string | null;

  @Column({
    name: 'yjs',
    type: 'varchar',
    length: 254,
    nullable: true,
  })
  yjs: string | null;

  @Column({
    name: 'jzs',
    type: 'varchar',
    length: 254,
    nullable: true,
  })
  jzs: string | null;

  @Column({
    name: 'ryqk',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  ryqk: string | null;

  @Column({
    name: 'cyqk',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  cyqk: string | null;

  @Column({
    name: 'zljg',
    type: 'varchar',
    length: 254,
    nullable: true,
  })
  zljg: string | null;

  @Column({
    name: 'blfx',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  blfx: string | null;

  @Column({
    name: 'yy',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  yy: string | null;

  @Column({
    name: 'ryzd1',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  ryzd1: string | null;

  @Column({
    name: 'ryzd2',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  ryzd2: string | null;

  @Column({
    name: 'cyzd1',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  cyzd1: string | null;

  @Column({
    name: 'cyzd2',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  cyzd2: string | null;

  @Column({
    name: 'yszc',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  yszc: string | null;

  @Column({
    name: 'ysid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  ysid: string | null;

  @Column({ name: 'sjbz', type: 'smallint', nullable: true })
  sjbz: number | null;

  @Column({ name: 'rysj', type: 'datetime', nullable: true })
  rysj: Date | null;

  @Column({ name: 'cysj', type: 'datetime', nullable: true })
  cysj: Date | null;

  @Column({ name: 'lrsj', type: 'datetime', nullable: true })
  lrsj: Date | null;

  @Column({
    name: 'bz1',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  bz1: string | null;

  @Column({
    name: 'bz2',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  bz2: string | null;

  @Column({
    name: 'bz3',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  bz3: string | null;

  @Column({
    name: 'bz4',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  bz4: string | null;

  @Column({
    name: 'bz5',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  bz5: string | null;
}
