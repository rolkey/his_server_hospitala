import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('h11_lsh')
export class h11_lsh {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  lshid: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lshmc: string;

  @Column({ type: 'numeric', precision: 18, scale: 0, nullable: true })
  dqlsh: number;
}
