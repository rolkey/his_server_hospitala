import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('G90_SJDZ_GS_pk', ['xh'], { unique: true })
@Entity('G90_SJDZ_GS', { schema: 'dbo' })
export class G90SjdzGs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'xh' })
  xh: number;

  @Column('varchar', { name: 'yf', nullable: true, length: 10 })
  yf: string | null;

  @Column('varchar', { name: 'insutype', nullable: true, length: 6 })
  insutype: string | null;

  @Column('varchar', { name: 'clr_type', nullable: true, length: 30 })
  clrType: string | null;

  @Column('varchar', { name: 'setl_optins', nullable: true, length: 6 })
  setlOptins: string | null;

  @Column('datetime', { name: 'stmt_begndate', nullable: true })
  stmtBegndate: Date | null;

  @Column('datetime', { name: 'stmt_enddate', nullable: true })
  stmtEnddate: Date | null;

  @Column('decimal', {
    name: 'medfee_sumamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  medfeeSumamt: number | null;

  @Column('decimal', {
    name: 'fund_pay_sumamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  fundPaySumamt: number | null;

  @Column('decimal', {
    name: 'acct_pay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  acctPay: number | null;

  @Column('int', { name: 'fixmedins_setl_cnt', nullable: true })
  fixmedinsSetlCnt: number | null;

  @Column('varchar', { name: 'stmt_rslt', nullable: true, length: 10 })
  stmtRslt: string | null;

  @Column('varchar', { name: 'stmt_rslt_dscr', nullable: true, length: 200 })
  stmtRsltDscr: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 10 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 10 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 10 })
  bz3: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 30 })
  bz4: string | null;

  @Column('varchar', { name: 'bz5', nullable: true, length: 60 })
  bz5: string | null;
}
