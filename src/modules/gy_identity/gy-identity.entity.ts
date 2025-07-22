import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('GY_IDENTITY')
export class GyIdentity {
  @PrimaryColumn({ type: 'varchar', length: 30 })
  tname: string;

  @Column({ type: 'numeric', precision: 18, scale: 0, nullable: true })
  value: number;

  @Column({ type: 'int', nullable: true })
  origin_value: number;

  @Column({ type: 'int', nullable: true })
  inc_value: number;
}
