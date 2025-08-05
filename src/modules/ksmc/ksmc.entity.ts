import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { usrcat } from '../usrcat/usrcat.entity';
import { fyxx } from '../fyxx/fyxx.entity';

@Entity('__ksmc', { schema: 'dbo' })
export class ksmc {
  @Column('varchar', {
    primary: true,
    name: 'ksid',
    length: 10,
    default: () => "''",
  })
  ksid: string;

  @Column('varchar', {
    name: 'ksmc',
    nullable: true,
    length: 30,
    default: () => "''",
  })
  ksmc: string | null;

  @Column('varchar', { name: 'ksflid', length: 10, default: () => "''" })
  ksflid: string;

  // @Column("char", {
  //   name: "szbm",
  //   nullable: true,
  //   length: 20,
  //   default: () => "''",
  // })
  // szbm: string | null;

  @Column('varchar', {
    name: 'pybm',
    nullable: true,
    length: 20,
    default: () => "''",
  })
  pybm: string | null;

  @Column('varchar', {
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

  // @Column("smallint", { name: "bz", nullable: true, default: () => "1" })
  // bz: number | null;

  // @Column("smallint", { name: "cws", nullable: true })
  // cws: number | null;

  // @Column("tinyint", { name: "xmlc", nullable: true })
  // xmlc: number | null;

  // @Column("decimal", { name: "xmkd", nullable: true, precision: 16, scale: 4 })
  // xmkd: number | null;

  // @Column("varchar", { name: "zybh", nullable: true, length: 12 })
  // zybh: string | null;

  // @Column("varchar", { name: "bz1", nullable: true, length: 10 })
  // bz1: string | null;

  // @Column("varchar", { name: "bz2", nullable: true, length: 10 })
  // bz2: string | null;

  // @Column("varchar", { name: "sjbz", nullable: true, length: 10 })
  // sjbz: string | null;

  // @Column("varchar", { name: "uploadcode", nullable: true, length: 20 })
  // uploadcode: string | null;

  @Column('varchar', { name: 'fyid', nullable: true, length: 10 })
  fyid: string | null;

  // @Column("varchar", { name: "bz3", nullable: true, length: 20 })
  // bz3: string | null;

  // @Column("varchar", { name: "bz4", nullable: true, length: 30 })
  // bz4: string | null;

  // @Column("varchar", { name: "kslx", nullable: true, length: 50 })
  // kslx: string | null;

  // @Column("datetime", { name: "begntime", nullable: true })
  // begntime: Date | null;

  // @Column("datetime", { name: "endtime", nullable: true })
  // endtime: Date | null;

  // @Column("varchar", { name: "itro", nullable: true, length: 500 })
  // itro: string | null;

  // @Column("varchar", { name: "fzry", nullable: true, length: 50 })
  // fzry: string | null;

  // @Column("varchar", { name: "fzdh", nullable: true, length: 50 })
  // fzdh: string | null;

  // @Column("varchar", { name: "nr", nullable: true, length: 500 })
  // nr: string | null;

  // @Column("datetime", { name: "clrq", nullable: true })
  // clrq: Date | null;

  // @Column("int", { name: "ybcws", nullable: true })
  // ybcws: number | null;

  // @Column("int", { name: "ysrs", nullable: true })
  // ysrs: number | null;

  // @Column("int", { name: "hsrs", nullable: true })
  // hsrs: number | null;

  // @Column("int", { name: "yprs", nullable: true })
  // yprs: number | null;

  // @Column("int", { name: "yjrs", nullable: true })
  // yjrs: number | null;

  // @Column("varchar", { name: "memo", nullable: true, length: 30 })
  // memo: string | null;

  // @Column("smallint", { name: "dxbz", nullable: true, default: () => "(0)" })
  // dxbz: number | null;

  @Column('smallint', { name: 'ksfl', nullable: true, default: () => '(0)' })
  ksfl: number | null;

  // @Column("smallint", { name: "dzsort", nullable: true, default: () => "(0)" })
  // dzsort: number | null;

  @ManyToOne(() => fyxx, (fyxx) => fyxx.ksmcs)
  @JoinColumn({ name: 'fyid', referencedColumnName: 'fyid' })
  fyxxEntity: fyxx;

  @ManyToMany(() => usrcat, (usrcat) => usrcat.ksmcs, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: '__ksry',
    joinColumn: {
      name: 'ksid',
      referencedColumnName: 'ksid',
    },
    inverseJoinColumn: {
      name: 'usid',
      referencedColumnName: 'usid',
    },
  })
  usrcats: usrcat[];

  @AfterLoad()
  trim() {
    if (this.ksid) {
      this.ksid = this.ksid.trim();
    }
    if (this.ksmc) {
      this.ksmc = this.ksmc.trim();
    }
    if (this.pybm) {
      this.pybm = this.pybm.trim();
    }
    if (this.wbbm) {
      this.wbbm = this.wbbm.trim();
    }
  }
}
