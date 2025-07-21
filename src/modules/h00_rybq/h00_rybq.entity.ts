import { AfterLoad, Column, Entity, Index } from "typeorm";


@Entity("h00_rybq", { schema: "dbo" })
export class h00_rybq {
  @Column("char", { primary: true, name: "rybqid", length: 10 })
  rybqid: string;

  @Column("char", { name: "rybqmc", nullable: true, length: 30 })
  rybqmc: string | null;

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
    if (this.rybqid) {
      this.rybqid = this.rybqid.trim();
    }
    if (this.rybqmc) {
      this.rybqmc = this.rybqmc.trim();
    }

  }
}
