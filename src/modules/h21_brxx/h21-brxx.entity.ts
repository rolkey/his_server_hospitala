import { AfterLoad, Column, Entity } from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';

@Entity('h21_brxx', { schema: 'dbo' })
export class h21_brxx {
  @Column('varchar', {
    primary: true,
    name: 'mzid',
  })
  mzid: string;

  @Column('varchar', { name: 'brxm', default: () => "''" })
  brxm: string;

  @Column('varchar', { name: 'xbid', default: () => "''" })
  xbid: string;

  @Column('datetime', { name: 'csrq', nullable: true })
  @DateTransformer()
  csrq: Date | null;

  @Column('varchar', { name: 'brnl' })
  brnl: string | null;

  @Column('varchar', {
    name: 'lxdz',
    nullable: true,
    default: () => "''",
  })
  lxdz: string | null;

  @Column('varchar', {
    name: 'etys',
    nullable: true,
    default: () => "''",
  })
  etys: string | null;

  @Column('varchar', {
    name: 'lxdh',
    nullable: true,
    default: () => "''",
  })
  lxdh: string | null;

  @Column('varchar', {
    name: 'ywfy',
    nullable: true,
    default: () => "''",
  })
  ywfy: string | null;

  @Column('varchar', { name: 'brlbid', default: () => "''" })
  brlbid: string;

  @Column('varchar', { name: 'brlxid', nullable: true })
  brlxid: string | null;

  @Column('varchar', {
    name: 'hyid',
    nullable: true,
    default: () => "''",
  })
  hyid: string | null;

  @Column('varchar', {
    name: 'zyid',
    nullable: true,
    default: () => "''",
  })
  zyid: string | null;

  @Column('varchar', {
    name: 'xgid',
    nullable: true,
    default: () => "''",
  })
  xgid: string | null;

  @Column('varchar', {
    name: 'qtid',
    nullable: true,
    default: () => "''",
  })
  qtid: string | null;

  @Column('varchar', {
    name: 'bz',
    nullable: true,
    default: () => "''",
  })
  bz: string | null;

  @Column('varchar', {
    name: 'yets',
    nullable: true,
    default: () => "''",
  })
  yets: string | null;

  @Column('varchar', { name: 'zz', nullable: true })
  zz: string | null;

  @Column('datetime', { name: 'jzsj', nullable: true })
  @DateTransformer()
  jzsj: Date | null;

  @Column('varchar', { name: 'lczd', nullable: true })
  lczd: string | null;

  @Column('varchar', { name: 'jjxm', nullable: true })
  jjxm: string | null;

  @Column('datetime', { name: 'fbsj', nullable: true })
  @DateTransformer()
  fbsj: Date | null;

  @Column('varchar', { name: 'tz', nullable: true })
  tz: string | null;

  @Column('varchar', { name: 'tw', nullable: true })
  tw: string | null;

  @Column('varchar', { name: 'ywlx', nullable: true })
  ywlx: string | null;

  @Column('varchar', { name: 'yyqk', nullable: true })
  yyqk: string | null;

  @Column('datetime', { name: 'bkrq', nullable: true })
  @DateTransformer()
  bkrq: Date | null;

  @Column('varchar', { name: 'ysid', nullable: true })
  ysid: string | null;

  @Column('varchar', { name: 'sfy', nullable: true })
  sfy: string | null;

  @Column('smallint', { name: 'brzt', nullable: true })
  brzt: number | null;

  @Column('varchar', { name: 'ksid', nullable: true })
  ksid: string | null;

  @Column('varchar', { name: 'cyzd2', nullable: true })
  cyzd2: string | null;

  @Column('varchar', { name: 'sfzh', nullable: true })
  sfzh: string | null;

  @Column('varchar', { name: 'sflx', nullable: true })
  sflx: string | null;

  @Column('decimal', { name: 'sfdj', nullable: true, precision: 12, scale: 2 })
  sfdj: number | null;

  @Column('varchar', { name: 'kfysid', nullable: true })
  kfysid: string | null;

  @Column('varchar', { name: 'bz1', nullable: true })
  bz1: string | null;

  @Column('varchar', { name: 'tzxx', nullable: true })
  tzxx: string | null;

  @Column('varchar', { name: 'bz2', nullable: true })
  bz2: string | null;

  @Column('varchar', { name: 'ylzh', nullable: true })
  ylzh: string | null;

  @Column('smallint', { name: 'tjbz', nullable: true })
  tjbz: number | null;

  @Column('varchar', { name: 'clxx', nullable: true })
  clxx: string | null;

