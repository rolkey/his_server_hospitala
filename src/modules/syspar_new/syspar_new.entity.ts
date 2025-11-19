import { Column, Entity } from "typeorm";


@Entity("__syspar_new", { schema: "dbo" })
export class syspar_new {
  @Column("varchar", {
    primary: true,
    name: "syid",
    default: () => "''",
  })
  syid: string;

  @Column("varchar", {
    primary: true,
    name: "prid",
    default: () => "''",
  })
  prid: string;

  @Column("varchar", {
    name: "pnam",
    nullable: true,
    default: () => "''",
  })
  pnam: string | null;

  @Column("varchar", {
    name: "pval",
    nullable: true,
    default: () => "''",
  })
  pval: string | null;
}
