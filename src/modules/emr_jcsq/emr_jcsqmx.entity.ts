import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { emr_jcxm } from "../emr_jcxm/emr_jcxm.entity";
import { emr_jcbw } from "../emr_jcbw/emr_jcbw.entity";
import { emr_jcff } from "../emr_jcff/emr_jcff.entity";
import { emr_jcsq } from "./emr_jcsq.entity";

@Entity("emr_jcsqmx", { schema: "dbo" })
export class emr_jcsqmx {

  @Column("varchar", { primary: true, name: "sqdh", length: 36 })
  sqdh: string;

  @Column("varchar", { primary: true, name: "jcxmid", length: 36 })
  jcxmid: string;

  @ManyToOne(() => emr_jcsq, jcsq => jcsq.jcsqmxList, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sqdh", referencedColumnName: "sqdh" })
  jcsq: emr_jcsq;

  @Column("varchar", { primary: true, name: "bwid", nullable: true, length: 36 })
  bwid: string | null;

  @Column("varchar", { primary: true, name: "ffid", nullable: true, length: 36 })
  ffid: string | null;

  // 多对一：检查项目
  @ManyToOne(() => emr_jcxm, jcxm => jcxm.jcxmmxList, { onDelete: "CASCADE" })
  @JoinColumn({ name: "jcxmid", referencedColumnName: "jcxmid" })
  jcxm: emr_jcxm;

  // 多对一：检查部位
  @ManyToOne(() => emr_jcbw, { eager: true })
  @JoinColumn({ name: "bwid", referencedColumnName: "bwid" })
  jcbw: emr_jcbw;

  // 多对一：检查方法
  @ManyToOne(() => emr_jcff, { eager: true })
  @JoinColumn({ name: "ffid", referencedColumnName: "ffid" })
  jcff: emr_jcff;


}
