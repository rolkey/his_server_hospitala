import { Column, Entity, Index } from 'typeorm';

@Entity('G10_DZZH', { schema: 'dbo' })
export class G10Dzzh {
  @Column('varchar', { primary: true, name: 'lsh', length: 15 })
  lsh: string;

  @Column('varchar', { name: 'autherCertno', nullable: true, length: 20 })
  autherCertno: string | null;

  @Column('varchar', { name: 'autherName', nullable: true, length: 30 })
  autherName: string | null;

  @Column('varchar', { name: 'psn_no', nullable: true, length: 30 })
  psnNo: string | null;

  @Column('varchar', { name: 'userCertno', nullable: true, length: 30 })
  userCertno: string | null;

  @Column('varchar', { name: 'acctUserName', nullable: true, length: 30 })
  acctUserName: string | null;

  @Column('varchar', { name: 'insuType', nullable: true, length: 20 })
  insuType: string | null;

  @Column('numeric', {
    name: 'acctPay1',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  acctPay1: number | null;

  @Column('varchar', { name: 'fixmedinsCode', nullable: true, length: 30 })
  fixmedinsCode: string | null;

  @Column('varchar', { name: 'mdtrt_cert_type', nullable: true, length: 10 })
  mdtrtCertType: string | null;

  @Column('varchar', { name: 'mdtrt_cert_no', nullable: true, length: 50 })
  mdtrtCertNo: string | null;

  @Column('varchar', { name: 'setlId1', nullable: true, length: 50 })
  setlId1: string | null;

  @Column('varchar', { name: 'mdtrtId1', nullable: true, length: 50 })
  mdtrtId1: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 50 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 50 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 50 })
  bz3: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 50 })
  bz4: string | null;

  @Column('varchar', { name: 'bz5', nullable: true, length: 50 })
  bz5: string | null;

  @Column('varchar', { name: 'setlId', nullable: true, length: 50 })
  setlId: string | null;

  @Column('varchar', { name: 'mdtrtId', nullable: true, length: 50 })
  mdtrtId: string | null;

  @Column('varchar', { name: 'clrType', nullable: true, length: 50 })
  clrType: string | null;

  @Column('varchar', { name: 'clrOptions', nullable: true, length: 50 })
  clrOptions: string | null;

  @Column('numeric', {
    name: 'medfeeSumamt',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  medfeeSumamt: number | null;

  @Column('numeric', {
    name: 'fundPaySumamt',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  fundPaySumamt: number | null;

  @Column('numeric', {
    name: 'acctPay',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  acctPay: number | null;

  @Column('numeric', {
    name: 'balance',
    nullable: true,
    precision: 18,
    scale: 2,
  })
  balance: number | null;

  @Column('datetime', { name: 'jssj', nullable: true })
  jssj: Date | null;

  @Column('varchar', { name: 'insuTypebs', nullable: true, length: 20 })
  insuTypebs: string | null;

  @Column('varchar', { name: 'bz6', nullable: true, length: 10 })
  bz6: string | null;

  @Column('varchar', { name: 'bz7', nullable: true, length: 10 })
  bz7: string | null;

  @Column('varchar', { name: 'fyid', nullable: true, length: 10 })
  fyid: string | null;
}
