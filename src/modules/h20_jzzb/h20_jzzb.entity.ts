import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Entity('h20_jzzb', { schema: 'dbo' })
export class h20_jzzb {
  @Column('varchar', {
    primary: true,
    name: 'dwid',
    length: 15,
    default: () => "''",
  })
  dwid: string;

  @Column('varchar', {
    name: 'dwmc',
    nullable: true,
    length: 50,
    default: () => "''",
  })
  dwmc: string | null;

  @AfterLoad()
  trim() {
    if (this.dwid) {
      this.dwid = this.dwid.trim();
    }
    if (this.dwmc) {
      this.dwmc = this.dwmc.trim();
    }
  }
}
