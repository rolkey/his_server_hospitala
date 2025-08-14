import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Entity('h11_zybh', { schema: 'dbo' })
export class h11_zybh {
  @Column('decimal', {
    primary: true,
    name: 'zybh',
    precision: 18,
    scale: 0,
    default: () => "''",
  })
  zybh: number | null;

  @Column('smallint', {
    name: 'hsbz',
    nullable: true,
    default: () => "''",
  })
  hsbz: number | null;

  @Column('int', {
    name: 'code',
    nullable: true,
    default: () => "''",
  })
  code: number | null;

  @AfterLoad()
  trim() {
    // if (this.fkfsid) {
    //   this.fkfsid = this.fkfsid.trim();
    // }
    // if (this.fkfsmc) {
    //   this.fkfsmc = this.fkfsmc.trim();
    // }
  }
}
