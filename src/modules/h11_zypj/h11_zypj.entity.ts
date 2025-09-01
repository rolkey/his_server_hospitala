import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h11_zypj')
export class H11Zypj {
  @PrimaryColumn({ name: 'pjlxid', type: 'varchar', length: 10 })
  pjlxid: string;

  @Column({ name: 'dqhm', type: 'decimal', precision: 18, scale: 0 })
  dqhm: number;

  @PrimaryColumn({ name: 'usid', type: 'varchar', length: 10 })
  usid: string;

  @Column({ name: 'pjlxmc', type: 'varchar', length: 30, nullable: true })
  pjlxmc: string | null;

  @Column({ name: 'zzhm', type: 'decimal', precision: 18, scale: 0 })
  zzhm: number;

  @Column({ name: 'pjcd', type: 'int', nullable: true })
  pjcd: number | null;

  @Column({ name: 'kshm', type: 'varchar', length: 10, nullable: true })
  kshm: string | null;

  @PrimaryColumn({ name: 'fyid', type: 'varchar', length: 10 })
  fyid: string;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string | null;
}
