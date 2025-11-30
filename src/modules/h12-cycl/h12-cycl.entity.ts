import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h12_cycl', { schema: 'dbo' })
export class H12Cycl {
  @PrimaryColumn({
    name: 'zyid',
    type: 'varchar',
    length: 20,
  })
  zyid: string;

  @Column({
    name: 'zybh',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  zybh: string | null;

  @Column({
    name: 'brxm',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  brxm: string | null;

  @Column({
    name: 'xbid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  xbid: string | null;

  @Column({
    name: 'rycw',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  rycw: string | null;

  @Column({
    name: 'ryqk',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  ryqk: string | null;

  @Column({
    name: 'rysj',
    type: 'datetime',
    nullable: true,
  })
  rysj: Date | null;

  @Column({
    name: 'ksid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  ksid: string | null;

  @Column({
    name: 'rybs',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  rybs: string | null;

  @Column({
    name: 'cyqk',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  cyqk: string | null;

  @Column({
    name: 'cysj',
    type: 'datetime',
    nullable: true,
  })
  cysj: Date | null;

  @Column({
    name: 'cyys',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  cyys: string | null;

  @Column({
    name: 'lrsj',
    type: 'datetime',
    nullable: true,
  })
  lrsj: Date | null;

  @Column({
    name: 'bzxx',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  bzxx: string | null;

  @Column({
    name: 'bz1',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  bz1: string | null;

  @Column({
    name: 'bz2',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  bz2: string | null;

  @Column({
    name: 'bz3',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  bz3: string | null;

  @Column({
    name: 'bz4',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bz4: string | null;

  @Column({
    name: 'bz5',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  bz5: string | null;

  @Column({
    name: 'sjzt',
    type: 'smallint',
    nullable: true,
  })
  sjzt: number | null;
}