  @Column('varchar', { name: 'hbh', nullable: true })
  hbh: string | null;

  @Column('varchar', { name: 'nldw1', nullable: true })
  nldw1: string | null;

  @Column('varchar', { name: 'hydm', nullable: true })
  hydm: string | null;

  @Column('varchar', { name: 'zydm', nullable: true })
  zydm: string | null;

  @Column('varchar', { name: 'mzdm', nullable: true })
  mzdm: string | null;

  @Column('varchar', { name: 'gzdw', nullable: true })
  gzdw: string | null;

  @Column('varchar', { name: 'tjzt', nullable: true })
  tjzt: string | null;

  @Column('varchar', { name: 'jyzt', nullable: true })
  jyzt: string | null;

  @Column('varchar', { name: 'smxx', nullable: true })
  smxx: string | null;

  @Column('varchar', { name: 'patient_id', nullable: true })
  patientId: string | null;

  @Column('varchar', { name: 'gxid', nullable: true })
  gxid: string | null;

  @Column('datetime', { name: 'swrq', nullable: true })
  @DateTransformer()
  swrq: Date | null;

  @Column('tinyint', { name: 'szbz', nullable: true, default: () => '(0)' })
  szbz: number | null;

  @Column('varchar', {
    name: 'sjjb',
    nullable: true,
    default: () => '(1)',
  })
  sjjb: string | null;

  @Column('varchar', {
    name: 'fyid',
    nullable: true,
    default: () => '(0)',
  })
  fyid: string | null;

  @Column('tinyint', { name: 'zxbz', nullable: true, default: () => '(0)' })
  zxbz: number | null;

  @Column('varchar', { name: 'cyzd3', nullable: true })
  cyzd3: string | null;

  @Column('varchar', { name: 'cyzd4', nullable: true })
  cyzd4: string | null;

  @Column('varchar', { name: 'cyzd5', nullable: true })
  cyzd5: string | null;

  @Column('varchar', { name: 'dbxm', nullable: true })
  dbxm: string | null;

  @Column('varchar', { name: 'dbsfzh', nullable: true })
  dbsfzh: string | null;

  @Column('varchar', { name: 'ssdq', nullable: true })
  ssdq: string | null;

  @Column('varchar', { name: 'ydbz', nullable: true })
  ydbz: string | null;

  @Column('varchar', { name: 'ryzt', nullable: true })
  ryzt: string | null;

  @Column('varchar', { name: 'rylb', nullable: true })
  rylb: string | null;

  @Column('varchar', { name: 'zhye', nullable: true })
  zhye: string | null;

  @Column('varchar', { name: 'chxx', nullable: true })
  chxx: string | null;

  @Column('varchar', {
    name: 'hshd',
    nullable: true,
    default: () => "''",
  })
  hshd: string | null;

  @Column('datetime', { name: 'hdsj', nullable: true })
  @DateTransformer()
  hdsj: Date | null;

  @Column('varchar', { name: 'tsrylb', nullable: true })
  tsrylb: string | null;

  @Column('varchar', { name: 'infection_sync', nullable: true })
  infectionSync: string | null;

  @Column('varchar', { name: 'szys', nullable: true })
  szys: string | null;

  @Column('datetime', { name: 'szsj', nullable: true })
  @DateTransformer()
  szsj: Date | null;

  // @ManyToOne(() => jbbmicd10)
  // @JoinColumn({ name: "cyzd2", referencedColumnName: "bzbm" })
  // cyzd2Entity: jbbmicd10;

  // @ManyToOne(() => usrcat)
  // @JoinColumn({ name: "kfysid", referencedColumnName: "usid" })
  // kfysidEntity: usrcat;

  // @ManyToOne(() => h00_mzzd)
  // @JoinColumn({ name: "mzdm", referencedColumnName: "mzid" })
  // mzdmEntity: h00_mzzd;

  // @ManyToOne(() => jbbmicd10)
  // @JoinColumn({ name: "cyzd3", referencedColumnName: "bzbm" })
  // cyzd3Entity: jbbmicd10;

  // @ManyToOne(() => jbbmicd10)
  // @JoinColumn({ name: "cyzd4", referencedColumnName: "bzbm" })
  // cyzd4Entity: jbbmicd10;

  // @ManyToOne(() => jbbmicd10)
  // @JoinColumn({ name: "cyzd5", referencedColumnName: "bzbm" })
  // cyzd5Entity: jbbmicd10;

  // @ManyToOne(() => jbbmicd10)
  // @JoinColumn({ name: "lczd", referencedColumnName: "bzbm" })
  // lczdEntity: jbbmicd10;

