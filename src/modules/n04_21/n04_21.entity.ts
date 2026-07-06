import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'N04_21', schema: 'dbo' })
export class N0421 {
  @PrimaryColumn({ name: 'zyid', type: 'varchar', length: 12, nullable: false })
  zyid: string;

  @Column({ name: 'zybh', type: 'varchar', length: 10, nullable: true })
  zybh: string;

  @Column({ name: 'USERCODE', type: 'varchar', length: 20, nullable: true })
  usercode: string;

  @Column({ name: 'USERNAME', type: 'varchar', length: 60, nullable: true })
  username: string;

  @Column({ name: 'YLFKFS', type: 'varchar', length: 10, nullable: true })
  ylfkfs: string;

  @Column({ name: 'JKKH', type: 'varchar', length: 20, nullable: true })
  jkkh: string;

  @Column({ name: 'ZYCS', type: 'decimal', precision: 3, scale: 0, nullable: true })
  zycs: number;

  @Column({ name: 'BAH', type: 'varchar', length: 20, nullable: true })
  bah: string;

  @Column({ name: 'XM', type: 'varchar', length: 30, nullable: true })
  xm: string;

  @Column({ name: 'XB', type: 'varchar', length: 10, nullable: true })
  xb: string;

  @Column({ name: 'CSRQ', type: 'datetime', nullable: true })
  csrq: Date;

  @Column({ name: 'NL', type: 'decimal', precision: 4, scale: 0, nullable: true })
  nl: number;

  @Column({ name: 'GJ', type: 'varchar', length: 20, nullable: true })
  gj: string;

  @Column({ name: 'BZYZS_NL', type: 'int', nullable: true })
  bzyzs_nl: number;

  @Column({ name: 'XSETZ', type: 'decimal', precision: 12, scale: 2, nullable: true })
  xsetz: number;

  @Column({ name: 'XSERYTZ', type: 'decimal', precision: 12, scale: 2, nullable: true })
  xserytz: number;

  @Column({ name: 'CSD1', type: 'varchar', length: 20, nullable: true })
  csd1: string;

  @Column({ name: 'CSD2', type: 'varchar', length: 12, nullable: true })
  csd2: string;

  @Column({ name: 'CSD3', type: 'varchar', length: 60, nullable: true })
  csd3: string;

  @Column({ name: 'GG1', type: 'varchar', length: 20, nullable: true })
  gg1: string;

  @Column({ name: 'GG2', type: 'varchar', length: 12, nullable: true })
  gg2: string;

  @Column({ name: 'GG3', type: 'varchar', length: 60, nullable: true })
  gg3: string;

  @Column({ name: 'MZ', type: 'varchar', length: 10, nullable: true })
  mz: string;

  @Column({ name: 'SFZH', type: 'varchar', length: 20, nullable: true })
  sfzh: string;

  @Column({ name: 'ZY', type: 'varchar', length: 20, nullable: true })
  zy: string;

  @Column({ name: 'HY', type: 'varchar', length: 10, nullable: true })
  hy: string;

  @Column({ name: 'XZZ1', type: 'varchar', length: 20, nullable: true })
  xzz1: string;

  @Column({ name: 'XZZ2', type: 'varchar', length: 12, nullable: true })
  xzz2: string;

  @Column({ name: 'XZZ3', type: 'varchar', length: 60, nullable: true })
  xzz3: string;

  @Column({ name: 'DH', type: 'varchar', length: 20, nullable: true })
  dh: string;

  @Column({ name: 'YB1', type: 'varchar', length: 10, nullable: true })
  yb1: string;

  @Column({ name: 'HKDZ1', type: 'varchar', length: 20, nullable: true })
  hkdz1: string;

  @Column({ name: 'HKDZ2', type: 'varchar', length: 12, nullable: true })
  hkdz2: string;

  @Column({ name: 'HKDZ3', type: 'varchar', length: 60, nullable: true })
  hkdz3: string;

  @Column({ name: 'YB2', type: 'varchar', length: 10, nullable: true })
  yb2: string;

  @Column({ name: 'GZDWJDZ', type: 'varchar', length: 50, nullable: true })
  gzdwjdz: string;

  @Column({ name: 'DWDH', type: 'varchar', length: 20, nullable: true })
  dwdh: string;

  @Column({ name: 'YB3', type: 'varchar', length: 10, nullable: true })
  yb3: string;

  @Column({ name: 'LXRXM', type: 'varchar', length: 10, nullable: true })
  lxrxm: string;

  @Column({ name: 'GX', type: 'varchar', length: 20, nullable: true })
  gx: string;

  @Column({ name: 'DZ', type: 'varchar', length: 80, nullable: true })
  dz: string;

