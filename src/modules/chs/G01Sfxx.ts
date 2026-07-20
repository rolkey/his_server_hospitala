import { Column, Entity, Index } from 'typeorm';

@Entity('G01_SFXX', { schema: 'dbo' })
export class G01Sfxx {
  @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  lsh: string;

  @Column('varchar', { primary: true, name: 'lshxh', length: 20 })
  lshxh: string;

  @Column('smallint', { primary: true, name: 'xh' })
  xh: number;

  @Column('varchar', { name: 'psn_no', nullable: true, length: 30 })
  psn_no: string | null;

  @Column('varchar', { name: 'psn_idet_type', nullable: true, length: 10 })
  psn_idet_type: string | null;

  @Column('varchar', { name: 'psn_type_lv', nullable: true, length: 10 })
  psn_type_lv: string | null;

  @Column('varchar', { name: 'memo', nullable: true, length: 500 })
  memo: string | null;

  @Column('varchar', { name: 'begntime', nullable: true, length: 30 })
  begntime: string | null;

  @Column('varchar', { name: 'endtime', nullable: true, length: 30 })
  endtime: string | null;

  @Column('smallint', { name: 'yxbz', nullable: true, default: () => '(0)' })
  yxbz: number | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 20 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 20 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 20 })
  bz3: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 30 })
  bz4: string | null;

  @Column('varchar', { name: 'bz5', nullable: true, length: 30 })
  bz5: string | null;
}
