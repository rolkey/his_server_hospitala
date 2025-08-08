import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'h40_sqzb', schema: 'dbo' })
export class H40Sqzb {
  @PrimaryColumn({
    name: 'djbh',
    type: 'varchar',
    length: 20,
  })
  djbh: string;

  @Column({
    name: 'ksid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  ksid: string | null;

  @Column({
    name: 'ysid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  ysid: string | null;

  @Column({ name: 'sqsj', type: 'datetime', nullable: true })
  sqsj: Date | null;

  @Column({ name: 'sjzt', type: 'tinyint', nullable: true })
  sjzt: number | null;

  @Column({
    name: 'bzxx',
    type: 'varchar',
    length: 60,
    nullable: true,
    default: '',
  })
  bzxx: string;

  @Column({
    name: 'zxksid',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  zxksid: string | null;

  @Column({
    name: 'jcbw',
    type: 'varchar',
    length: 60,
    nullable: true,
    default: '',
  })
  jcbw: string;

  @Column({
    name: 'jcmd',
    type: 'varchar',
    length: 60,
    nullable: true,
    default: '',
  })
  jcmd: string;

  @Column({
    name: 'tz',
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  tz: string | null;

  @Column({
    name: 'sqlx',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  sqlx: string | null;

  @Column({ name: 'sl', type: 'numeric', precision: 16, scale: 2, nullable: true })
  sl: number | null;

  @Column({ name: 'dj', type: 'numeric', precision: 16, scale: 2, nullable: true })
  dj: number | null;

  @Column({
    name: 'djfl',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  djfl: string | null;

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
    length: 20,
    nullable: true,
  })
  bz3: string | null;

  @Column({
    name: 'bz4',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  bz4: string | null;

  @Column({
    name: 'bz5',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  bz5: string | null;
}
