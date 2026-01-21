import { Entity, Column, JoinColumn, OneToOne, OneToMany } from "typeorm";

import { emr_jcsqmx } from "./emr_jcsqmx.entity";
import { DateTransformer } from "@/common/transformers/date.transformer";

@Entity("emr_jcsq", { schema: "dbo" })
export class emr_jcsq {

  @Column("varchar", { primary: true, name: "sqdh", length: 36, })
  sqdh: string; // 申请单号

  @Column("varchar", { length: 36, nullable: true })
  ylzh: string | null; // 医疗账号

  @Column("varchar", { length: 36, nullable: true })
  mzid: string | null; // 门诊id

  @Column("varchar", { length: 1, nullable: true })
  jzlx: string | null; // 就诊类型

  @Column("varchar", { length: 60, nullable: true })
  brxm: string | null; // 病人姓名

  @Column("varchar", { length: 10, nullable: true })
  brxb: string | null; // 病人性别

  @Column("varchar", { length: 36, nullable: true })
  brnl: string | null; // 病人年龄

  @Column("datetime", { nullable: true })
  @DateTransformer()
  jcsj: Date; // 检查时间

  @Column("datetime", { name: 'sqsj', nullable: true })
  @DateTransformer()
  sqsj: Date // 申请时间

  @Column("varchar", { nullable: true })
  sqys: string | null; // 申请医生

  @Column("varchar", { nullable: true })
  sqks: string | null; // 申请科室

  @Column("datetime", { nullable: true })
  @DateTransformer()
  shsj: Date; // 审核时间

  @Column("varchar", { nullable: true })
  shys: string | null; // 审核医生（原 SQL 是 datetime，建议改为 varchar）

  @Column("varchar", { length: 36, nullable: true })
  zxks: string | null; // 执行科室

  @Column("varchar", { length: 36, nullable: true })
  zxys: string | null; // 执行医生

  @Column("datetime", { nullable: true })
  @DateTransformer()
  tjsj: Date; // 提交时间

  @Column("varchar", { length: 36, nullable: true })
  tjys: string | null; // 提交医生

  @Column("datetime", { nullable: true })
  @DateTransformer()
  bgsj: Date; // 报告时间

  @Column("varchar", { length: 36, nullable: true })
  bgys: string | null; // 报告医生

  @Column("varchar", { length: 255, nullable: true })
  jcmd: string | null; // 检查目的

  @Column("varchar", { length: 255, nullable: true })
  bzxx: string | null; // 备注信息

  @Column("varchar", { length: 1, nullable: true })
  jczt: string | null; // 检查状态

  @Column("varchar", { length: 80, nullable: true })
  icd10: string | null; // ICD10 诊断编码

  @Column("varchar", { length: 255, nullable: true })
  jbmc: string | null; // 疾病名称

  @Column("varchar", { nullable: true, length: 36, })
  cfid: string | null; // 申请医生

  @Column("varchar", { nullable: true, length: 36, })
  flid: string | null;

  // @OneToOne(() => h23_cfzb, (h23_cfzb) => h23_cfzb.emr_jcsq)
  // @JoinColumn({ name: "cfid", referencedColumnName: 'cfid' })
  // h23_cfzb: h23_cfzb;

  @OneToMany(() => emr_jcsqmx, mx => mx.jcsq, { cascade: true })
  jcsqmxList: emr_jcsqmx[];

  @Column("varchar", { nullable: true, length: 255, })
  zs: string | null;

  @Column("varchar", { nullable: true, length: 255, })
  xbs: string | null;

  @Column("varchar", { nullable: true, length: 255, })
  tz: string | null;

  @Column("varchar", { nullable: true, length: 255, })
  jcbw: string | null;

}
