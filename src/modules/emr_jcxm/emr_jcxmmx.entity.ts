import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { emr_jcxm } from "../emr_jcxm/emr_jcxm.entity";
import { emr_jcbw } from "../emr_jcbw/emr_jcbw.entity";
import { emr_jcff } from "../emr_jcff/emr_jcff.entity";

@Entity("emr_jcxmmx", { schema: "dbo" })
export class emr_jcxmmx {

  // @Column("varchar", { primary: true, name: "jcxmid", length: 36 })
  // id: string;

  @Column("varchar", { primary: true, name: "jcxmid", length: 36 })
  jcxmid: string;

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
