import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { SnowflakeIdGenerator } from '@/utils/SnowflakeIdGenerator';

@Entity('sys_report_format', { schema: 'dbo' })
export class report_format {
  @PrimaryColumn({ type: 'bigint' })
  sys_report_format_id: number;

  @Column({ type: 'nvarchar', length: 50 })
  report_code: string;

  @Column({ type: 'nvarchar', length: 10 })
  code: string;

  @Column({ type: 'nvarchar', length: 50 })
  title: string;

  @Column({ type: 'ntext', nullable: true })
  report_format?: string;

  @BeforeInsert()
  generateId() {
    if (!this.sys_report_format_id) {
      this.sys_report_format_id = Number(SnowflakeIdGenerator.generate());
    }
  }
}
