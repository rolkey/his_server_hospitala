import { AfterLoad, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { h12_yzxb } from './h12_yzxb.entity';
import { DateTransformer } from '@/common/transformers/date.transformer';
import { ksmc } from '../ksmc/ksmc.entity';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { usrcat } from '../usrcat/usrcat.entity';

@Index('h12_yzzb_ksid', ['zyid', 'ksid'], {})
@Index('h12_yzzb_x', ['zyid', 'yzlx', 'yzxh'], { unique: true })
@Index('h12_YZZB_ZYID', ['zyid'], {})
@Entity('h12_yzzb', { schema: 'dbo' })
export class h12_yzzb {
  @Column('varchar', { primary: true, name: 'zyid', length: 12 })
  zyid: string;

  @Column('int', { primary: true, name: 'yzxh' })
  yzxh: number;

  @Column('smallint', { primary: true, name: 'yzlx' })
  yzlx: number;

  @Column('varchar', { name: 'zybh', nullable: true, length: 12 })
  zybh: string | null;

  @Column('int', { name: 'zycs', nullable: true })
  zycs: number | null;

  @Column('varchar', { name: 'brxm', nullable: true, length: 30 })
  brxm: string | null;

  @Column('varchar', { name: 'ksid', nullable: true, length: 10 })
  ksid: string | null;

  @ManyToOne(() => ksmc)
  @JoinColumn({ name: 'ksid', referencedColumnName: 'ksid' })
  ksidEntity: ksmc;

  @Column('varchar', { name: 'brnl', nullable: true, length: 10 })
  brnl: string | null;

  @Column('varchar', { name: 'bsid', nullable: true, length: 10 })
  bsid: string | null;

  @Column('varchar', { name: 'cwid', nullable: true, length: 10 })
  cwid: string | null;

  @ManyToOne(() => h00_cwxx)
  @JoinColumn({ name: 'cwid', referencedColumnName: 'cwid' })
  cwidEntity: h00_cwxx;

  @Column('smallint', { name: 'yzsm', nullable: true })
  yzsm: number | null;

  @Column('datetime', { name: 'yzrq', nullable: true })
  @DateTransformer()
  yzrq: Date | null;

  @Column('smallint', { name: 'jsbz', nullable: true })
  jsbz: number | null;

  @Column('decimal', { name: 'bqfr', nullable: true, precision: 16, scale: 4 })
  bqfr: number | null;

  @Column('smallint', { name: 'tzbz', nullable: true })
  tzbz: number | null;

  @Column('datetime', { name: 'tzsj', nullable: true })
  @DateTransformer()
  tzsj: Date | null;

  @Column('varchar', { name: 'tzrid', nullable: true, length: 10 })
  tzrid: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'tzrid', referencedColumnName: 'usid' })
  tzridEntity: usrcat;

  @Column('int', { name: 'etys', nullable: true })
  etys: number | null;

  @Column('varchar', { name: 'kbid', nullable: true, length: 10 })
  kbid: string | null;

  @Column('varchar', { name: 'yxbz', nullable: true, length: 10 })
  yxbz: string | null;

  @Column('varchar', { name: 'zkksid', nullable: true, length: 10 })
  zkksid: string | null;

  @ManyToOne(() => ksmc)
  @JoinColumn({ name: 'zkksid', referencedColumnName: 'ksid' })
  zkksidEntity: ksmc;

  @Column('varchar', { name: 'brlx', nullable: true, length: 20 })
  brlx: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 10 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 60 })
  bz2: string | null;

  @OneToMany(() => h12_yzxb, (ybxb) => ybxb.h12_yzzb)
  h12_yzxbList: h12_yzxb[];

  tzbzmc: string;

  yzlxmc: string;

  @AfterLoad()
  trim() {
    if (this.brxm) {
      this.brxm = this.brxm.trim();
    }
    if (this.tzbz == 0) {
      this.tzbzmc = '正常';
    }
    if (this.tzbz == 1) {
      this.tzbzmc = '已停嘱';
    }

    if (this.yzlx == 1) {
      this.yzlxmc = '长期医嘱';
    }
    if (this.yzlx == 2) {
      this.yzlxmc = '临时医嘱';
    }
    if (this.yzlx == 7) {
      this.yzlxmc = '特殊医嘱';
    }
  }
}
