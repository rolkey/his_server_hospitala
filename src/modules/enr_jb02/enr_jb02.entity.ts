import { Column, Entity } from 'typeorm';

/** 交接班明细表 ENR_JB02 */
@Entity('ENR_JB02', { schema: 'dbo' })
export class enr_jb02 {
  @Column('decimal', { primary: true, name: 'JLXH', precision: 18, scale: 0 })
  jlxh: string;

  @Column('decimal', { name: 'JBXH', nullable: true, precision: 18, scale: 0 })
  jbxh: string | null;

  @Column('varchar', { name: 'ZYH', nullable: true, length: 20 })
  zyh: string | null;

  @Column('varchar', { name: 'BRCH', nullable: true, length: 20 })
  brch: string | null;

  @Column('varchar', { name: 'BRLX', nullable: true, length: 20 })
  brlx: string | null;

  @Column('varchar', { name: 'JBQK', nullable: true, length: 50 })
  jbqk: string | null;

  @Column('varchar', { name: 'QKMS', nullable: true, length: 255 })
  qkms: string | null;

  @Column('varchar', { name: 'BRZD', nullable: true, length: 100 })
  brzd: string | null;

  @Column('varchar', { name: 'brxb', nullable: true, length: 10 })
  brxb: string | null;

  @Column('varchar', { name: 'brxm', nullable: true, length: 10 })
  brxm: string | null;

  @Column('datetime', { name: 'csny', nullable: true })
  csny: Date | null;

  @Column('text', { name: 'jbjl', nullable: true })
  jbjl: string | null;

  @Column('text', { name: 'jbjl1', nullable: true })
  jbjl1: string | null;

  @Column('text', { name: 'jbjl2', nullable: true })
  jbjl2: string | null;

  @Column('varchar', { name: 'jbry1', nullable: true, length: 10 })
  jbry1: string | null;

  @Column('varchar', { name: 'jbry2', nullable: true, length: 10 })
  jbry2: string | null;

  @Column('varbinary', { name: 'jbry3', nullable: true, length: 50 })
  jbry3: Buffer | null;

  @Column('smallint', { name: 'shbz1', nullable: true })
  shbz1: number | null;

  @Column('smallint', { name: 'shbz2', nullable: true })
  shbz2: number | null;

  @Column('smallint', { name: 'shbz3', nullable: true })
  shbz3: number | null;

  @Column('datetime', { name: 'shsj1', nullable: true })
  shsj1: Date | null;

  @Column('datetime', { name: 'shsj2', nullable: true })
  shsj2: Date | null;

  @Column('datetime', { name: 'shsj3', nullable: true })
  shsj3: Date | null;

  @Column('smallint', { name: 'brzt1', nullable: true })
  brzt1: number | null;

  @Column('smallint', { name: 'brzt2', nullable: true })
  brzt2: number | null;

  @Column('smallint', { name: 'brzt3', nullable: true })
  brzt3: number | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 20 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 20 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 20 })
  bz3: string | null;
}
