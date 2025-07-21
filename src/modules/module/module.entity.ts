import { SnowflakeIdGenerator } from '@/utils/SnowflakeIdGenerator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DateTransformer } from '@/common/transformers/date.transformer';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';

@Entity('sys_module', { schema: 'dbo' })
export class Module {
  @PrimaryColumn('varchar', { name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', length: 50 })
  name: string | null;

  @Column('varchar', { name: 'title', length: 50 })
  title: string | null;

  @Column('varchar', { name: 'icon', nullable: true, length: 50 })
  icon: string | null;

  @Column('varchar', { name: 'path', nullable: true, length: 255 })
  path: string | null;

  @Column('varchar', { name: 'logo', nullable: true, length: 50 })
  logo: string | null;

  @Column('varchar', { name: 'notes', nullable: true, length: 50 })
  notes: string | null;

  @Column('varchar', { name: 'category', nullable: true, length: 50 })
  category: string | null;

  @Column({ nullable: true })
  order: number;

  @CreateDateColumn({ name: 'create_time' })
  @DateTransformer()
  createTime: string;

  @UpdateDateColumn({ name: 'update_time' })
  @DateTransformer()
  updateTime: string;

  @ManyToMany(() => Role, (role) => role.permissions, {
    createForeignKeyConstraints: false,
  })
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.modules, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'sys_module_permissions_permission',
    joinColumn: {
      name: 'moduleId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = SnowflakeIdGenerator.generate();
    }
  }
  @BeforeInsert()
  setCreatedAt() {
    this.createTime = new Date().toISOString();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updateTime = new Date().toISOString();
  }
}
