import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h11_jsxb')
export class H11Jsxb {
  @PrimaryColumn({ name: 'jsdh', type: 'varchar', length: 10 })
  jsdh: string;

  @PrimaryColumn({ name: 'fylbid', type: 'varchar', length: 10 })
  fylbid: string;

  @Column({ name: 'fylbmc', type: 'varchar', length: 30, nullable: true })
  fylbmc: string | null;

  @Column({ name: 'jsje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jsje: number | null;

  @Column({ name: 'zfje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  zfje: number | null;

  @Column({ name: 'gfje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  gfje: number | null;

  @Column({ name: 'jmje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  jmje: number | null;

  @Column({ name: 'qfje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  qfje: number | null;

  @Column({ name: 'ssje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  ssje: number | null;
}
