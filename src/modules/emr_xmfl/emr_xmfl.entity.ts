import { Column, Entity, AfterLoad, ManyToOne, JoinColumn } from "typeorm";

@Entity("emr_xmfl", { schema: "dbo" })
export class emr_xmfl {

  @Column("varchar", { primary: true, name: "flid", length: 36, })
  flid: string;

  @Column("varchar", { name: "flmc", nullable: true, length: 100, })
  flmc: string | null;

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

  @Column("varchar", { name: "sjfl", nullable: true, length: 36, })
  sjfl: string;


  @ManyToOne(() => emr_xmfl)
  @JoinColumn({ name: "sjfl", referencedColumnName: "flid" })
  sjflEntity: emr_xmfl;
}
