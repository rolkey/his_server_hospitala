import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('emr_jcsqxmmx', { schema: 'dbo' })
export class emr_jcsqxmmx {
  @Column('varchar', { primary: true, name: 'cfid' })
  cfid: string;

  @Column('int', { primary: true, name: 'mxxh' })
  mxxh: number;
}
