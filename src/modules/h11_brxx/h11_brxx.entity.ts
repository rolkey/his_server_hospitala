import { DateTransformer } from '@/common/transformers/date.transformer';
import { AfterLoad, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { usrcat } from '../usrcat/usrcat.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { h00_brlx } from '../h00_brlx/h00_brlx.entity';
import { csxz } from '../csxz/csxz.entity';
import { h00_rybq } from '../h00_rybq/h00_rybq.entity';
import { Jbbmicd10 } from '../jbbmicd/jbbmicd10.entity';
import dayjs = require('dayjs');

@Entity('h11_brxx', { schema: 'dbo' })
export class h11_brxx {
  @Column('varchar', { primary: true, name: 'zyid', length: 12 })
  zyid: string;

  @Column('varchar', { name: 'zybh', nullable: true, length: 12 })
  zybh: string | null;

  @Column('varchar', { name: 'mzbh', nullable: true, length: 12 })
  mzbh: string | null;

  @Column('int', { name: 'zycs', nullable: true })
  zycs: number | null;

  @Column('varchar', { name: 'brlxid', nullable: true, length: 10 })
  brlxid: string | null;

  @ManyToOne(() => h00_brlx)
  @JoinColumn({ name: 'brlxid', referencedColumnName: 'brlxid' })
  brlxidEntity: h00_brlx;

  @Column('varchar', { name: 'gfbh', nullable: true, length: 10 })
  gfbh: string | null;

  @Column('varchar', { name: 'brxm', nullable: true, length: 30 })
  brxm: string | null;

  @Column('varchar', { name: 'xbid', nullable: true, length: 10 })
  xbid: string | null;

  @Column('varchar', { name: 'brnl', nullable: true, length: 10 })
  brnl: string | null;

  @Column('datetime', { name: 'csrq', nullable: true })
  @DateTransformer()
  csrq: Date | null;

  @Column('smallint', { name: 'yebz', nullable: true })
  yebz: number | null;

  @Column('varchar', { name: 'hyzkmc', nullable: true, length: 30 })
  hyzkmc: string | null;

  @Column('varchar', { name: 'hyid', nullable: true, length: 10 })
  hyid: string | null;

  @Column('varchar', { name: 'csddmc', nullable: true, length: 100 })
  csddmc: string | null;

  @Column('varchar', { name: 'mzmc', nullable: true, length: 10 })
  mzmc: string | null;

  @Column('varchar', { name: 'gjid', nullable: true, length: 10 })
  gjid: string | null;

  @Column('varchar', { name: 'sfzh', nullable: true, length: 20 })
  sfzh: string | null;

  @Column('varchar', { name: 'gzdw', nullable: true, length: 60 })
  gzdw: string | null;

  @Column('varchar', { name: 'dwdh', nullable: true, length: 20 })
  dwdh: string | null;

  @Column('varchar', { name: 'dwyb', nullable: true, length: 10 })
  dwyb: string | null;

  @Column('varchar', { name: 'hkdz', nullable: true, length: 100 })
  hkdz: string | null;

  @Column('varchar', { name: 'hkyb', nullable: true, length: 10 })
  hkyb: string | null;

  @Column('varchar', { name: 'lxrm', nullable: true, length: 30 })
  lxrm: string | null;

  @Column('varchar', { name: 'gxid', nullable: true, length: 10 })
  gxid: string | null;

  @Column('varchar', { name: 'lxdz', nullable: true, length: 40 })
  lxdz: string | null;

  @Column('varchar', { name: 'lxdh', nullable: true, length: 30 })
  lxdh: string | null;

  @Column('varchar', { name: 'ryksid', nullable: true, length: 10 })
  ryksid: string | null;

  @Column('varchar', { name: 'ryksmc', nullable: true, length: 30 })
  ryksmc: string | null;

  @Column('varchar', { name: 'rybs', nullable: true, length: 10 })
  rybs: string | null;

  @Column('varchar', { name: 'rycw', nullable: true, length: 10 })
  rycw: string | null;

  @ManyToOne(() => h00_cwxx)
  @JoinColumn({ name: 'rycw', referencedColumnName: 'cwid' })
  rycwEntity: h00_cwxx;

  @Column('datetime', { name: 'rysj', nullable: true })
  @DateTransformer()
  rysj: Date | null;

  @Column('varchar', { name: 'rybqid', nullable: true, length: 10 })
  rybqid: string | null;

  @ManyToOne(() => h00_rybq)
  @JoinColumn({ name: 'rybqid', referencedColumnName: 'rybqid' })
  rybqidEntity: h00_rybq;

  @Column('varchar', { name: 'zkbqid', nullable: true, length: 10 })
  zkbqid: string | null;

  @ManyToOne(() => h00_rybq)
  @JoinColumn({ name: 'zkbqid', referencedColumnName: 'rybqid' })
  zkbqidEntity: h00_rybq;

  @Column('varchar', { name: 'cyksid', nullable: true, length: 10 })
  cyksid: string | null;

  @Column('varchar', { name: 'cyksmc', nullable: true, length: 30 })
  cyksmc: string | null;

  @Column('varchar', { name: 'cybs', nullable: true, length: 10 })
  cybs: string | null;

  @Column('varchar', { name: 'cycw', nullable: true, length: 10 })
  cycw: string | null;

  @ManyToOne(() => h00_cwxx)
  @JoinColumn({ name: 'cycw', referencedColumnName: 'cwid' })
  cycwEntity: h00_cwxx;

  @Column('datetime', { name: 'cysj', nullable: true })
  @DateTransformer()
  cysj: Date | null;

  @Column('int', { name: 'zyts', nullable: true })
  zyts: number | null;

  @Column('varchar', { name: 'mzzd', nullable: true, length: 120 })
  mzzd: string | null;

  @Column('varchar', { name: 'ryzd', nullable: true, length: 120 })
  ryzd: string | null;

  @ManyToOne(() => Jbbmicd10)
  @JoinColumn({ name: 'ryzd', referencedColumnName: 'icd11' })
  ryzdEntity: Jbbmicd10;

  @Column('datetime', { name: 'ryqzsj', nullable: true })
  @DateTransformer()
  ryqzsj: Date | null;

  @Column('smallint', { name: 'zyzt', nullable: true })
  zyzt: number | null;

  @Column('smallint', { name: 'yzxs', nullable: true })
  yzxs: number | null;

  @Column('smallint', { name: 'yzzj', nullable: true })
  yzzj: number | null;

  @Column('decimal', { name: 'qfje', nullable: true, precision: 16, scale: 4 })
  qfje: number | null;

  @Column('decimal', { name: 'fdje', nullable: true, precision: 16, scale: 4 })
  fdje: number | null;

  @Column('smallint', { name: 'etys', nullable: true })
  etys: number | null;

  @Column('varchar', { name: 'mzys', nullable: true, length: 12 })
  mzys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'mzys', referencedColumnName: 'usid' })
  mzysEntity: usrcat;

  @Column('smallint', { name: 'hlzt', nullable: true })
  hlzt: number | null;

  @Column('decimal', { name: 'cwbz', nullable: true, precision: 6, scale: 2 })
  cwbz: number | null;

  @Column('varchar', { name: 'qfjsbz', nullable: true, length: 12 })
  qfjsbz: string | null;

  @Column('decimal', {
    name: 'qfjsje1',
    nullable: true,
    precision: 2,
    scale: 0,
  })
  qfjsje1: number | null;

  @Column('decimal', {
    name: 'qfjsje',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  qfjsje: number | null;

  @Column('datetime', { name: 'jssj', nullable: true })
  @DateTransformer()
  jssj: Date | null;

  @Column('varchar', { name: 'lsh', nullable: true, length: 15 })
  lsh: string | null;

  @Column('varchar', { name: 'cyzd', nullable: true, length: 60 })
  cyzd: string | null;

  @ManyToOne(() => Jbbmicd10)
  @JoinColumn({ name: 'cyzd', referencedColumnName: 'icd11' })
  cyzdEntity: Jbbmicd10;

  @Column('varchar', { name: 'hbh', nullable: true, length: 20 })
  hbh: string | null;

  @Column('varchar', { name: 'cyzd1', nullable: true, length: 50 })
  cyzd1: string | null;

  @Column('varchar', { name: 'lsh1', nullable: true, length: 20 })
  lsh1: string | null;

  @Column('varchar', { name: 'jsdh', nullable: true, length: 20 })
  jsdh: string | null;

  @Column('varchar', { name: 'cyzd2', nullable: true, length: 50 })
  cyzd2: string | null;

  @Column('varchar', { name: 'bahm', nullable: true, length: 50 })
  bahm: string | null;

  @Column('varchar', { name: 'sfdm', nullable: true, length: 20 })
  sfdm: string | null;

  @Column('varchar', { name: 'nldw', nullable: true, length: 4 })
  nldw: string | null;

  @Column('varchar', { name: 'jtdh', nullable: true, length: 16 })
  jtdh: string | null;

  @Column('varchar', { name: 'ryff', nullable: true, length: 2 })
  ryff: string | null;

  @Column('varchar', { name: 'etcstz', nullable: true, length: 4 })
  etcstz: string | null;

  @Column('varchar', { name: 'etrytz', nullable: true, length: 4 })
  etrytz: string | null;

  @Column('varchar', { name: 'zkksid', nullable: true, length: 6 })
  zkksid: string | null;

  @ManyToOne(() => ksmc)
  @JoinColumn({ name: 'zkksid', referencedColumnName: 'ksid' })
  zkksidEntity: ksmc;

  @Column('varchar', { name: 'bz1', nullable: true, length: 60 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 10 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 10 })
  bz3: string | null;

  @Column('varchar', { name: 'jgdm', nullable: true, length: 20 })
  jgdm: string | null;

  @Column('varchar', { name: 'hljl', nullable: true, length: 2 })
  hljl: string | null;

  @Column('varchar', { name: 'ysdm', nullable: true, length: 5 })
  ysdm: string | null;

  @Column('varchar', { name: 'nldw1', nullable: true, length: 4 })
  nldw1: string | null;

  @Column('varchar', { name: 'czry', nullable: true, length: 8 })
  czry: string | null;

  @Column('varchar', { name: 'hkyb1', nullable: true, length: 8 })
  hkyb1: string | null;

  @Column('varchar', { name: 'bzxx', nullable: true, length: 40 })
  bzxx: string | null;

  @Column('varchar', { name: 'dbry', nullable: true, length: 20 })
  dbry: string | null;

  @Column('varchar', { name: 'dbdh', nullable: true, length: 15 })
  dbdh: string | null;

  @Column('varchar', { name: 'mmlsh', nullable: true, length: 15 })
  mmlsh: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 10 })
  bz4: string | null;

  @Column('varchar', { name: 'patient_id', nullable: true, length: 20 })
  patientId: string | null;

  @Column('varchar', { name: 'swrq', nullable: true, length: 20 })
  swrq: string | null;

  @Column('tinyint', { name: 'szbz', nullable: true, default: () => '(0)' })
  szbz: number | null;

  @Column('varchar', { name: 'sjdm', nullable: true, length: 20 })
  sjdm: string | null;

  @Column('varchar', { name: 'xjdm', nullable: true, length: 20 })
  xjdm: string | null;

  @Column('varchar', { name: 'ylzh', nullable: true, length: 15 })
  ylzh: string | null;

  @Column('varchar', { name: 'cyzd3', nullable: true, length: 20 })
  cyzd3: string | null;

  @Column('varchar', { name: 'cyzd4', nullable: true, length: 20 })
  cyzd4: string | null;

  @Column('varchar', { name: 'cyzd5', nullable: true, length: 20 })
  cyzd5: string | null;

  @Column('varchar', { name: 'jsry', nullable: true, length: 6 })
  jsry: string | null;

  @Column('varchar', { name: 'GG1', nullable: true, length: 12 })
  GG1: string | null;

  @Column('varchar', { name: 'GG2', nullable: true, length: 12 })
  GG2: string | null;

  @Column('varchar', { name: 'GG3', nullable: true, length: 12 })
  GG3: string | null;

  @Column('varchar', { name: 'XZZ1', nullable: true, length: 12 })
  XZZ1: string | null;

  @Column('varchar', { name: 'XZZ2', nullable: true, length: 12 })
  XZZ2: string | null;

  @Column('varchar', { name: 'XZZ3', nullable: true, length: 12 })
  XZZ3: string | null;

  @Column('varchar', { name: 'XZZ4', nullable: true, length: 12 })
  XZZ4: string | null;

  @Column('varchar', { name: 'XZZ5', nullable: true, length: 60 })
  XZZ5: string | null;

  @Column('varchar', { name: 'HKDZ1', nullable: true, length: 12 })
  HKDZ1: string | null;

  @Column('varchar', { name: 'HKDZ2', nullable: true, length: 12 })
  HKDZ2: string | null;

  @Column('varchar', { name: 'HKDZ3', nullable: true, length: 12 })
  HKDZ3: string | null;

  @Column('varchar', { name: 'HKDZ4', nullable: true, length: 12 })
  HKDZ4: string | null;

  @Column('varchar', { name: 'HKDZ5', nullable: true, length: 60 })
  HKDZ5: string | null;

  @Column('varchar', { name: 'ryzd1', nullable: true, length: 80 })
  ryzd1: string | null;

  @Column('varchar', { name: 'yish', nullable: true, length: 4 })
  yish: string | null;

  @ManyToOne(() => csxz)
  @JoinColumn({ name: 'yish', referencedColumnName: 'data' })
  yishEntity: csxz;

  @ManyToOne(() => csxz)
  @JoinColumn({ name: 'bz4', referencedColumnName: 'data' })
  bz4Entity: csxz;

  @Column('varchar', { name: 'zrhs', nullable: true, length: 10 })
  zrhs: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'zrhs', referencedColumnName: 'usid' })
  zrhsEntity: usrcat;

  @Column('varchar', { name: 'qt1', nullable: true, length: 30 })
  qt1: string | null;

  @Column('varchar', { name: 'qt2', nullable: true, length: 20 })
  qt2: string | null;

  @Column('varchar', {
    name: 'sflx',
    nullable: true,
    length: 2,
    default: () => "'01'",
  })
  sflx: string | null;

  @Column('varchar', { name: 'sxys', nullable: true, length: 10 })
  sxys: string | null;

  @ManyToOne(() => usrcat)
  @JoinColumn({ name: 'sxys', referencedColumnName: 'usid' })
  sxysEntity: usrcat;

  @Column('varchar', { name: 'dqbm', nullable: true, length: 6 })
  dqbm: string | null;

  @Column('varchar', { name: 'infection_sync', nullable: true, length: 10 })
  infectionSync: string | null;

  hljlmc: string | null;

  fyhj: number;

  yjk: number;

  zyts1: number;

  isexecute: number;

  isnew: number;

  istoday: number;

  ztbz: number;

  zyztmc: string | null;

  @AfterLoad()
  trim() {
    if (this.ylzh) {
      this.ylzh = this.ylzh.trim();
    }
    if (this.brxm) {
      this.brxm = this.brxm.trim();
    }
    if (this.mzzd) {
      this.mzzd = this.mzzd.trim();
    }
    if (this.ryksid) {
      this.ryksid = this.ryksid.trim();
    }
    if (this.ryksmc) {
      this.ryksmc = this.ryksmc.trim();
    }
    if (this.ryzd) {
      this.ryzd = this.ryzd.trim();
    }
    if (this.gxid) {
      this.gxid = this.gxid.trim();
    }
    if (this.xbid) {
      this.xbid = this.xbid.trim();
    }
    if (this.brnl) {
      this.brnl = this.brnl.trim();
    }
    if (this.zybh) {
      this.zybh = this.zybh.trim();
    }
    if (this.nldw) {
      this.nldw = this.nldw.trim();
    }

    if (this.gjid) {
      this.gjid = this.gjid.trim();
    }

    this.zyts = this.cysj
      ? dayjs(this.cysj).diff(this.rysj, 'day')
      : dayjs(new Date()).diff(this.rysj, 'day');

    if (this.hljl) {
      this.hljl = this.hljl.trim();
      switch (this.hljl) {
        case '1':
          this.hljlmc = '一级护理';
          break;
        case '2':
          this.hljlmc = '二级护理';
          break;
        case '3':
          this.hljlmc = '三级护理';
          break;
        case '4':
          this.hljlmc = '特级护理';
          break;
        case '5':
          this.hljlmc = '儿科护理';
          break;
        case '6':
          this.hljlmc = '精神病护理';
          break;
        default:
          this.hljlmc = '';
      }
    }

    if (this.zyzt) {
      switch (this.zyzt) {
        case 0:
          this.zyztmc = '在院';
          break;
        case 1:
          this.zyztmc = '在院';
          break;
        case 2:
          this.zyztmc = '在院';
          break;
        case 3:
          this.zyztmc = '待办';
          break;
        case 4:
          this.zyztmc = '出院';
          break;
        default:
          this.zyztmc = '';
      }
    }
  }
}
