import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'lis_sflb', schema: 'dbo' })
export class Lis_sflb {
  @PrimaryColumn({ name: 'lbcode', type: 'varchar', length: 10 })
  lbcode: string;

  @Column({ name: 'lbname', type: 'varchar', length: 60, nullable: true })
  lbname: string | null;

  @Column({ name: 'pybm', type: 'varchar', length: 30, nullable: true })
  pybm: string | null;

  @Column({ name: 'wbbm', type: 'varchar', length: 30, nullable: true })
  wbbm: string | null;

  @Column({ name: 'qtbm', type: 'varchar', length: 30, nullable: true })
  qtbm: string | null;

  @Column({ name: 'fylbid', type: 'varchar', length: 30, nullable: true })
  fylbid: string | null;

  @Column({ name: 'zxksid', type: 'varchar', length: 10, nullable: true })
  zxksid: string | null;

  @Column({ name: 'yxbz', type: 'smallint', nullable: true })
  yxbz: number | null;

  @Column({ name: 'bz1', type: 'varchar', length: 30, nullable: true })
  bz1: string | null;

  @Column({ name: 'bz2', type: 'varchar', length: 30, nullable: true })
  bz2: string | null;
}
