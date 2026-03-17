import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h00_gxzd', { schema: 'dbo' })
export class H00Gxzd {
  @PrimaryColumn({ name: 'gxid', type: 'varchar', length: 10, default: '' })
  gxid: string;

  @Column({ name: 'gxmc', type: 'varchar', length: 30, nullable: true, default: '' })
  gxmc: string | null;

  @Column({ name: 'szbm', type: 'varchar', length: 20, nullable: true, default: '' })
  szbm: string | null;

  @Column({ name: 'pybm', type: 'varchar', length: 20, nullable: true, default: '' })
  pybm: string | null;

  @Column({ name: 'wbbm', type: 'varchar', length: 20, nullable: true, default: '' })
  wbbm: string | null;

  @Column({ name: 'qtbm', type: 'varchar', length: 20, nullable: true, default: '' })
  qtbm: string | null;
}