  @Column({ name: 'DH1', type: 'varchar', length: 20, nullable: true })
  dh1: string;

  @Column({ name: 'RYTJ', type: 'varchar', length: 10, nullable: true })
  rytj: string;

  @Column({ name: 'ZLLB', type: 'varchar', length: 10, nullable: true })
  zllb: string;

  @Column({ name: 'RYSJ', type: 'datetime', nullable: true })
  rysj: Date;

  @Column({ name: 'RYSJ_S', type: 'decimal', precision: 38, scale: 0, nullable: true })
  rysj_s: number;

  @Column({ name: 'RYKB', type: 'varchar', length: 20, nullable: true })
  rykb: string;

  @Column({ name: 'RYBF', type: 'varchar', length: 20, nullable: true })
  rybf: string;

  @Column({ name: 'ZKKB', type: 'varchar', length: 20, nullable: true })
  zkkb: string;

  @Column({ name: 'CYSJ', type: 'datetime', nullable: true })
  cysj: Date;

  @Column({ name: 'CYSJ_S', type: 'decimal', precision: 38, scale: 0, nullable: true })
  cysj_s: number;

  @Column({ name: 'CYKB', type: 'varchar', length: 20, nullable: true })
  cykb: string;

  @Column({ name: 'CYBF', type: 'varchar', length: 20, nullable: true })
  cybf: string;

  @Column({ name: 'SJZY', type: 'nvarchar', length: 10, nullable: true })
  sjzy: string;

  @Column({ name: 'MZD_ZYZD', type: 'varchar', length: 60, nullable: true })
  mzd_zyzd: string;

  @Column({ name: 'JBDM', type: 'varchar', length: 30, nullable: true })
  jbdm: string;

  @Column({ name: 'MZZD_XYZD', type: 'varchar', length: 60, nullable: true })
  mzzd_xyzd: string;

  @Column({ name: 'JBBM', type: 'varchar', length: 30, nullable: true })
  jbbm: string;

  @Column({ name: 'SSLCLJ', type: 'varchar', length: 10, nullable: true })
  sslclj: string;

  @Column({ name: 'ZYYJ', type: 'varchar', length: 10, nullable: true })
  zyyj: string;

  @Column({ name: 'ZYZLSB', type: 'varchar', length: 10, nullable: true })
  zyzlsb: string;

  @Column({ name: 'ZYZLJS', type: 'varchar', length: 10, nullable: true })
  zyzljs: string;

  @Column({ name: 'BZSH', type: 'varchar', length: 10, nullable: true })
  bzsh: string;

  @Column({ name: 'WBYY', type: 'varchar', length: 60, nullable: true })
  wbyy: string;

  @Column({ name: 'JBBM1', type: 'varchar', length: 30, nullable: true })
  jbbm1: string;

  @Column({ name: 'BLZD', type: 'varchar', length: 60, nullable: true })
  blzd: string;

  @Column({ name: 'JBBM2', type: 'varchar', length: 30, nullable: true })
  jbbm2: string;

  @Column({ name: 'BLH', type: 'varchar', length: 30, nullable: true })
  blh: string;

  @Column({ name: 'YWGM', type: 'varchar', length: 10, nullable: true })
  ywgm: string;

  @Column({ name: 'GMYW', type: 'varchar', length: 60, nullable: true })
  gmyw: string;

  @Column({ name: 'SJ', type: 'varchar', length: 10, nullable: true })
  sj: string;

  @Column({ name: 'XX', type: 'varchar', length: 10, nullable: true })
  xx: string;

  @Column({ name: 'RH', type: 'varchar', length: 10, nullable: true })
  rh: string;

  @Column({ name: 'KZR', type: 'varchar', length: 10, nullable: true })
  kzr: string;

  @Column({ name: 'ZRYS', type: 'varchar', length: 10, nullable: true })
  zrys: string;

  @Column({ name: 'ZZYS', type: 'varchar', length: 10, nullable: true })
  zzys: string;

  @Column({ name: 'ZYYS', type: 'varchar', length: 10, nullable: true })
  zyys: string;

  @Column({ name: 'ZRHS', type: 'varchar', length: 10, nullable: true })
  zrhs: string;

  @Column({ name: 'JXYS', type: 'varchar', length: 10, nullable: true })
  jxys: string;

  @Column({ name: 'SXYS', type: 'varchar', length: 10, nullable: true })
  sxys: string;

  @Column({ name: 'BMY', type: 'varchar', length: 10, nullable: true })
  bmy: string;

  @Column({ name: 'BAZL', type: 'varchar', length: 10, nullable: true })
  bazl: string;

