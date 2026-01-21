import { Column, Entity, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { emr_jcbw } from "../emr_jcbw/emr_jcbw.entity";
import { emr_jcff } from "../emr_jcff/emr_jcff.entity";
import { emr_xmfl } from "../emr_xmfl/emr_xmfl.entity";
import { emr_jcxmmx } from "./emr_jcxmmx.entity";

@Entity("emr_jcxm", { schema: "dbo" })
export class emr_jcxm {

  @Column("varchar", { primary: true, name: "jcxmid", length: 36, })
  jcxmid: string;

  @Column("varchar", { name: "jcxmmc", nullable: true, length: 100, })
  jcxmmc: string | null;

  @Column("varchar", { name: "flid", nullable: true, length: 36, })
  flid: string | null;

  @ManyToOne(() => emr_xmfl)
  @JoinColumn({ name: "flid", referencedColumnName: "flid" })
  flidEntity: emr_xmfl;

  @OneToMany(() => emr_jcxmmx, mx => mx.jcxm, { cascade: true })
  jcxmmxList: emr_jcxmmx[];

  @Column("varchar", { name: "bzxx", nullable: true, length: 100, })
  bzxx: string | null;

  @Column("varchar", { name: "pybm", nullable: true, length: 100, })
  pybm: string | null;

  @Column("varchar", { name: "wbbm", nullable: true, length: 100, })
  wbbm: string | null;

  @Column("varchar", { name: "qtbm", nullable: true, length: 100, })
  qtbm: string | null;

  @Column("varchar", { name: "zt", nullable: true, length: 1, })
  zt: string | null;

  @Column("datetime", { name: "create_time", nullable: true })
  createTime: Date;

  @Column("datetime", { name: "update_time", nullable: true })
  updateTime: Date;

  @Column("varchar", { name: "create_by", nullable: true, length: 36, })
  createBy: string | null;

  @Column("varchar", { name: "update_by", nullable: true, length: 36, })
  updateBy: string | null;
}
