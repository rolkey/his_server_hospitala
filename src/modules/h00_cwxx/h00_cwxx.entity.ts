import { AfterLoad, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('h00_cwxx', { schema: 'dbo' })
export class h00_cwxx {
  @Column('char', {
    primary: true,
    name: 'cwid',
    length: 10,
    default: () => "''",
  })
  cwid: string;

  @Column('char', { name: 'cwmc', length: 30, default: () => "''" })
  cwmc: string;

  // @Column("char", { name: "cwbh", length: 10, default: () => "''" })
  // cwbh: string;

  // @Column("tinyint", { name: "cwxz", default: () => "1" })
  // cwxz: number;

  // @Column("tinyint", { name: "cwzt", default: () => "0" })
  // cwzt: number;

  // @Column("tinyint", { name: "yxbz", default: () => "1" })
  // yxbz: number;

  // @Column("decimal", {
  //   name: "cwfy",
  //   precision: 16,
  //   scale: 4,
  //   default: () => "0",
  // })
  // cwfy: number;

  // @Column("decimal", {
  //   name: "ktfy",
  //   precision: 16,
  //   scale: 4,
  //   default: () => "0",
  // })
  // ktfy: number;

  // @Column("tinyint", { name: "ktbz", default: () => "0" })
  // ktbz: number;

  // @Column("char", { name: "ksid", length: 10, default: () => "''" })
  // ksid: string;

  // @Column("char", { name: "bsid", length: 10, default: () => "''" })
  // bsid: string;

  // @Column("char", { name: "ysid", length: 10, default: () => "''" })
  // ysid: string;

  // @Column("char", { name: "hsid", length: 10, default: () => "''" })
  // hsid: string;

  // @Column("char", { name: "zyid", length: 12, default: () => "''" })
  // zyid: string;

  // @ManyToOne(() => h11_brxx)
  // @JoinColumn({ name: "zyid", referencedColumnName: "zyid" })
  // zyidEntity: h11_brxx;

  // @Column("char", { name: "szbm", length: 20, default: () => "''" })
  // szbm: string;

  // @Column("char", { name: "pybm", length: 20, default: () => "''" })
  // pybm: string;

  // @Column("char", { name: "wbbm", length: 20, default: () => "''" })
  // wbbm: string;

  // @Column("char", { name: "qtbm", length: 20, default: () => "''" })
  // qtbm: string;

  // @Column("char", { name: "brxm", nullable: true, length: 10 })
  // brxm: string | null;

  // @Column("tinyint", { name: "cwsl", nullable: true })
  // cwsl: number | null;

  // @Column("varchar", { name: "bz1", nullable: true, length: 10 })
  // bz1: string | null;

  // @Column("varchar", { name: "bz2", nullable: true, length: 10 })
  // bz2: string | null;

  @AfterLoad()
  trim() {
    if (this.cwid) {
      this.cwid = this.cwid.trim();
    }

    if (this.cwmc) {
      this.cwmc = this.cwmc.trim();
    }
  }
}
