import { Column, Entity, ManyToMany, JoinTable, JoinColumn, ManyToOne } from 'typeorm';

import { emr_xmfl } from '../emr_xmfl/emr_xmfl.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';

@Entity('emr_jcff', { schema: 'dbo' })
export class emr_jcff {
  @Column('varchar', { primary: true, name: 'ffid', length: 36 })
  ffid: string;

  @Column('varchar', { name: 'ffmc', nullable: true, length: 100 })
  ffmc: string | null;

  @Column('varchar', { name: 'flid', nullable: true, length: 36 })
  flid: string | null;

  @ManyToOne(() => emr_xmfl)
  @JoinColumn({ name: 'flid', referencedColumnName: 'flid' })
  flidEntity: emr_xmfl;

  @ManyToMany(() => H00_xmzd, { cascade: ['update'] })
  @JoinTable({
    name: 'emr_jcff_zlxm',
    joinColumn: {
      name: 'ffid',
      referencedColumnName: 'ffid',
    },
    inverseJoinColumn: {
      name: 'xmid',
      referencedColumnName: 'xmid',
    },
  })
  zlxmList: H00_xmzd[];

  @Column('varchar', { name: 'pybm', nullable: true, length: 100 })
  pybm: string | null;

  @Column('varchar', { name: 'wbbm', nullable: true, length: 100 })
  wbbm: string | null;

  @Column('varchar', { name: 'qtbm', nullable: true, length: 100 })
  qtbm: string | null;

  @Column('varchar', { name: 'zt', nullable: true, length: 1 })
  zt: string | null;

  @Column('datetime', { name: 'create_time', nullable: true })
  createTime: Date;

  @Column('datetime', { name: 'update_time', nullable: true })
  updateTime: Date;

  @Column('varchar', { name: 'create_by', nullable: true, length: 36 })
  createBy: string | null;

  @Column('varchar', { name: 'update_by', nullable: true, length: 36 })
  updateBy: string | null;
}
