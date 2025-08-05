import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Index('h00_ybfl_x', ['flid'], { unique: true })
@Entity('h00_ybfl', { schema: 'dbo' })
export class h00_ybfl {
  @Column('smallint', { primary: true, name: 'flid' })
  flid: number;

  @Column('varchar', { name: 'flmc', nullable: true, length: 12 })
  flmc: string | null;

  // @Column("decimal", { name: "zfbl", nullable: true, precision: 16, scale: 2 })
  // zfbl: number | null;

  // @Column("decimal", { name: "zflx", nullable: true, precision: 16, scale: 2 })
  // zflx: number | null;

  // @Column("char", { name: "bzxx", nullable: true, length: 30 })
  // bzxx: string | null;

  @AfterLoad()
  trim() {
    if (this.flmc) {
      this.flmc = this.flmc.trim();
    }
  }
}
