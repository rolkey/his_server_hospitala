import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { H31Lymx } from './h31_lymx.entity';

@Entity('h31_lyjl', { schema: 'dbo' })
export class H31Lyjl {
  @PrimaryColumn({ type: 'varchar', length: 10, default: '' })
  ksid: string;

  @PrimaryColumn({ type: 'varchar', length: 20, default: '' })
  djlb: string;

  @PrimaryColumn({ type: 'varchar', length: 12, default: '' })
  djbh: string;

  @Column({ type: 'datetime', default: () => 'getdate()' })
  djsj: Date;

  @Column({ type: 'varchar', length: 30, default: '' })
  ywlb: string;

  @Column({ type: 'decimal', precision: 4, scale: 0, default: 0 })
  flbs: number;

  @Column({ type: 'decimal', precision: 16, scale: 4, default: 0 })
  hjje: number;

  @Column({ type: 'datetime', nullable: true })
  sqsj: Date | null;

  @Column({ type: 'varchar', length: 10, default: '' })
  fhksid: string;

  @Column({ type: 'varchar', length: 10, default: '' })
  fhrid: string;

  @Column({ type: 'varchar', length: 10, default: '' })
  shksid: string;

  @Column({ type: 'varchar', length: 10, default: '' })
  shrid: string;

  @Column({ type: 'varchar', length: 10, default: '' })
  lrrid: string;

  @Column({ type: 'smallint', default: 0 })
  ckclbz: number;

  @Column({ type: 'smallint', default: 0 })
  rkclbz: number;

  @Column({ type: 'smallint', default: 0 })
  tjbz: number;

  @Column({ type: 'decimal', precision: 16, scale: 2, nullable: true })
  pfhj: number | null;

  @Column({ type: 'varchar', length: 1, nullable: true })
  ywlx: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bz1: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  bz2: string | null;

  @Column({ type: 'varchar', length: 20, default: '' })
  zkksid: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  bz3: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  bz4: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  zyid: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  zybh: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  brxm: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  brnl: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  xbid: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cwid: string | null;

  @Column({ type: 'int', nullable: true })
  szbz: number | null;

  @OneToMany(() => H31Lymx, (lymx) => lymx.H31Lyjl)
  H31LymxList: H31Lymx[];


}
