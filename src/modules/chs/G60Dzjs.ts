import { Column, Entity, Index } from 'typeorm';

@Entity('G60_DZJS', { schema: 'dbo' })
export class G60Dzjs {
  @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  lsh: string;

  @Column('varchar', { primary: true, name: 'lshxh', length: 20 })
  lshxh: string;

  @Column('varchar', { primary: true, name: 'setlId', length: 50 })
  setlId: string;

  @Column('varchar', { name: 'mdtrtId', nullable: true, length: 30 })
  mdtrtId: string | null;

  @Column('varchar', { name: 'clrType', nullable: true, length: 10 })
  clrType: string | null;

  @Column('varchar', { name: 'insuType', nullable: true, length: 10 })
  insuType: string | null;

  @Column('varchar', { name: 'clrOptions', nullable: true, length: 10 })
  clrOptions: string | null;

  @Column('decimal', {
    name: 'medfeeSumamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  medfeeSumamt: number | null;

  @Column('decimal', {
    name: 'fundPaySumamt',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  fundPaySumamt: number | null;

  @Column('decimal', {
    name: 'acctPay',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  acctPay: number | null;

  @Column('decimal', {
    name: 'balance',
    nullable: true,
    precision: 16,
    scale: 2,
  })
  balance: number | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 30 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 30 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 30 })
  bz3: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 30 })
  bz4: string | null;

  @Column('varchar', { name: 'bz5', nullable: true, length: 30 })
  bz5: string | null;

  @Column('varchar', { name: 'bz6', nullable: true, length: 30 })
  bz6: string | null;

  @Column('varchar', { name: 'bz7', nullable: true, length: 30 })
  bz7: string | null;

  @Column('varchar', { name: 'bz8', nullable: true, length: 30 })
  bz8: string | null;
}
