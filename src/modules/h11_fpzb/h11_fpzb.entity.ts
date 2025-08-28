import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h11_fpzb')
export class H11Fpzb {
  @PrimaryColumn({ name: 'fphm', type: 'varchar', length: 10 })
  fphm: string;

  @PrimaryColumn({ name: 'kshm', type: 'varchar', length: 10 })
  kshm: string;

  @Column({ name: 'zybh', type: 'varchar', length: 12, nullable: true })
  zybh: string | null;

  @Column({ name: 'jsdh', type: 'varchar', length: 10, nullable: true })
  jsdh: string | null;

  @Column({ name: 'zyid', type: 'varchar', length: 12, nullable: true })
  zyid: string | null;

  @Column({ name: 'brxm', type: 'varchar', length: 30, nullable: true })
  brxm: string | null;

  @Column({ name: 'xbid', type: 'varchar', length: 10, nullable: true })
  xbid: string | null;

  @Column({ name: 'rysj', type: 'datetime', nullable: true })
  rysj: Date | null;

  @Column({ name: 'zzsj', type: 'datetime', nullable: true })
  zzsj: Date | null;

  @Column({ name: 'fpje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  fpje: number | null;

  @Column({ name: 'yjje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  yjje: number | null;

  @Column({ name: 'syje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  syje: number | null;

  @Column({ name: 'ksid', type: 'varchar', length: 10, nullable: true })
  ksid: string | null;

  @Column({ name: 'ksmc', type: 'varchar', length: 30, nullable: true })
  ksmc: string | null;

  @Column({ name: 'sfyid', type: 'varchar', length: 10, nullable: true })
  sfyid: string | null;

  @Column({ name: 'sfyxm', type: 'varchar', length: 30, nullable: true })
  sfyxm: string | null;

  @Column({ name: 'sfsj', type: 'datetime', nullable: true })
  sfsj: Date | null;

  @Column({ name: 'sjzt', type: 'smallint', nullable: true })
  sjzt: number | null;

  @Column({ name: 'zfyid', type: 'varchar', length: 10, nullable: true })
  zfyid: string | null;

  @Column({ name: 'zfyxm', type: 'varchar', length: 30, nullable: true })
  zfyxm: string | null;

  @Column({ name: 'zfsj', type: 'datetime', nullable: true })
  zfsj: Date | null;

  @Column({ name: 'zfyy', type: 'varchar', length: 40, nullable: true })
  zfyy: string | null;

  @Column({ name: 'qtje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  qtje: number | null;

  @Column({ name: 'fyksid', type: 'varchar', length: 10, nullable: true })
  fyksid: string | null;

  @Column({ name: 'fyhj', type: 'decimal', precision: 16, scale: 2, nullable: true })
  fyhj: number | null;

  @Column({ name: 'dzfp', type: 'varchar', length: 20, nullable: true })
  dzfp: string | null;

  @Column({ name: 'jzrq', type: 'datetime', nullable: true })
  jzrq: Date | null;

  @Column({ name: 'jzbz', type: 'tinyint', nullable: true, default: 0 })
  jzbz: number | null;

  @Column({ name: 'jkdh', type: 'varchar', length: 12, nullable: true })
  jkdh: string | null;
}
