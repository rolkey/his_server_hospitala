import { Column, Entity, Index } from 'typeorm';

@Index('PK_G01_RYXX_1', ['lsh', 'lshxh'], { unique: true })
@Entity('G01_RYXX', { schema: 'dbo' })
export class G01Ryxx {
  @Column('varchar', { primary: true, name: 'lsh', length: 20 })
  lsh: string;

  @Column('varchar', { primary: true, name: 'lshxh', length: 20 })
  lshxh: string;

  @Column('varchar', { name: 'mdtrt_cert_type', nullable: true, length: 3 })
  mdtrt_cert_type: string | null;

  @Column('varchar', { name: 'mdtrt_cert_no', nullable: true, length: 50 })
  mdtrt_cert_no: string | null;

  @Column('varchar', { name: 'card_sn', nullable: true, length: 32 })
  card_sn: string | null;

  @Column('datetime', { name: 'begntime', nullable: true })
  begntime: Date | null;

  @Column('varchar', { name: 'psn_no', nullable: true, length: 30 })
  psn_no: string | null;

  @Column('varchar', { name: 'psn_cert_type', nullable: true, length: 6 })
  psn_cert_type: string | null;

  @Column('varchar', { name: 'certno', nullable: true, length: 50 })
  certno: string | null;

  @Column('varchar', { name: 'psn_name', nullable: true, length: 50 })
  psn_name: string | null;

  @Column('varchar', { name: 'gend', nullable: true, length: 6 })
  gend: string | null;

  @Column('varchar', { name: 'naty', nullable: true, length: 3 })
  naty: string | null;

  @Column('varchar', { name: 'brdy', nullable: true, length: 30 })
  brdy: string | null;

  @Column('varchar', { name: 'age', nullable: true, length: 10 })
  age: string | null;

  @Column('smallint', { name: 'yxbz', nullable: true, default: () => '(0)' })
  yxbz: number | null;

  @Column('varchar', { name: 'cardtype', nullable: true, length: 3 })
  cardtype: string | null;

  @Column('varchar', { name: 'businesstype', nullable: true, length: 3 })
  businesstype: string | null;

  @Column('varchar', { name: 'operatorid', nullable: true, length: 64 })
  operatorid: string | null;

  @Column('varchar', { name: 'operatorname', nullable: true, length: 64 })
  operatorname: string | null;

  @Column('varchar', { name: 'officeid', nullable: true, length: 20 })
  officeid: string | null;

  @Column('varchar', { name: 'officename', nullable: true, length: 30 })
  officename: string | null;

  @Column('varchar', { name: 'idno', nullable: true, length: 50 })
  idno: string | null;

  @Column('varchar', { name: 'username', nullable: true, length: 50 })
  username: string | null;

  @Column('varchar', { name: 'ectoken', nullable: true, length: 50 })
  ectoken: string | null;

  @Column('varchar', { name: 'insuorg', nullable: true, length: 10 })
  insuorg: string | null;

  @Column('varchar', { name: 'ssn_code', nullable: true, length: 20 })
  ssnCode: string | null;

  @Column('varchar', { name: 'cardno', nullable: true, length: 20 })
  cardno: string | null;

  @Column('varchar', { name: 'card_spec_ver', nullable: true, length: 10 })
  card_spec_ver: string | null;

  @Column('varchar', { name: 'insuplc_admdvs', nullable: true, length: 10 })
  insuplc_admdvs: string | null;

  @Column('varchar', { name: 'cardtoken', nullable: true, length: 50 })
  cardtoken: string | null;

  @Column('varchar', { name: 'bz1', nullable: true, length: 20 })
  bz1: string | null;

  @Column('varchar', { name: 'bz2', nullable: true, length: 20 })
  bz2: string | null;

  @Column('varchar', { name: 'bz3', nullable: true, length: 20 })
  bz3: string | null;

  @Column('varchar', { name: 'bz4', nullable: true, length: 30 })
  bz4: string | null;

  @Column('varchar', { name: 'bz5', nullable: true, length: 30 })
  bz5: string | null;

  @Column('varchar', { name: 'mdtrtcertno', nullable: true, length: 500 })
  mdtrtcertno: string | null;

  @Column('varchar', { name: 'extend', nullable: true })
  extend: string | null;
}
