import { AfterLoad, Column, Entity } from 'typeorm';

@Entity('__zcmc', { schema: 'dbo' })
export class zcmc {
  @Column('char', {
    primary: true,
    name: 'zcid',
    length: 10,
    default: () => "''",
  })
  zcid: string;

  @Column('char', { name: 'zcmc', length: 30, default: () => "''" })
  zcmc: string;

  // @Column("char", { name: "szbm", length: 20, default: () => "''" })
  // szbm: string;

  // @Column("char", { name: "pybm", length: 20, default: () => "''" })
  // pybm: string;

  // @Column("char", { name: "wbbm", length: 20, default: () => "''" })
  // wbbm: string;

  // @Column("char", { name: "qtbm", length: 20, default: () => "''" })
  // qtbm: string;

  @Column('decimal', {
    name: 'zlfy',
    precision: 16,
    scale: 4,
    default: () => '0',
  })
  zlfy: number;

  @AfterLoad()
  trim() {
    if (this.zcid) {
      this.zcid = this.zcid.trim();
    }
    if (this.zcmc) {
      this.zcmc = this.zcmc.trim();
    }
  }
}
