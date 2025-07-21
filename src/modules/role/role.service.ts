import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AddRolePermissionsDto,
  AddRoleUsersDto,
  CreateRoleDto,
  GetRolesDto,
  QueryRoleDto,
  UpdateRoleDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, Repository } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '@/modules/permission/permission.entity';
import { SharedService } from '@/shared/shared.service';
import { usrcat } from '../usrcat/usrcat.entity';
import { Module } from '../module/module.entity';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
// import { User } from '@/modules/user/user.entity';

@Injectable()
export class RoleService {
  constructor(
    private readonly sharedService: SharedService,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(usrcat)
    private UsrcatRepo: Repository<usrcat>,
    @InjectRepository(Module)
    private moduleRep: Repository<Module>,
    private dataSource: DataSource,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const [existRole] = await this.roleRepo.find({
      where: [{ name: createRoleDto.name }, { code: createRoleDto.code }],
    });

    if (existRole) throw new BadRequestException('角色已存在（角色名和角色编码不能重复）');

    return await this.dataSource.transaction(async (manager) => {
      const role = manager.create(Role, createRoleDto);
      if (createRoleDto.permissionIds) {
        role.permissions = await manager.find(Permission, {
          where: { id: In(createRoleDto.permissionIds) },
        });
      }
      if (createRoleDto.moduleIds) {
        const modules = await manager.find(Module, {
          where: { id: In(createRoleDto.moduleIds) },
        });
        role.modules = modules;
      }
      return await manager.save(role);
    });
  }

  async findAll(query: GetRolesDto) {
    return this.roleRepo.find({ where: query });
  }

  async findPagination(query: QueryRoleDto) {
    const pageSize = query.pageSize || 10;
    const pageNo = query.pageNo || 1;
    const [data, total] = await this.roleRepo.findAndCount({
      where: {
        name: Like(`${query.name ? '%' + query.name + '%' : '%'}`),
        enable: query.enable || undefined,
      },
      relations: { permissions: true, modules: true },
      order: {
        name: 'DESC',
      },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
    });
    const pageData = data.map((item) => {
      const permissionIds = item?.permissions?.map((p) => p.id);
      delete item.permissions;
      const moduleIds = item?.modules?.map((p) => p.id);
      // delete item.modules;
      return { ...item, permissionIds, moduleIds };
    });
    return { pageData, total };
  }

  async findOne(id: string) {
    const role = await this.roleRepo.findOne({ where: { id } });
    return role;
  }

  async findRolePermissionsTree(code: string) {
    const role = await this.roleRepo.findOne({ where: { code }, relations: { permissions: true } });
    if (!role) throw new BadRequestException('当前角色不存在或者已删除');
    if (role.code === 'SUPER_ADMIN') {
      const permissions = await this.permissionRepo.find({});
      return this.sharedService.handleTree(permissions);
    }
    return this.sharedService.handleTree(role.permissions);
  }

  async findRolePermissions(id: string) {
    const role = await this.roleRepo.findOne({ where: { id }, relations: { permissions: true } });
    if (!role) throw new BadRequestException('当前角色不存在或者已删除');
    return role.permissions;
  }

  async findRoleModule(code: string, permissions: boolean) {
    const role = await this.roleRepo.findOne({ where: { code: code || '' } });

    if (!role) {
      throw new BadRequestException('当前角色不存在或者已删除');
    }

    let module: Module[];

    if (role.code === 'SUPER_ADMIN') {
      module = await this.moduleRep.find({
        relations: { permissions: permissions },
        order: {
          order: 'ASC',
        },
      });
    } else {
      module = await this.moduleRep.find({
        where: { roles: role },
        relations: { permissions: permissions },
        order: {
          order: 'ASC',
        },
      });
    }

    if (module && permissions) {
      const result = await Promise.all(
        module.map(async (item) => {
          const parentPermissions = item.permissions;
          const permissionsIds = parentPermissions?.map((i) => i.id);
          if (permissionsIds && permissionsIds.length) {
            item.permissions = await this.permissionRepo.find({
              where: { parentId: In(permissionsIds) },
              order: {
                order: 'ASC',
              },
            });
          }
          return {
            ...item,
            children: item.permissions
              ? this.sharedService.handleTree([...parentPermissions, ...item.permissions])
              : [],
          };
        }),
      );

      return result;
    }

    return module;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const role = await this.roleRepo.findOne({ where: { id }, relations: { modules: true } });

        if (!role) throw new BadRequestException('角色不存在或者已删除');

        if (role.code === 'SUPER_ADMIN') throw new BadRequestException('不允许修改超级管理员');

        if (!module) {
          throw new CustomException(ErrorCode.ERR_11006, '模块不存在');
        }
        if (role.modules) {
          await manager.createQueryBuilder().relation(Role, 'modules').of(id).remove(role.modules);
        }
        const newRole = this.roleRepo.merge(role, updateRoleDto);
        if (updateRoleDto.permissionIds) {
          newRole.permissions = await manager.find(Permission, {
            where: { id: In(updateRoleDto.permissionIds) },
          });
        }
        if (updateRoleDto.moduleIds) {
          const modules = await manager.find(Module, {
            where: { id: In(updateRoleDto.moduleIds) },
          });
          newRole.modules = modules;
        }
        await manager.save(newRole);
        return true;
      } catch (error) {
        console.error(error);
        throw new CustomException(ErrorCode.ERR_11006, '更新模块失败');
      }
    });
  }

  async remove(id: string) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: { users: true },
    });
    if (!role) throw new BadRequestException('角色不存在或者已删除');
    if (role.code === 'SUPER_ADMIN') throw new BadRequestException('不允许删除超级管理员');
    if (role.users?.length) throw new BadRequestException('当前角色存在已授权的用户，不允许删除！');
    await this.roleRepo.remove(role);
    return true;
  }

  async addRolePermissions(dto: AddRolePermissionsDto) {
    const { permissionIds, id } = dto;
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: { permissions: true },
    });
    if (!role) throw new BadRequestException('角色不存在或者已删除');
    if (role.code === 'SUPER_ADMIN') throw new BadRequestException('无需给超级管理员授权');
    const permissions = await this.permissionRepo.find({
      where: permissionIds.map((item) => ({ id: item })),
    });
    role.permissions = role.permissions
      .filter((item) => !permissionIds.includes(item.id))
      .concat(permissions);
    await this.roleRepo.save(role);
    return true;
  }

  async addRoleUsers(id: string, dto: AddRoleUsersDto) {
    const { userIds } = dto;
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: { users: true },
    });
    if (!role) throw new BadRequestException('角色不存在或者已删除');
    const users = await this.UsrcatRepo.find({ where: { usid: In(userIds) } });
    role.users = role.users.filter((item) => !userIds.includes(item.usid)).concat(users);
    await this.roleRepo.save(role);
    return true;
  }

  async removeRoleUsers(id: string, dto: AddRoleUsersDto) {
    const { userIds } = dto;
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: { users: true },
    });
    if (!role) throw new BadRequestException('角色不存在或者已删除');
    role.users = role.users.filter((item) => !userIds.includes(item.usid));
    await this.roleRepo.save(role);
    return true;
  }
}
