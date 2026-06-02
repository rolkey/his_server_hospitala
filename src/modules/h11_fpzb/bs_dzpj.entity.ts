import { Entity, Column, Index } from 'typeorm';

@Index('PK_BS_DZPJ', ['jlxh'], { unique: true })
@Entity('bs_dzpj', { schema: 'dbo' })
export class bs_dzpj {
  @Column('decimal', { primary: true, name: 'jlxh', precision: 18, scale: 0 })
  jlxh: number;

  @Column('varchar', { name: 'pjdm', nullable: true, length: 100 })
  pjdm: string | null;

  @Column('varchar', { name: 'pjhm', nullable: true, length: 100 })
  pjhm: string | null;

  @Column('varchar', {
    name: 'jym',
    nullable: true,
    length: 100,
    default: () => 'NULL',
  })
  jym: string | null;

  @Column('varchar', {
    name: 'scsj',
    nullable: true,
    length: 100,
    default: () => 'NULL',
  })
  scsj: string | null;

  @Column('varchar', {
    name: 'ewm',
    nullable: true,
    length: 4000,
    default: () => 'NULL',
  })
  ewm: string | null;

  @Column('varchar', {
    name: 'nurl',
    nullable: true,
    length: 4000,
    default: () => 'NULL',
  })
  nurl: string | null;

  @Column('varchar', { name: 'wurl', nullable: true, length: 4000 })
  wurl: string | null;

  @Column('decimal', { name: 'jzhm', nullable: true, precision: 18, scale: 0 })
  jzhm: number | null;

  @Column('decimal', {
    name: 'zfpb',
    precision: 1,
    scale: 0,
    default: () => '(0)',
  })
  zfpb: number;

  @Column('decimal', { name: 'mzzy', nullable: true, precision: 1, scale: 0 })
  mzzy: number | null;

  @Column('varchar', { name: 'brid', nullable: true, length: 100 })
  brid: string | null;

  @Column('datetime', { name: 'czsj', nullable: true })
  czsj: Date | null;

  @Column('varchar', { name: 'brxm', nullable: true, length: 30 })
  brxm: string | null;

  @Column('varchar', { name: 'mzzybh', nullable: true, length: 30 })
  mzzybh: string | null;

  @Column('varchar', { name: 'zfry', nullable: true, length: 30 })
  zfry: string | null;

  @Column('datetime', { name: 'zfrq', nullable: true })
  zfrq: Date | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 30 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 30 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 30 })
  bz3: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 30 })
  bz4: string | null;

  @Column('varchar', { name: 'bz5', nullable: true, length: 30 })
  bz5: string | null;

  @Column('varchar', { name: 'wxCardUrl', nullable: true, length: 250 })
  wxCardUrl: string | null;
}
