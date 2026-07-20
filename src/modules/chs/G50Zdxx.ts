import { DateTransformer } from '@/common/transformers/date.transformer';
import { Column, Entity, Index } from 'typeorm';

@Index('PK_G50_ZDXX', ['lsh', 'xh'], { unique: true })
@Entity('G50_ZDXX', { schema: 'dbo' })
export class G50Zdxx {
  @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  lsh: string;

  @Column('smallint', { primary: true, name: 'xh' })
  xh: number;

  @Column('varchar', { name: 'diag_type', nullable: true, length: 3 })
  diag_type: string | null;

  @Column('varchar', { name: 'diag_srt_no', nullable: true, length: 3 })
  diag_srt_no: string | null;

  @Column('varchar', { name: 'diag_code', nullable: true, length: 30 })
  diag_code: string | null;

  @Column('varchar', { name: 'diag_name', nullable: true, length: 100 })
  diag_name: string | null;

  @Column('varchar', { name: 'diag_dept', nullable: true, length: 30 })
  diag_dept: string | null;

  @Column('varchar', { name: 'dise_dor_no', nullable: true, length: 30 })
  dise_dor_no: string | null;

  @Column('varchar', { name: 'dise_dor_name', nullable: true, length: 50 })
  dise_dor_name: string | null;

  @DateTransformer()
  @Column('datetime', { name: 'diag_time', nullable: true })
  diag_time: Date | null;

  @Column('varchar', { name: 'vali_flag', nullable: true, length: 3 })
  vali_flag: string | null;

  @Column('varchar', { name: 'psn_no', nullable: true, length: 30 })
  psn_no: string | null;

  @Column('varchar', { name: 'maindiag_flag', nullable: true, length: 3 })
  maindiag_flag: string | null;

  @Column('varchar', { name: 'adm_cond', nullable: true, length: 100 })
  adm_cond: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 30 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 30 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 30 })
  bz3: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 30 })
  bz4: string | null;

  @Column('varchar', { name: 'bz5', nullable: true, length: 30 })
  bz5: string | null;
}
