import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Entity('h00_brlx', { schema: 'dbo' })
export class h00_brlx {
  @Column('varchar', { primary: true, name: 'brlxid', length: 10 })
  brlxid: string;

  @Column('varchar', { name: 'brlxmc', nullable: true, length: 30 })
  brlxmc: string | null;

  // @Column("char", { name: "brlbid", length: 10 })
  // brlbid: string;

  // @Column("char", { name: "szbm", nullable: true, length: 20 })
  // szbm: string | null;

  // @Column("char", { name: "pybm", nullable: true, length: 20 })
  // pybm: string | null;

  // @Column("char", { name: "wbbm", nullable: true, length: 20 })
  // wbbm: string | null;

  // @Column("char", { name: "qtbm", nullable: true, length: 20 })
  // qtbm: string | null;

  // @Column("numeric", { name: "zfbl", nullable: true, precision: 18, scale: 2 })
  // zfbl: number | null;

  // @Column("varchar", { name: "bz1", nullable: true, length: 10 })
  // bz1: string | null;

  // @Column("varchar", { name: "bz2", nullable: true, length: 10 })
  // bz2: string | null;

  @AfterLoad()
  trim() {
    if (this.brlxid) {
      this.brlxid = this.brlxid.trim();
    }

    if (this.brlxmc) {
      this.brlxmc = this.brlxmc.trim();
    }
  }
}
