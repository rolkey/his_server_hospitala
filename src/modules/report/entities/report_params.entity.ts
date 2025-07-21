import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_report_params', { schema: 'dbo' })
export class report_params {
  @PrimaryColumn({ type: 'bigint' })
  param_id: string;

  @Column({ type: 'nvarchar', length: 50 })
  report_code: string;

  @Column({ type: 'nvarchar', length: 25, nullable: true })
  param_name?: string;

  @Column({ type: 'nvarchar', length: 35, nullable: true })
  param_title?: string;

  @Column({ type: 'nvarchar', length: 16, nullable: true })
  param_type?: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  param_value?: string;

  @Column({ type: 'nvarchar', length: 125, nullable: true })
  param_real_value?: string;

  @Column({ type: 'smallint', nullable: true })
  param_index?: number;

  @Column({ type: 'bit', nullable: true })
  param_visiable?: boolean;

  @Column({ type: 'bit', nullable: true })
  param_invalid?: boolean;

  @Column({ type: 'bit', nullable: true })
  param_must_input?: boolean;

  @Column({ type: 'nvarchar', length: 50, collation: 'Chinese_PRC_CI_AS', nullable: true })
  param_code_type?: string;

  @Column({ type: 'bit', default: false, nullable: true })
  param_hidden?: boolean;
}
