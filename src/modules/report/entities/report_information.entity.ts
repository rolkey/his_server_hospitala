import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { SnowflakeIdGenerator } from '@/utils/SnowflakeIdGenerator';

@Entity('sys_report_information', { schema: 'dbo' })
export class ReportInformation {
  @PrimaryColumn({ type: 'varchar' })
  sys_report_information_id: string;

  @Column({ type: 'varchar' })
  report_category_id: string;

  @Column({ type: 'nvarchar', length: 50 })
  code: string;

  @Column({ type: 'nvarchar', length: 150 })
  title: string;

  @Column({ type: 'nvarchar', length: 50 })
  print_type: string;

  @Column({ type: 'tinyint', nullable: true })
  valid?: number;

  @BeforeInsert()
  generateId() {
    if (!this.sys_report_information_id) {
      this.sys_report_information_id = SnowflakeIdGenerator.generate();
    }
  }
}
