import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { emr_jcbw } from "./emr_jcbw.entity";

@Entity("emr_jcbw_zlxm", { schema: "dbo" })
export class emr_jcbw_zlxm {
  @Column("varchar", { primary: true, name: "bwid", length: 36 })
  bwid: string;

  @Column("varchar", { primary: true, name: "xmid", length: 50, default: () => "''" })
  xmid: string;

  @ManyToOne(() => emr_jcbw, (jcbw) => jcbw.bwid)
  @JoinColumn({ name: "bwid" })
  jcbw: emr_jcbw;

}
