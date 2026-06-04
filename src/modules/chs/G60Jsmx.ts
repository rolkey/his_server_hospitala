import { Column, Entity, Index } from 'typeorm';

@Entity('G60_JSMX', { schema: 'dbo' })
export class G60Jsmx {
  @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  lsh: string;

  @Column('varchar', { primary: true, name: 'lshxh', length: 20 })
  lshxh: string;

  @Column('varchar', { primary: true, name: 'setl_id', length: 30 })
  setl_id: string;

  @Column('int', { primary: true, name: 'mxxh' })
  mxxh: number;

  @Column('varchar', { name: 'fund_pay_type', nullable: true, length: 20 })
  fund_pay_type: string | null;

  @Column('decimal', {
    name: 'inscp_scp_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  inscp_scp_amt: number | null;

  @Column('decimal', {
    name: 'crt_payb_lmt_amt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  crt_payb_lmt_amt: number | null;

  @Column('decimal', {
    name: 'fund_payamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  fund_payamt: number | null;

  @Column('varchar', {
    name: 'fund_pay_type_name',
    nullable: true,
    length: 200,
  })
  fund_pay_type_name: string | null;

  @Column('varchar', { name: 'setl_proc_info', nullable: true, length: 250 })
  setl_proc_info: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 30 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 30 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 30 })
  bz3: string | null;

  @Column('varchar', {
    name: 'poolarea_fund_pay_type',
    nullable: true,
    length: 10,
  })
  poolarea_fund_pay_type: string | null;
}