  @Column({ name: 'ZKYS', type: 'varchar', length: 10, nullable: true })
  zkys: string;

  @Column({ name: 'ZKHS', type: 'varchar', length: 10, nullable: true })
  zkhs: string;

  @Column({ name: 'ZKRQ', type: 'datetime', nullable: true })
  zkrq: Date;

  @Column({ name: 'LYFS', type: 'varchar', length: 10, nullable: true })
  lyfs: string;

  @Column({ name: 'YZZY_JGMC', type: 'varchar', length: 60, nullable: true })
  yzzy_jgmc: string;

  @Column({ name: 'WSY_JGMC', type: 'varchar', length: 60, nullable: true })
  wsy_jgmc: string;

  @Column({ name: 'ZZYJH', type: 'varchar', length: 10, nullable: true })
  zzyjh: string;

  @Column({ name: 'MD', type: 'varchar', length: 60, nullable: true })
  md: string;

  @Column({ name: 'RYQ_T', type: 'decimal', precision: 12, scale: 0, nullable: true })
  ryq_t: number;

  @Column({ name: 'RYQ_XS', type: 'decimal', precision: 24, scale: 0, nullable: true })
  ryq_xs: number;

  @Column({ name: 'RYQ_FZ', type: 'decimal', precision: 12, scale: 0, nullable: true })
  ryq_fz: number;

  @Column({ name: 'RYH_T', type: 'decimal', precision: 12, scale: 0, nullable: true })
  ryh_t: number;

  @Column({ name: 'RYH_XS', type: 'decimal', precision: 24, scale: 0, nullable: true })
  ryh_xs: number;

  @Column({ name: 'RYH_FZ', type: 'decimal', precision: 12, scale: 0, nullable: true })
  ryh_fz: number;

  @Column({ name: 'FZR', type: 'varchar', length: 12, nullable: true })
  fzr: string;

  @Column({ name: 'TJFZR', type: 'varchar', length: 12, nullable: true })
  tjfzr: string;

  @Column({ name: 'LXDH', type: 'varchar', length: 16, nullable: true })
  lxdh: string;

  @Column({ name: 'RIQI', type: 'datetime', nullable: true })
  riqi: Date;

  @Column({ name: 'sjbz', type: 'int', nullable: true, default: 0 })
  sjbz: number;

  @Column({ name: 'nldw', type: 'varchar', length: 4, nullable: true })
  nldw: string;

  @Column({ name: 'bzxx', type: 'varchar', length: 10, nullable: true })
  bzxx: string;

  @Column({ name: 'bzxx1', type: 'varchar', length: 20, nullable: true })
  bzxx1: string;

  @Column({ name: 'jdrq', type: 'datetime', nullable: true })
  jdrq: Date;

  @Column({ name: 'xhxb', type: 'varchar', length: 6, nullable: true })
  xhxb: string;

  @Column({ name: 'xxxb', type: 'varchar', length: 6, nullable: true })
  xxxb: string;

  @Column({ name: 'xxj', type: 'varchar', length: 6, nullable: true })
  xxj: string;

  @Column({ name: 'xqx', type: 'varchar', length: 6, nullable: true })
  xqx: string;

  @Column({ name: 'xqt', type: 'varchar', length: 6, nullable: true })
  xqt: string;

  @Column({ name: 'qzrq', type: 'datetime', nullable: true })
  qzrq: Date;

  @Column({ name: 'srqz', type: 'varchar', length: 6, nullable: true })
  srqz: string;

  @Column({ name: 'mzcy', type: 'varchar', length: 6, nullable: true })
  mzcy: string;

  @Column({ name: 'rycy', type: 'varchar', length: 6, nullable: true })
  rycy: string;

  @Column({ name: 'sqsh', type: 'varchar', length: 6, nullable: true })
  sqsh: string;

  @Column({ name: 'lcbl', type: 'varchar', length: 6, nullable: true })
  lcbl: string;

  @Column({ name: 'fxbl', type: 'varchar', length: 6, nullable: true })
  fxbl: string;

  @Column({ name: 'bajl', type: 'varchar', length: 6, nullable: true })
  bajl: string;

  @Column({ name: 'zrb', type: 'varchar', length: 6, nullable: true })
  zrb: string;

  @Column({ name: 'shss', type: 'varchar', length: 6, nullable: true })
  shss: string;

  @Column({ name: 'shsr', type: 'varchar', length: 6, nullable: true })
  shsr: string;

  @Column({ name: 'shxj', type: 'varchar', length: 6, nullable: true })
  shxj: string;

  @Column({ name: 'ry48', type: 'varchar', length: 6, nullable: true })
  ry48: string;

