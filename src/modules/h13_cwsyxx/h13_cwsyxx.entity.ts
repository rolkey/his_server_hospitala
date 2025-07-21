import { AfterLoad, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';

@Entity('h13_cwsyxx', { schema: 'dbo' })
export class h13_cwsyxx {
  @Column('char', { primary: true, name: 'cwid', length: 10 })
  cwid: string;

  @ManyToOne(() => h00_cwxx)
  @JoinColumn({ name: 'cwid', referencedColumnName: 'cwid' })
  cwidEntity: h00_cwxx;

  // @Column("datetime", { name: "lrsj", nullable: true })
  // lrsj: Date | null;

  @Column('char', { name: 'bsid', nullable: true, length: 10 })
  bsid: string | null;

  @Column('char', { name: 'ksid', nullable: true, length: 10 })
  ksid: string | null;

  // @Column("char", { name: "lryid", nullable: true, length: 10 })
  // lryid: string | null;

  // @Column("char", { name: "hsid", nullable: true, length: 10 })
  // hsid: string | null;

  @Column('char', { name: 'zyid', nullable: true, length: 12 })
  zyid: string | null;

  @ManyToOne(() => h11_brxx)
  @JoinColumn({ name: 'zyid', referencedColumnName: 'zyid' })
  zyidEntity: h11_brxx;

  @Column('smallint', { name: 'cwzt', nullable: true })
  cwzt: number | null;

  // @Column("char", { name: "hsmc", nullable: true, length: 20 })
  // hsmc: string | null;

  // @Column("char", { name: "ysid", nullable: true, length: 10 })
  // ysid: string | null;

  // @Column("smallint", { name: "cwxz", nullable: true })
  // cwxz: number | null;

  // @Column("char", { name: "ysmc", nullable: true, length: 20 })
  // ysmc: string | null;

  // @Column("char", { name: "fpsid", nullable: true, length: 10 })
  // fpsid: string | null;

  // @Column("char", { name: "fphsmc", nullable: true, length: 10 })
  // fphsmc: string | null;

  // @Column("datetime", { name: "fpsj", nullable: true })
  // fpsj: Date | null;

  @Column('char', { name: 'cwfpxx', nullable: true, length: 60 })
  cwfpxx: string | null;

  // @Column("char", { name: "ysfpxx", nullable: true, length: 60 })
  // ysfpxx: string | null;

  // @Column("char", { name: "hsfpxx", nullable: true, length: 60 })
  // hsfpxx: string | null;

  // @Column("tinyint", { name: "cwsl", nullable: true })
  // cwsl: number | null;

  // @Column("varchar", { name: "bz1", nullable: true, length: 10 })
  // bz1: string | null;

  // @Column("varchar", { name: "id", nullable: true, length: 10 })
  // id: string | null;

  cwmc: string | null;

  @AfterLoad()
  trim() {
    if (this.cwid) {
      this.cwid = this.cwid.trim();
    }
    if (this.cwidEntity && this.cwidEntity.cwid) {
      this.cwmc = this.cwidEntity.cwmc.trim();
    }
  }
}
