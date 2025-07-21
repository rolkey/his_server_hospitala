
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@/modules/role/role.entity';
import { MethodType, PermissionType } from '@/types';
import { SnowflakeIdGenerator } from '@/utils/SnowflakeIdGenerator';
import { Module } from '../module/module.entity';


@Entity("sys_permission", { schema: "dbo" })
export class Permission {
  @PrimaryColumn("varchar", { name: "id" })
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column()
  type: PermissionType;

  @ManyToOne(() => Permission, (permission) => permission.children, {
    createForeignKeyConstraints: false,
  })
  parent: Permission;

  @OneToMany(() => Permission, (permission) => permission.parent, {
    createForeignKeyConstraints: false,
  })
  children: Permission[];

  @Column({ nullable: true })
  parentId: string;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  redirect: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  component: string;

  @Column({ nullable: true })
  layout: string;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: boolean) => value ? '1' : '0',
      from: (value: string) => value === '1'
    }
  })
  keepAlive: boolean;

  @Column({ nullable: true })
  method: MethodType;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    default: '1',
    transformer: {
      to: (value: boolean) => value ? '1' : '0',
      from: (value: string) => value === '1'
    },
    comment: '是否展示在页面菜单'
  })
  show: boolean;

  @Column({
    type: 'varchar',
    default: '1',
    transformer: {
      to: (value: boolean) => value ? '1' : '0',
      from: (value: string) => value === '1'
    }
  })
  enable: boolean;

  @Column({ nullable: true })
  order: number;

  @ManyToMany(() => Role, (role) => role.permissions, {
    createForeignKeyConstraints: false,
  })
  roles: Role[];

  @ManyToMany(() => Module, (module) => module.permissions, {
    createForeignKeyConstraints: false, 
  })
  modules: Module[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = SnowflakeIdGenerator.generate();
    }
  }

}
