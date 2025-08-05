import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Index('sk_ypflid', ['ypflid'], { unique: true })
@Entity('h00_ypfl', { schema: 'dbo' })
export class h00_ypfl {
  @Column('varchar', { primary: true, name: 'ypflid', length: 10 })
  ypflid: string;

  @Column('varchar', { name: 'ypflmc', nullable: true, length: 30 })
  ypflmc: string | null;

  // @Column("char", { name: "szbm", nullable: true, length: 20 })
  // szbm: string | null;

  // @Column("char", { name: "pybm", nullable: true, length: 20 })
  // pybm: string | null;

  // @Column("char", { name: "wbbm", nullable: true, length: 20 })
  // wbbm: string | null;

  // @Column("char", { name: "qtbm", nullable: true, length: 20 })
  // qtbm: string | null;

  // @Column("varchar", { name: "ksid", nullable: true, length: 10 })
  // ksid: string | null;

  // @Column("varchar", { name: "ywlb", nullable: true, length: 20 })
  // ywlb: string | null;

  // @Column("varchar", { name: "bz1", nullable: true, length: 20 })
  // bz1: string | null;

  // @Column("varchar", { name: "bz2", nullable: true, length: 20 })
  // bz2: string | null;

  @AfterLoad()
  trim() {
    if (this.ypflid) {
      this.ypflid = this.ypflid.trim();
    }
    if (this.ypflmc) {
      this.ypflmc = this.ypflmc.trim();
    }
  }
}
