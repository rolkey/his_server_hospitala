import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In, Like } from 'typeorm';
import { CreateDto, QueryDto, UpdateDto } from './dto';
import { Module } from './module.entity';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import { Permission } from '../permission/permission.entity';
import { SharedService } from '@/shared/shared.service';

@Injectable()
export class ModuleService {
  constructor(
    private readonly sharedService: SharedService,
    @InjectRepository(Module)
    private moduleRep: Repository<Module>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    private dataSource: DataSource,
  ) { }

  async update(id: string, updateDto: UpdateDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        // 1. 获取旧模块及其关联权限
        const module = await manager.findOne(Module, {
          where: { id },
          relations: { permissions: true },
        });

        if (!module) {
          throw new CustomException(ErrorCode.ERR_11006, '模块不存在');
        }
        if (module.permissions) {
          await manager
            .createQueryBuilder()
            .relation(Module, 'permissions')
            .of(id)
            .remove(module.permissions);
        }
        // 4. 更新模块其他字段
        manager.merge(Module, module, updateDto);

        if (updateDto.permissionIds) {
          const permissions = await manager.find(Permission, {
            where: { id: In(updateDto.permissionIds) },
          });
          // 5. 更新新权限
          module.permissions = permissions;
        }
        // 6. 保存更新后的模块
        await manager.save(module);
        return true;
      } catch (error) {
        console.error(error);
        throw new CustomException(ErrorCode.ERR_11006, '更新模块失败');
      }
    });
  }
  async create(createDto: CreateDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const create = manager.create(Module, createDto);
        if (createDto.permissionIds) {
          const permissions = await manager.find(Permission, {
            where: { id: In(createDto.permissionIds) },
          });
          create.permissions = permissions;
        }
        await manager.save(create);
        return true;
      } catch (error) {
        console.error(error);
        throw new CustomException(ErrorCode.ERR_11006, '增加模块失败');
      }
    });
  }

  async remove(id: string) {
    const module = await this.moduleRep.findOne({ where: { id } });
    await this.moduleRep.remove(module);
    return true;
  }

  async findAll(query: QueryDto) {
    const pageSize = query.pageSize || 500;
    const pageNo = query.pageNo || 1;
    const permissions = query.permissions || true;
    const [data, total] = await this.moduleRep.findAndCount({
      where: {},
      relations: { permissions },
      order: {
        order: 'ASC',
      },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
    });
    const pageData = data.map((item) => {
      const permissionIds = item?.permissions?.map((p) => p.id);
      // delete item.permissions;
      return { ...item, permissionIds };
    });
    return { pageData, total };
  }

  async findOne(id: string) {
    const module = await this.moduleRep.findOne({
      where: { id },
      relations: { permissions: true },
      order: {
        order: 'ASC',
      },
    });
    const parentPermissions = module.permissions;
    const permissionsIds = parentPermissions?.map((i) => i.id);
    if (permissionsIds && permissionsIds.length) {
      module.permissions = await this.permissionRepo.find({
        where: { parentId: In(permissionsIds) },
        order: {
          order: 'ASC',
        },
      });
      module.permissions = this.sharedService.handleTree([
        ...parentPermissions,
        ...module.permissions,
      ]);
    }
    return module;
  }
}
