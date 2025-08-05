import { AfterLoad, Column, Entity } from 'typeorm';

@Entity('h00_mzzd', { schema: 'dbo' })
export class h00_mzzd {
  @Column('varchar', { primary: true, name: 'mzid', length: 10 })
  mzid: string;

  @Column('varchar', { name: 'mzmc', nullable: true, length: 30 })
  mzmc: string | null;

  // @Column("char", { name: "szbm", nullable: true, length: 20 })
  // szbm: string | null;

  // @Column("char", { name: "pybm", nullable: true, length: 20 })
  // pybm: string | null;

  // @Column("char", { name: "wbbm", nullable: true, length: 20 })
  // wbbm: string | null;

  // @Column("char", { name: "qtbm", nullable: true, length: 20 })
  // qtbm: string | null;

  @AfterLoad()
  trim() {
    if (this.mzid) {
      this.mzid = this.mzid.trim();
    }
    if (this.mzmc) {
      this.mzmc = this.mzmc.trim();
    }
  }
}
