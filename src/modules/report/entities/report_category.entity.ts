import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { SnowflakeIdGenerator } from '@/utils/SnowflakeIdGenerator';

@Entity('sys_report_category', { schema: 'dbo' })
export class ReportCategory {
  @PrimaryColumn({ type: 'nvarchar', name: 'sys_report_category_id' })
  sys_report_category_id: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  title?: string;

  @Column({ type: 'bigint', nullable: false })
  parent_id?: string;

  @BeforeInsert()
  generateId() {
    if (!this.sys_report_category_id) {
      this.sys_report_category_id = SnowflakeIdGenerator.generate();
    }
  }
}
