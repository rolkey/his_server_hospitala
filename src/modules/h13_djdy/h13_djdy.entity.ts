import { DateTransformer } from '@/common/transformers/date.transformer';
import { Column, Entity, } from 'typeorm';

@Entity('h13_djdy', { schema: 'dbo' })
export class h13_djdy {
  @Column('varchar', { primary: true, name: 'pblx', length: 10 })
  pblx: string;

  @Column('int', { primary: true, name: 'maxid' })
  maxid: number;

  @Column('varchar', { name: 'zyid', nullable: true, length: 15 })
  zyid: string | null;

  // @ManyToOne(() => h00_cwxx)
  // @JoinColumn({ name: 'rycw', referencedColumnName: 'cwid' })
  // rycwEntity: h00_cwxx;

  @Column('int', { name: 'dybz', nullable: true })
  dybz: number | null;

  @Column('varchar', { name: 'czry', nullable: true, length: 10 })
  czry: string | null;

  @Column('datetime', { name: 'czrq', nullable: true, default: () => 'getdate()' })
  @DateTransformer()
  czrq: Date | null;

  @Column('varchar', { name: 'dyflid', length: 10, default: '' })
  dyflid: string;
}
