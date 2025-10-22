import { AfterLoad, Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';

@Entity('h00_syff', { schema: 'dbo' })
export class h00_syff {
  @Column('varchar', {
    primary: true,
    name: 'syffid',
    length: 10,
    default: () => "''",
  })
  syffid: string;

  @Column('varchar', {
    name: 'syffmc',
    nullable: true,
    length: 30,
    default: () => "''",
  })
  syffmc: string | null;

  @Column('char', {
    name: 'szbm',
    nullable: true,
    length: 20,
    default: () => "''",
  })
  szbm: string | null;

  @Column('char', {
    name: 'pybm',
    nullable: true,
    length: 20,
    default: () => "''",
  })
  pybm: string | null;

  @Column('char', {
    name: 'wbbm',
    nullable: true,
    length: 20,
    default: () => "''",
  })
  wbbm: string | null;

  // @Column("char", {
  //   name: "qtbm",
  //   nullable: true,
  //   length: 20,
  //   default: () => "''",
  // })
  // qtbm: string | null;

  // @Column("char", { name: "dyflid", nullable: true, length: 10 })
  // dyflid: string | null;

  @Column('varchar', {
    name: 'xmid',
    nullable: true,
    length: 50,
    default: () => "''",
  })
  xmid: string | null;

  @Column('varchar', { name: 'xmid1', nullable: true, length: 50 })
  xmid1: string | null;

  // @Column("varchar", { name: "xmid2", nullable: true, length: 50 })
  // xmid2: string | null;

  @Column('tinyint', { name: 'mzbz', nullable: true })
  mzbz: number | null;

  @Column('tinyint', { name: 'zybz', nullable: true })
  zybz: number | null;

  // @Column("varchar", { name: "uploadcode", nullable: true, length: 20 })
  // uploadcode: string | null;

  // @Column("varchar", { name: "bzxx2", nullable: true, length: 15 })
  // bzxx2: string | null;

  // @Column("varchar", { name: "ksid", nullable: true, length: 10 })
  // ksid: string | null;

  @OneToOne(() => H00_xmzd)
  @JoinColumn({ name: 'xmid', referencedColumnName: 'xmid' })
  h00_xmzd: H00_xmzd;

  @AfterLoad()
  trim() {
    this.syffid = this.syffid?.trim();
    this.syffmc = this.syffmc?.trim();
    this.xmid = this.xmid?.trim();
  }
}
