import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'h11_jshztzd1', schema: 'dbo' })
export class H11Jshztzd1 {
  @PrimaryColumn({ name: 'zyid', type: 'varchar', length: 12 })
  zyid: string;

  @PrimaryColumn({ name: 'ksid', type: 'varchar', length: 10 })
  ksid: string;

  @PrimaryColumn({ name: 'qfbz', type: 'int' })
  qfbz: number;

  @Column({ name: 'zybh', type: 'varchar', length: 12, nullable: true })
  zybh: string | null;

  @Column({ name: 'brxm', type: 'varchar', length: 10, nullable: true })
  brxm: string | null;

  @Column({ name: 'yjhz', type: 'decimal', precision: 16, scale: 4, nullable: true })
  yjhz: number | null;

  @Column({ name: 'jshz', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jshz: number | null;

  @Column({ name: 'syyj', type: 'decimal', precision: 16, scale: 4, nullable: true })
  syyj: number | null;

  @Column({ name: 'qtje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  qtje: number | null;

  @Column({ name: 'hkdz', type: 'varchar', length: 30, nullable: true })
  hkdz: string | null;

  @Column({ name: 'cycw', type: 'varchar', length: 10, nullable: true })
  cycw: string | null;

  @Column({ name: 'tjsj', type: 'datetime', nullable: true })
  tjsj: Date | null;

  @Column({ name: 'tjbz', type: 'int', default: 0 })
  tjbz: number;

  @Column({ name: 'tjry', type: 'varchar', length: 10, nullable: true, default: null })
  tjry: string | null;

  @Column({ name: 'hdry', type: 'varchar', length: 10, nullable: true, default: null })
  hdry: string | null;

  @Column({ name: 'hdbz', type: 'int', default: 0 })
  hdbz: number;

  @Column({ name: 'hdsj', type: 'datetime', nullable: true })
  hdsj: Date | null;
}
