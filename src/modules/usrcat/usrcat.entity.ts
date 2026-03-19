import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '@/modules/role/role.entity';
import { SnowflakeIdGenerator } from '@/utils/SnowflakeIdGenerator';
import { ksmc } from '../ksmc/ksmc.entity';
import { zcmc } from '../zcmc/zcmc.entity';
// import { DateTransformer } from '@/common/transformers/date.transformer';

@Entity('__usrcat', { schema: 'dbo' })
export class usrcat {
  @Column('varchar', { primary: true, name: 'usid', length: 10 })
  usid: string;

  @Column('varchar', { name: 'unam', nullable: true, length: 30 })
  unam: string | null;

  @Column('varchar', { name: 'pwrd', nullable: true, length: 30 })
  pwrd: string | null;

  // @Column("char", { name: "hzsr", nullable: true, length: 30 })
  // hzsr: string | null;

  // @Column("char", { name: "bmlx", nullable: true, length: 30 })
  // bmlx: string | null;

  @Column('bit', { name: 'xgmm' })
  xgmm: boolean;

  @Column('bit', { name: 'bgmm' })
  bgmm: boolean;

  @Column('bit', { name: 'mmyx' })
  mmyx: boolean;

  @Column('bit', { name: 'zhjy' })
  zhjy: number;

  // @Column("datetime", { name: "mmrq" })
  // mmrq: Date | null;

  // @Column("char", { name: "szbm", nullable: true, length: 20 })
  // szbm: string | null;

  // @Column("char", { name: "pybm", nullable: true, length: 20 })
  // pybm: string | null;

  // @Column("char", { name: "qtbm", nullable: true, length: 20 })
  // qtbm: string | null;

  // @Column("char", { name: "wbbm", nullable: true, length: 20 })
  // wbbm: string | null;

  @Column('varchar', { name: 'ksid', length: 10 })
  ksid: string;

  @Column('varchar', { name: 'zcid', length: 10 })
  zcid: string;

  @Column('varchar', { name: 'zwid', length: 10 })
  zwid: string;

  // @Column("char", { name: "zyksid", nullable: true, length: 10 })
  // zyksid: string | null;

  @Column('varchar', { name: 'ybry', nullable: true, length: 20 })
  ybry: string | null;

  // @Column("varchar", { name: "bz1", nullable: true, length: 10 })
  // bz1: string | null;

  // @Column("image", { name: "zp", nullable: true })
  // zp: Buffer | null;

  // @Column("varchar", { name: "sfzh", nullable: true, length: 18 })
  // sfzh: string | null;

  // @Column("tinyint", { name: "cfjb", nullable: true, default: () => "(0)" })
  // cfjb: number | null;

  // @Column("varchar", { name: "mz", nullable: true, length: 15 })
  // mz: string | null;

  // @Column("varchar", { name: "wh", nullable: true, length: 20 })
  // wh: string | null;

  // @Column("varchar", { name: "xx", nullable: true, length: 30 })
  // xx: string | null;

  // @Column("varchar", { name: "bz2", nullable: true, length: 30 })
  // bz2: string | null;

  // @Column("varchar", { name: "bz3", nullable: true, length: 30 })
  // bz3: string | null;

  // @Column("varchar", { name: "bz4", nullable: true, length: 30 })
  // bz4: string | null;

  // @Column("varchar", { name: "xb", nullable: true, length: 4 })
  // xb: string | null;

  // @Column("varchar", { name: "lxdh", nullable: true, length: 15 })
  // lxdh: string | null;

  // @Column("datetime", { name: "csrq", nullable: true })
  // csrq: Date | null;

  // @Column("tinyint", { name: "bxh", nullable: true, default: () => "(0)" })
  // bxh: number | null;

  // @Column("varchar", { name: "sflx", nullable: true, length: 20 })
  // sflx: string | null;

  // @Column("varchar", { name: "zyfw", nullable: true, length: 30 })
  // zyfw: string | null;

  // @Column("varchar", { name: "zyzgbm", nullable: true, length: 30 })
  // zyzgbm: string | null;

  // @Column("varchar", { name: "zyzsbm", nullable: true, length: 30 })
  // zyzsbm: string | null;

  // @Column("varchar", { name: "zyzzd", nullable: true, length: 60 })
  // zyzzd: string | null;

  // @Column("datetime", { name: "zyrq", nullable: true })
  // zyrq: Date | null;

  @Column('datetime', { name: 'jsrq', nullable: true })
  jsrq: Date | null;

  // @Column("varchar", { name: "pyzc", nullable: true, length: 10 })
  // pyzc: string | null;

  @Column('varchar', { name: 'ssdj', nullable: true, length: 10 })
  ssdj: string | null;

  // @Column("varchar", { name: "bskpd", nullable: true, length: 20 })
  // bskpd: string | null;

  @ManyToOne(() => zcmc)
  @JoinColumn({ name: 'zcid', referencedColumnName: 'zcid' })
  zcidEntity: zcmc;

  @ManyToMany(() => ksmc, (ksmc) => ksmc.usrcats, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: '__ksry',
    joinColumn: {
      name: 'usid',
      referencedColumnName: 'usid',
    },
    inverseJoinColumn: {
      name: 'ksid',
      referencedColumnName: 'ksid',
    },
  })
  ksmcs: ksmc[];
  @ManyToMany(() => Role, (role) => role.users, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'sys_user_roles_role',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'usid',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @BeforeInsert()
  generateId() {
    if (!this.usid) {
      this.usid = SnowflakeIdGenerator.generate();
    }
  }

  @AfterLoad()
  trim() {
    this.usid = this.usid.trim();
    this.unam = this.unam.trim();
    if (this.zcid) {
      this.zcid = this.zcid.trim();
    }
    if (this.ksid) {
      this.ksid = this.ksid.trim();
    }
  }
}
