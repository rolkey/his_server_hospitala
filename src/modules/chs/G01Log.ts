import { Column, Entity, Index } from 'typeorm';

@Entity('G01_Log', { schema: 'dbo' })
export class G01Log {
  @Column('varchar', { primary: true, name: 'id', length: 255 })
  id: string;

  @Column('varchar', { primary: true, name: 'infno', length: 30 })
  infno: string;

  @Column('varchar', { name: 'mdtrt_id', nullable: true, length: 30 })
  mdtrt_id: string | null;

  @Column('varchar', { name: 'psn_no', nullable: true, length: 30 })
  psn_no: string | null;

  @Column('varchar', { name: 'msgid', nullable: true, length: 255 })
  msgid: string | null;

  @Column('varchar', { name: 'lsh', nullable: true, length: 50 })
  lsh: string | null;

  @Column('varchar', { name: 'lshxh', nullable: true, length: 50 })
  lshxh: string | null;

  @Column('datetime', { name: 'createtime', nullable: true })
  createtime: Date | null;
}
