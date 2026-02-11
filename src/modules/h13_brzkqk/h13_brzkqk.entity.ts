import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

/**
 * 病人转科情况表 h13_brzkqk
 * 主键: zkksid, zksj, zyid, lrsj
 */
@Entity('h13_brzkqk', { schema: 'dbo' })
@Index('h13_brzkqdk_zyid_ksid', ['zyid', 'ksid'])
export class h13_brzkqk {
  /** 转科科室ID */
  @PrimaryColumn('varchar', { name: 'zkksid', length: 10 })
  zkksid: string;

  /** 转科时间 */
  @PrimaryColumn('datetime', { name: 'zksj' })
  zksj: Date;

  /** 住院ID */
  @PrimaryColumn('varchar', { name: 'zyid', length: 12 })
  zyid: string;

  /** 录入时间 */
  @PrimaryColumn('datetime', { name: 'lrsj' })
  lrsj: Date;

  /** 录入人ID */
  @Column('varchar', { name: 'lryid', length: 10 })
  lryid: string;

  /** 确认时间 */
  @Column('datetime', { name: 'qrsj', nullable: true })
  qrsj: Date | null;

  /** 确认人ID */
  @Column('varchar', { name: 'qrrid', nullable: true, length: 10 })
  qrrid: string | null;

  /** 科室ID */
  @Column('varchar', { name: 'ksid', nullable: true, length: 10 })
  ksid: string | null;

  @ManyToOne(() => h11_brxx)
  @JoinColumn({ name: 'zyid', referencedColumnName: 'zyid' })
  h11_brxxEntity: h11_brxx;
}
