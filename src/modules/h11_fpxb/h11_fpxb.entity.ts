import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h11_fpxb')
export class H11Fpxb {
  @PrimaryColumn({ name: 'fphm', type: 'varchar', length: 10 })
  fphm: string;

  @PrimaryColumn({ name: 'fpxmid', type: 'varchar', length: 10 })
  fpxmid: string;

  @Column({ name: 'fpxmmc', type: 'varchar', length: 30, nullable: true })
  fpxmmc: string | null;

  @Column({ name: 'fpxmje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  fpxmje: number | null;

  @Column({ name: 'fpxmqtje', type: 'decimal', precision: 16, scale: 4, nullable: true })
  fpxmqtje: number | null;
}
