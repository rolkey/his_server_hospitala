import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Entity('__jbbmicd10', { schema: 'dbo' })
export class jbbmicd10 {
  @Column('varchar', { primary: true, name: 'jbid', length: 30 })
  jbid: string;

  @Column('varchar', { name: 'zwmc', nullable: true, length: 100 })
  zwmc: string | null;

  @Column('varchar', { name: 'icd10', nullable: true, length: 30 })
  icd10: string | null;

  // @Column("char", { name: "tjm", nullable: true, length: 10 })
  // tjm: string | null;

  // @Column("char", { name: "szbm", nullable: true, length: 20 })
  // szbm: string | null;

  @Column('varchar', { name: 'pybm', nullable: true, length: 20 })
  pybm: string | null;

  @Column('varchar', { name: 'wbbm', nullable: true, length: 20 })
  wbbm: string | null;

  // @Column("char", { name: "qtbm", nullable: true, length: 20 })
  // qtbm: string | null;

  @Column('varchar', { name: 'ywm', nullable: true, length: 50 })
  ywm: string | null;

  @Column('varchar', { name: 'icd11', nullable: true, length: 30 })
  icd11: string | null;

  @Column('varchar', { name: 'icd11mc', nullable: true, length: 100 })
  icd11mc: string | null;

  @Column('varchar', { name: 'ybbm', nullable: true, length: 30 })
  ybbm: string | null;

  @Column('varchar', { name: 'ybmc', nullable: true, length: 100 })
  ybmc: string | null;

  @Column('varchar', { name: 'bzbm', nullable: true, length: 30 })
  bzbm: string | null;

  @Column('varchar', { name: 'bzmc', nullable: true, length: 100 })
  bzmc: string | null;

  @Column('varchar', { name: 'qtdm', nullable: true, length: 30 })
  qtdm: string | null;

  @Column('varchar', { name: 'qtmc', nullable: true, length: 100 })
  qtmc: string | null;

  // @Column("varchar", { name: "bzxx", nullable: true, length: 60 })
  // bzxx: string | null;

  @Column('varchar', { name: 'lx', nullable: true, length: 1 })
  lx: string | null;

  @Column('varchar', { name: 'yxbz', nullable: true, length: 1 })
  yxbz: string | null;

  //   @Column("varchar", { name: "bz1", nullable: true, length: 2 })
  //   bz1: string | null;

  //   @Column("varchar", { name: "bz2", nullable: true, length: 10 })
  //   bz2: string | null;

  //   @Column("varchar", { name: "bz3", nullable: true, length: 30 })
  //   bz3: string | null;

  //   @Column("varchar", { name: "bz4", nullable: true, length: 60 })
  //   bz4: string | null;

  //   @Column("varchar", { name: "crbbm", nullable: true, length: 30 })
  //   crbbm: string | null;

  @Column('varchar', { name: 'crbmc', nullable: true, length: 80 })
  crbmc: string | null;

  @AfterLoad()
  trim() {
    if (this.ywm) {
      this.ywm = this.ywm.trim();
    }
    if (this.zwmc) {
      this.zwmc = this.zwmc.trim();
    }
    if (this.pybm) {
      this.pybm = this.pybm.trim();
    }
    if (this.wbbm) {
      this.wbbm = this.wbbm.trim();
    }
  }
}
