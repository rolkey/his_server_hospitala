import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Entity('h00_fkfs', { schema: 'dbo' })
export class h00_fkfs {
  @Column('varchar', {
    primary: true,
    name: 'fkfsid',
    length: 10,
    default: () => "''",
  })
  fkfsid: string;

  @Column('varchar', {
    name: 'fkfsmc',
    nullable: true,
    length: 30,
    default: () => "''",
  })
  fkfsmc: string | null;

  @AfterLoad()
  trim() {
    if (this.fkfsid) {
      this.fkfsid = this.fkfsid.trim();
    }
    if (this.fkfsmc) {
      this.fkfsmc = this.fkfsmc.trim();
    }
  }
}
