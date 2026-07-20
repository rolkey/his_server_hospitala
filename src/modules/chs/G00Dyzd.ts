import { Column, Entity, Index } from 'typeorm';

@Index('PK_G00_dyzd', ['xmzl', 'xmid'], { unique: true })
@Entity('G00_dyzd', { schema: 'dbo' })
export class G00Dyzd {
  @Column('varchar', { primary: true, name: 'xmzl', length: 3 })
  xmzl: string;

  @Column('varchar', { name: 'ybid', nullable: true, length: 50 })
  ybid: string | null;

  @Column('varchar', { primary: true, name: 'xmid', length: 20 })
  xmid: string;

  @Column('varchar', { name: 'xmmc', nullable: true, length: 100 })
  xmmc: string | null;

  @Column('varchar', { name: 'jx', nullable: true, length: 100 })
  jx: string | null;

  @Column('varchar', { name: 'gg', nullable: true, length: 100 })
  gg: string | null;

  @Column('varchar', { name: 'dj', nullable: true, length: 100 })
  dj: string | null;

  @Column('varchar', { name: 'cj', nullable: true, length: 100 })
  cj: string | null;

  @Column('varchar', { name: 'czy', nullable: true, length: 10 })
  czy: string | null;

  @Column('varchar', { name: 'sj', nullable: true, length: 20 })
  sj: string | null;

  @Column('varchar', { name: 'kssj', nullable: true, length: 20 })
  kssj: string | null;

  @Column('varchar', { name: 'jssj', nullable: true, length: 20 })
  jssj: string | null;

  @Column('varchar', { name: 'jy', nullable: true, length: 50 })
  jy: string | null;

  @Column('varchar', { name: 'hy', nullable: true, length: 50 })
  hy: string | null;

  @Column('varchar', { name: 'zysj', nullable: true, length: 100 })
  zysj: string | null;

  @Column('varchar', { name: 'yjwm', nullable: true, length: 100 })
  yjwm: string | null;

  @Column('varchar', { name: 'yjmc', nullable: true, length: 100 })
  yjmc: string | null;

  @Column('varchar', { name: 'yjjx', nullable: true, length: 100 })
  yjjx: string | null;

  @Column('varchar', { name: 'yjgg', nullable: true, length: 100 })
  yjgg: string | null;

  @Column('varchar', { name: 'tm', nullable: true, length: 100 })
  tm: string | null;

  @Column('varchar', { name: 'ybmc', nullable: true, length: 100 })
  ybmc: string | null;

  @Column('varchar', { name: 'yblb', nullable: true, length: 20 })
  yblb: string | null;

  @Column('varchar', { name: 'zgdj', nullable: true, length: 20 })
  zgdj: string | null;

  @Column('varchar', { name: 'dq', nullable: true, length: 20 })
  dq: string | null;

  @Column('smallint', { name: 'szbz', nullable: true })
  szbz: number | null;

  @Column('varchar', { name: 'ypbz', nullable: true, length: 10 })
  ypbz: string | null;

  @Column('varchar', { name: 'shbz', nullable: true, length: 10 })
  shbz: string | null;

  @Column('varchar', { name: 'bzxx', nullable: true, length: 100 })
  bzxx: string | null;

  @Column('varchar', { name: 'bzxx1', nullable: true, length: 100 })
  bzxx1: string | null;

  @Column('varchar', { name: 'bzxx2', nullable: true, length: 100 })
  bzxx2: string | null;

  @Column('varchar', { name: 'ybjx', nullable: true, length: 100 })
  ybjx: string | null;

  @Column('varchar', { name: 'ybcj', nullable: true, length: 100 })
  ybcj: string | null;

  @Column('varchar', { name: 'ybdw', nullable: true, length: 100 })
  ybdw: string | null;

  @Column('varchar', { name: 'yydw', nullable: true, length: 100 })
  yydw: string | null;

  @Column('varchar', { name: 'code', nullable: true, length: 30 })
  code: string | null;

  @Column('varchar', { name: 'bzxx3', nullable: true, length: 30 })
  bzxx3: string | null;

  @Column('varchar', { name: 'bzxx4', nullable: true, length: 50 })
  bzxx4: string | null;

  @Column('varchar', { name: 'bzxx5', nullable: true, length: 60 })
  bzxx5: string | null;

  @Column('varchar', { name: 'y1', nullable: true, length: 30 })
  y1: string | null;

  @Column('varchar', { name: 'y2', nullable: true, length: 30 })
  y2: string | null;

  @Column('varchar', { name: 'y3', nullable: true, length: 30 })
  y3: string | null;

  @Column('varchar', { name: 'y4', nullable: true, length: 60 })
  y4: string | null;

  @Column('varchar', { name: 'y5', nullable: true, length: 60 })
  y5: string | null;

  @Column('varchar', { name: 'b1', nullable: true, length: 30 })
  b1: string | null;

  @Column('varchar', { name: 'b2', nullable: true, length: 30 })
  b2: string | null;

  @Column('varchar', { name: 'b3', nullable: true, length: 30 })
  b3: string | null;

  @Column('varchar', { name: 'b4', nullable: true, length: 60 })
  b4: string | null;

  @Column('varchar', { name: 'b5', nullable: true, length: 60 })
  b5: string | null;

  @Column('varchar', { name: 'gjybbm', nullable: true, length: 50 })
  gjybbm: string | null;

  @Column('varchar', { name: 'gjybid', nullable: true, length: 50 })
  gjybid: string | null;

  @Column('varchar', { name: 'gjybmc', nullable: true, length: 100 })
  gjybmc: string | null;

  @Column('varchar', { name: 'ybbak', nullable: true, length: 50 })
  ybbak: string | null;

  @Column('varchar', { name: 'ybid_old', nullable: true, length: 50 })
  ybidOld: string | null;
}