  // @ManyToOne(() => usrcat)
  // @JoinColumn({ name: "hshd", referencedColumnName: "usid" })
  // hshdEntity: usrcat;

  // @ManyToOne(() => usrcat)
  // @JoinColumn({ name: "szys", referencedColumnName: "usid" })
  // szysEntity: usrcat;

  // @ManyToOne(() => csxz)
  // @JoinColumn({ name: "bz2", referencedColumnName: "data" })
  // mjlyEntity: csxz;

  // @ManyToOne(() => h00_ghlx)
  // @JoinColumn({ name: "brlxid", referencedColumnName: "ghlxid" })
  // brlxidEntity: h00_ghlx;

  // @ManyToOne(() => h00_brlb)
  // @JoinColumn({ name: "brlbid", referencedColumnName: "brlbid" })
  // brlbidEntity: h00_brlb;

  // @ManyToOne(() => h21_ylzh)
  // @JoinColumn({ name: "ylzh", referencedColumnName: "ylzh" })
  // ylzhEntity: h21_ylzh;

  // @ManyToOne(() => ksmc)
  // @JoinColumn({ name: "ksid", referencedColumnName: "ksid" })
  // ksidEntity: ksmc;

  // @ManyToOne(() => usrcat)
  // @JoinColumn({ name: "ysid", referencedColumnName: "usid" })
  // ysidEntity: usrcat;

  // @ManyToOne(() => usrcat)
  // @JoinColumn({ name: "sfy", referencedColumnName: "usid" })
  // sfyEntity: usrcat;

  // @ManyToOne(() => h00_hyzk)
  // @JoinColumn({ name: "hydm", referencedColumnName: "hyzkid" })
  // hyzkEntity: h00_hyzk;

  // @ManyToOne(() => zy)
  // @JoinColumn({ name: "hyid", referencedColumnName: "zydmid" })
  // hyidEntity: zy;

  // @ManyToOne(() => csxz)
  // @JoinColumn({ name: "sflx", referencedColumnName: "data" })
  // sflxEntity: csxz;

  // @ManyToOne(() => csxz)
  // @JoinColumn({ name: "tsrylb", referencedColumnName: "data" })
  // tsrylbEntity: csxz;

  // @ManyToOne(() => h00_gxzd)
  // @JoinColumn({ name: "gxid", referencedColumnName: "gxid" })
  // gxidEntity: h00_gxzd;

  // @OneToMany(() => h23_mzzd, (mzzd) => mzzd.h21_brxx)
  // h23_mzzdList: h23_mzzd[];

  // @OneToMany(() => h23_mzbl, (mzbl) => mzbl.h21_brxx)
  // h23_mzblList: h23_mzbl[];

  // @OneToMany(() => h22_fpzb, (fpzb) => fpzb.mzidEntity)
  // @JoinColumn({ name: "mzid", referencedColumnName: "mzid" })
  // h22_fpzbList: h22_fpzb[];

  // @OneToMany(() => h22_jszb, (jszb) => jszb.mzidEntity)
  // @JoinColumn({ name: "mzid", referencedColumnName: "mzid" })
  // h22_jszbList: h22_jszb[];

  // @OneToMany(() => h23_cfzb, (cfzb) => cfzb.h21_brxx)
  // @JoinColumn({ name: "mzid", referencedColumnName: "mzid" })
  // h23_cfzbList: h23_cfzb[];

  @AfterLoad()
  trim() {
    if (this.ylzh) {
      this.ylzh = this.ylzh.trim();
    }
    if (this.hydm) {
      this.hydm = this.hydm.trim();
    }
    if (this.hyid) {
      this.hyid = this.hyid.trim();
    }
    if (this.jjxm) {
      this.jjxm = this.jjxm.trim();
    }
    if (this.brlbid) {
      this.brlbid = this.brlbid.trim();
    }
    if (this.zyid) {
      this.zyid = this.zyid.trim();
    }
    if (this.brxm) {
      this.brxm = this.brxm.trim();
    }
    if (this.lxdh) {
      this.lxdh = this.lxdh.trim();
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
    if (this.bz) {
      this.bz = this.bz.trim();
    }
    if (this.yets) {
      this.yets = this.yets.trim();
    }
    if (this.lxdz) {
      this.lxdz = this.lxdz.trim();
    }
    if (this.xbid) {
      this.xbid = this.xbid.trim();
    }
    if (this.qtid) {
      this.qtid = this.qtid.trim();
    }
  }
}
