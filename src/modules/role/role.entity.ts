import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { User } from '@/modules/user/user.entity';
import { usrcat } from '@/modules/usrcat/usrcat.entity';

import { Permission } from '@/modules/permission/permission.entity';
import { SnowflakeIdGenerator } from '@/utils/SnowflakeIdGenerator';
import { Module } from '../module/module.entity';

@Entity('sys_role', { schema: 'dbo' })
export class Role {
  @PrimaryColumn('varchar', { name: 'id' })
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ default: true })
  enable: boolean;

  @Column({ unique: false, length: 255 })
  home: string;

  @ManyToMany(() => usrcat, (user) => user.roles, {
    createForeignKeyConstraints: false,
  })
  users: usrcat[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'sys_role_permissions_permission',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @ManyToMany(() => Module, (modules) => modules.roles, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'sys_role_modules_module',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'moduleId',
      referencedColumnName: 'id',
    },
  })
  modules: Module[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = SnowflakeIdGenerator.generate();
    }
  }
}
