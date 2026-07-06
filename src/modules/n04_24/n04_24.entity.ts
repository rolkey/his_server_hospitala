import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'N04_24', schema: 'dbo' })
export class N0424 {
  @PrimaryColumn({ name: 'zyid', type: 'varchar', length: 12, nullable: false })
  zyid: string;

  @Column({ name: 'ZFY', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zfy: number;

  @Column({ name: 'ZFJE', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zfje: number;

  @Column({ name: 'YLFWF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  ylfwf: number;

  @Column({ name: 'BZLZF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  bzlzf: number;

  @Column({ name: 'ZYBLZHZF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zyblzhzf: number;

  @Column({ name: 'ZLCZF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zlczf: number;

  @Column({ name: 'HLF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  hlf: number;

  @Column({ name: 'QTFY', type: 'decimal', precision: 12, scale: 2, nullable: true })
  qtfy: number;

  @Column({ name: 'BLZDF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  blzdf: number;

  @Column({ name: 'ZDF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zdf: number;

  @Column({ name: 'YXXZDF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  yxxzdf: number;

  @Column({ name: 'LCZDXMF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  lczdxmf: number;

  @Column({ name: 'FSSZLXMF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  fsszlxmf: number;

  @Column({ name: 'ZLF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zlf: number;

  @Column({ name: 'SSZLF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  sszlf: number;

  @Column({ name: 'MZF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  mzf: number;

  @Column({ name: 'SSF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  ssf: number;

  @Column({ name: 'KFF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  kff: number;

  @Column({ name: 'ZYL_ZYZD', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zyl_zyzd: number;

  @Column({ name: 'ZYZL', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zyzl: number;

  @Column({ name: 'ZYWZ', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zywz: number;

  @Column({ name: 'ZYGS', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zygs: number;

  @Column({ name: 'ZCYJF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zcyjf: number;

  @Column({ name: 'ZYTNZL', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zytnzl: number;

  @Column({ name: 'ZYGCZL', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zygczl: number;

  @Column({ name: 'ZYTSZL', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zytszl: number;

  @Column({ name: 'ZYQT', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zyqt: number;

  @Column({ name: 'ZYTSTPJG', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zytstpjg: number;

  @Column({ name: 'BZSS', type: 'decimal', precision: 12, scale: 2, nullable: true })
  bzss: number;

  @Column({ name: 'XYF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  xyf: number;

  @Column({ name: 'KJYWF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  kjywf: number;

  @Column({ name: 'ZCYF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zcyf: number;

  @Column({ name: 'ZYZJF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zyzjf: number;

  @Column({ name: 'ZCYF1', type: 'decimal', precision: 12, scale: 2, nullable: true })
  zcyf1: number;

  @Column({ name: 'XF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  xf: number;

  @Column({ name: 'BDBLZPF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  bdblzpf: number;

  @Column({ name: 'QDBLZPF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  qdblzpf: number;

  @Column({ name: 'NXYZLZPF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  nxyzlzpf: number;

  @Column({ name: 'XBYZLZPF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  xbyzlzpf: number;

  @Column({ name: 'JCYYCLF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  jcyyclf: number;

  @Column({ name: 'YYCLF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  yyclf: number;

  @Column({ name: 'SSYCXCLF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  ssycxclf: number;

  @Column({ name: 'QTF', type: 'decimal', precision: 12, scale: 2, nullable: true })
  qtf: number;

  @Column({ name: 'sjbz', type: 'int', nullable: true, default: 0 })
  sjbz: number;
}
