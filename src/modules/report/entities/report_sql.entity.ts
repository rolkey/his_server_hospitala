import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_report_sql', { schema: 'dbo' })
export class report_sql {
  @PrimaryColumn({ type: 'bigint', name: 'sys_report_sql_id' })
  sys_report_sql_id: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  report_code?: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  title?: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  relation?: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  relation_condition?: string;

  @Column({ type: 'text', nullable: true })
  sql_script?: string;

  @Column({ type: 'smallint', nullable: true })
  create_index?: number;

  @Column({ type: 'nvarchar', length: 50, collation: 'Chinese_PRC_CI_AS', nullable: true })
  order_by?: string;
}
