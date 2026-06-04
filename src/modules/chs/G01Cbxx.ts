import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Index('PK_G10_CBXX_1', ['lsh', 'lshxh', 'xh'], { unique: true })
@Entity('G01_CBXX', { schema: 'dbo' })
export class G01Cbxx {
  @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  lsh: string;

  @Column('varchar', { primary: true, name: 'lshxh', length: 20 })
  lshxh: string;

  @Column('smallint', { primary: true, name: 'xh' })
  xh: number;

  @Column('varchar', { name: 'psn_no', nullable: true, length: 30 })
  psn_no: string | null;

  @Column('decimal', { name: 'balc', nullable: true, precision: 16, scale: 4 })
  balc: number | null;

  @Column('varchar', { name: 'insutype', nullable: true, length: 6 })
  insutype: string | null;

  @Column('varchar', { name: 'psn_type', nullable: true, length: 6 })
  psn_type: string | null;

  @Column('varchar', { name: 'psn_insu_stas', nullable: true, length: 6 })
  psn_insu_stas: string | null;

  @Column('varchar', { name: 'psn_insu_date', nullable: true, length: 30 })
  psn_insu_date: string | null;

  @Column('varchar', { name: 'paus_insu_date', nullable: true, length: 30 })
  paus_insu_date: string | null;

  @Column('varchar', { name: 'cvlserv_flag', nullable: true, length: 3 })
  cvlserv_flag: string | null;

  @Column('varchar', { name: 'insuplc_admdvs', nullable: true, length: 6 })
  insuplc_admdvs: string | null;

  @Column('nchar', { name: 'emp_name', nullable: true, length: 200 })
  emp_name: string | null;

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

  @AfterLoad()
  trim() {
    if (this.emp_name) {
      this.emp_name = this.emp_name.trim();
    }
  }
}
