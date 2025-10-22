import { AfterLoad, Column, Entity, Index } from 'typeorm';

@Entity('__csxz', { schema: 'dbo' })
export class csxz {
  @Column('varchar', { primary: true, name: 'id', length: 10 })
  id: string;

  @Column('varchar', { name: 'name1', nullable: true, length: 50 })
  data: string | null;

  @Column('varchar', { name: 'data1', nullable: true, length: 50 })
  name: string | null;

  @Column('int', { name: 'no1', nullable: true })
  no: number | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 60 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 30 })
  bz2: string | null;

  // @Column("varchar", { name: "bz3", nullable: true, length: 30 })
  // bz3: string | null;

  @Column('tinyint', { name: 'yxbz', nullable: true, default: () => '(1)' })
  yxbz: number | null;

  @Column('varchar', { primary: true, name: 'lx', length: 30 })
  lx: string;

  // @Column("varchar", { name: "bz5", nullable: true, length: 50 })
  // bz5: string | null;

  @Column('varchar', { name: 'pybm', nullable: true, length: 20 })
  pybm: string | null;

  @Column('varchar', { name: 'wbbm', nullable: true, length: 20 })
  wbbm: string | null;

  // @Column("varchar", { name: "qtbm", nullable: true, length: 20 })
  // qtbm: string | null;

  // @AfterLoad()
  // trim() {
  //   if (this.data) {
  //     this.data = this.data.trim();
  //   }
  //   if (this.name) {
  //     this.name = this.name.trim();
  //   }
  // }
}
