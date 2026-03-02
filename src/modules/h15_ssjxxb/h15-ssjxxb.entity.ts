import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'h15_ssjxxb', schema: 'dbo' })
export class H15Ssjxxb {
  @PrimaryColumn({ type: 'varchar', name: 'ssjid', length: 4 })
  ssjid: string;

  @Column({ type: 'varchar', name: 'ssjmc', length: 16, nullable: false })
  ssjmc: string;

  @Column({ type: 'tinyint', name: 'ssjsybz', nullable: false })
  ssjsybz: number;

  @Column({ type: 'varchar', name: 'dqzybr', length: 30, nullable: false })
  dqzybr: string;

  @Column({ type: 'varchar', name: 'zyid', length: 12, nullable: false })
  zyid: string;

  @Column({ type: 'datetime', name: 'apsj', nullable: true })
  apsj: Date | null;

  @Column({ type: 'decimal', name: 'gjzs', precision: 6, scale: 2, nullable: true })
  gjzs: number | null;

  @Column({ type: 'varchar', name: 'zybh', length: 12, nullable: false })
  zybh: string;

  @Column({ type: 'varchar', name: 'ssmc', length: 200, nullable: false })
  ssmc: string;

  @Column({ type: 'varchar', name: 'brxm', length: 30, nullable: false })
  brxm: string;
}