  @Column({ name: 'shks', type: 'varchar', length: 6, nullable: true })
  shks: string;

  @Column({ name: 'zczy', type: 'varchar', length: 6, nullable: true })
  zczy: string;

  @Column({ name: 'cyfs', type: 'varchar', length: 6, nullable: true })
  cyfs: string;

  @Column({ name: 'blfx', type: 'varchar', length: 6, nullable: true })
  blfx: string;

  @Column({ name: 'bz1', type: 'varchar', length: 10, nullable: true })
  bz1: string;

  @Column({ name: 'szbz', type: 'tinyint', nullable: true, default: 0 })
  szbz: number;

  @Column({ name: 'sscs', type: 'varchar', length: 4, nullable: true })
  sscs: string;

  @Column({ name: 'sscg', type: 'varchar', length: 4, nullable: true })
  sscg: string;

  @Column({ name: 'bz2', type: 'varchar', length: 10, nullable: true })
  bz2: string;

  @Column({ name: 'bz3', type: 'varchar', length: 80, nullable: true })
  bz3: string;

  @Column({ name: 'bz4', type: 'varchar', length: 20, nullable: true })
  bz4: string;

  @Column({ name: 'bz5', type: 'varchar', length: 20, nullable: true })
  bz5: string;

  @Column({ name: 'xzz4', type: 'varchar', length: 12, nullable: true })
  xzz4: string;

  @Column({ name: 'xzz5', type: 'varchar', length: 60, nullable: true })
  xzz5: string;

  @Column({ name: 'HKDZ4', type: 'varchar', length: 12, nullable: true })
  hkdz4: string;

  @Column({ name: 'HKDZ5', type: 'varchar', length: 60, nullable: true })
  hkdz5: string;

  @Column({ name: 'xzdz', type: 'varchar', length: 100, nullable: true })
  xzdz: string;

  @Column({ name: 'hkdz', type: 'varchar', length: 100, nullable: true })
  hkdz: string;

  @Column({ name: 'tjbz', type: 'smallint', nullable: true, default: 0 })
  tjbz: number;

  @Column({ name: 'drgbz', type: 'smallint', nullable: true, default: 0 })
  drgbz: number;

  @Column({ name: 'shbz', type: 'smallint', nullable: true, default: 0 })
  shbz: number;

  @Column({ name: 'shry', type: 'varchar', length: 10, nullable: true })
  shry: string;

  @Column({ name: 'shrq', type: 'datetime', nullable: true })
  shrq: Date;

  @Column({ name: 'ryzdicd', type: 'varchar', length: 30, nullable: true })
  ryzdicd: string;

  @Column({ name: 'ryzdmc', type: 'varchar', length: 255, nullable: true })
  ryzdmc: string;

  @Column({ name: 'ryblfx', type: 'varchar', length: 20, nullable: true })
  ryblfx: string;

  @Column({ name: 'HbsAg', type: 'varchar', length: 1, nullable: true })
  hbsag: string;

  @Column({ name: 'HCVAb', type: 'varchar', length: 1, nullable: true })
  hcvab: string;

  @Column({ name: 'HIVAb', type: 'varchar', length: 1, nullable: true })
  hivab: string;

  @Column({ name: 'bld_cat', type: 'varchar', length: 6, nullable: true })
  bld_cat: string;

  @Column({ name: 'bld_unt', type: 'varchar', length: 10, nullable: true })
  bld_unt: string;

  @Column({ name: 'bld_amt', type: 'varchar', length: 10, nullable: true })
  bld_amt: string;

  @Column({ name: 'bz6', type: 'varchar', length: 10, nullable: true })
  bz6: string;

  @Column({ name: 'thl', type: 'tinyint', nullable: true, default: 0 })
  thl: number;

  @Column({ name: 'yhl', type: 'tinyint', nullable: true, default: 0 })
  yhl: number;

  @Column({ name: 'ehl', type: 'tinyint', nullable: true, default: 0 })
  ehl: number;

  @Column({ name: 'shl', type: 'tinyint', nullable: true, default: 0 })
  shl: number;

  @Column({ name: 'sflx', type: 'varchar', length: 2, nullable: true, default: '01' })
  sflx: string;

  @Column({ name: 'sslclj1', type: 'varchar', length: 2, nullable: true, default: '' })
  sslclj1: string;

  @Column({ name: 'bz7', type: 'varchar', length: 2, nullable: true, default: '' })
  bz7: string;

  @Column({ name: 'mzys', type: 'varchar', length: 10, nullable: true, default: '' })
  mzys: string;

  @Column({ name: 'blsm', type: 'varchar', length: 100, nullable: true, default: '' })
  blsm: string;

}
