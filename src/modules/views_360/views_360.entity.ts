import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';

@Entity('views_360', { schema: 'dbo' })
export class Views360 {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 32 })
  id: string;

  @Column({ name: 'view_name', type: 'varchar', length: 100, nullable: true })
  viewName: string | null;

  @Column({ name: 'view_type', type: 'varchar', length: 50, nullable: true })
  viewType: string | null;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ name: 'yxbz', type: 'int', default: 1, nullable: true })
  yxbz: number | null;

  @Column({ name: 'data_sta', type: 'datetime', nullable: true })
  @DateTransformer()
  dataSta: Date | null;

  @Column({ name: 'data_end', type: 'datetime', nullable: true })
  @DateTransformer()
  dataEnd: Date | null;
}
