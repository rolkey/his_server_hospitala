import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Entity('h00_fylb', { schema: 'dbo' })
export class h00_fylb {
  @Column('varchar', {
    primary: true,
    name: 'fylbid',
    length: 10,
    default: () => "''",
  })
  fylbid: string;

  @Column('varchar', {
    name: 'fylbmc',
    nullable: true,
    length: 30,
    default: () => "''",
  })
  fylbmc: string | null;

  // @Column("char", { name: "fpxmid", length: 10, default: () => "''" })
  // fpxmid: string;

  // @Column("char", {
  //   name: "szbm",
  //   nullable: true,
  //   length: 20,
  //   default: () => "''",
  // })
  // szbm: string | null;

  // @Column("char", {
  //   name: "pybm",
  //   nullable: true,
  //   length: 20,
  //   default: () => "''",
  // })
  // pybm: string | null;

  // @Column("char", {
  //   name: "wbbm",
  //   nullable: true,
  //   length: 20,
  //   default: () => "''",
  // })
  // wbbm: string | null;

  // @Column("char", {
  //   name: "qtbm",
  //   nullable: true,
  //   length: 20,
  //   default: () => "''",
  // })
  // qtbm: string | null;

  // @Column("char", { name: "mzfpxmid", nullable: true, length: 10 })
  // mzfpxmid: string | null;

  // @Column("char", { name: "cwflid", nullable: true, length: 20 })
  // cwflid: string | null;

  // @Column("char", { name: "mzdy", nullable: true, length: 20 })
  // mzdy: string | null;

  // @Column("varchar", { name: "cflb", nullable: true, length: 10 })
  // cflb: string | null;

  // @Column("varchar", { name: "bz1", nullable: true, length: 10 })
  // bz1: string | null;

  // @Column("varchar", { name: "bz2", nullable: true, length: 10 })
  // bz2: string | null;

  // @Column("varchar", { name: "uploadcode", nullable: true, length: 20 })
  // uploadcode: string | null;

  // @Column("varchar", { name: "bz3", nullable: true, length: 10 })
  // bz3: string | null;

  // @Column("varchar", { name: "bz4", nullable: true, length: 10 })
  // bz4: string | null;

  // @Column("varchar", { name: "bz5", nullable: true, length: 10 })
  // bz5: string | null;

  // @Column("varchar", { name: "bz6", nullable: true, length: 10 })
  // bz6: string | null;

  // @Column("varchar", { name: "swbm", nullable: true, length: 30 })
  // swbm: string | null;

  // @Column("varchar", { name: "bz7", nullable: true, length: 60 })
  // bz7: string | null;

  // @Column("varchar", { name: "bskpd", nullable: true, length: 20 })
  // bskpd: string | null;

  // @Column("varchar", { name: "cwdl", nullable: true, length: 20 })
  // cwdl: string | null;

  // @Column("varchar", { name: "bsxm1", nullable: true, length: 20 })
  // bsxm1: string | null;

  // @Column("varchar", { name: "bsmc1", nullable: true, length: 20 })
  // bsmc1: string | null;

  // @Column("varchar", { name: "bsxm2", nullable: true, length: 20 })
  // bsxm2: string | null;

  // @Column("varchar", { name: "bsmc2", nullable: true, length: 20 })
  // bsmc2: string | null;

  // @Column("decimal", {
  //   name: "zfbl",
  //   nullable: true,
  //   precision: 12,
  //   scale: 4,
  //   default: () => "(0)",
  // })
  // zfbl: number | null;

  // @Column("decimal", {
  //   name: "zyzfbl",
  //   nullable: true,
  //   precision: 12,
  //   scale: 4,
  //   default: () => "(0)",
  // })
  // zyzfbl: number | null;

  // @Column("decimal", {
  //   name: "tsryzfbl",
  //   precision: 16,
  //   scale: 2,
  //   default: () => "(1)",
  // })
  // tsryzfbl: number;

  @AfterLoad()
  trim() {
    if (this.fylbid) {
      this.fylbid = this.fylbid.trim();
    }
    if (this.fylbmc) {
      this.fylbmc = this.fylbmc.trim();
    }
  }
}
