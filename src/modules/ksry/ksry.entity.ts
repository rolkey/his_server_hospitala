import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: '__ksry', schema: 'dbo' })
export class Ksry {
  @PrimaryColumn({ type: 'int' })
  xh: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  usid?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  ksid?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  syid?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bz1?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bz2?: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  bz3?: string;
}
