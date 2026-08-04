import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Entity('h00_sypl', { schema: 'dbo' })
export class h00_sypl {
  @Column('varchar', { primary: true, name: 'syplid', length: 10 })
  syplid: string;

  @Column('varchar', { name: 'syplmc', nullable: true, length: 30 })
  syplmc: string | null;

  @Column('char', { name: 'szbm', nullable: true, length: 20 })
  szbm: string | null;

  // @Column("char", { name: "pybm", nullable: true, length: 20 })
  // pybm: string | null;

  // @Column("char", { name: "wbbm", nullable: true, length: 20 })
  // wbbm: string | null;

  // @Column("char", { name: "qtbm", nullable: true, length: 20 })
  // qtbm: string | null;

  @Column('decimal', { name: 'mrcs', nullable: true, precision: 16, scale: 4 })
  mrcs: number | null;

  // @Column("varchar", { name: "uploadcode", nullable: true, length: 20 })
  // uploadcode: string | null;

  // @Column("varchar", {
  //   name: "bzxx1",
  //   nullable: true,
  //   length: 30,
  //   default: () => "''",
  // })
  // bzxx1: string | null;

  // @Column("varchar", {
  //   name: "bzxx2",
  //   nullable: true,
  //   length: 30,
  //   default: () => "''",
  // })
  // bzxx2: string | null;

  // @Column("varchar", {
  //   name: "bzxx3",
  //   nullable: true,
  //   length: 30,
  //   default: () => "''",
  // })
  // bzxx3: string | null;

  // @Column("varchar", {
  //   name: "bzxx4",
  //   nullable: true,
  //   length: 30,
  //   default: () => "''",
  // })
  // bzxx4: string | null;

  // @Column("varchar", {
  //   name: "bzxx5",
  //   nullable: true,
  //   length: 80,
  //   default: () => "''",
  // })
  // bzxx5: string | null;

  @AfterLoad()
  trim() {
    if (this.syplid) {
      this.syplid = this.syplid.trim();
    }
    if (this.syplmc) {
      this.syplmc = this.syplmc.trim();
    }
  }
}
