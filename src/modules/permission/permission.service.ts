

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { In, IsNull, Repository } from 'typeorm';
import { SharedService } from '@/shared/shared.service';
import { pathToRegexp } from 'path-to-regexp';

@Injectable()
export class PermissionService {
  constructor(
    private readonly sharedService: SharedService,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) { }
  create(createPermissionDto: CreatePermissionDto) {
    const createPermission = this.permissionRepo.create(createPermissionDto);
    return this.permissionRepo.save(createPermission);
  }
  batchCreate(createPermissionDtos: CreatePermissionDto[]) {
    const permissions = this.permissionRepo.create(createPermissionDtos);
    return this.permissionRepo.save(permissions);
  }
  findAll() {
    return this.permissionRepo.find({ where: { type: 'MENU' } });
  }
  findAllParent() {
    return this.permissionRepo.find({ where: { parentId: IsNull() } });
  }
  async findAllTree() {
    const permissions = await this.permissionRepo.find({ order: { order: 'ASC' } });
    return this.sharedService.handleTree(permissions);
  }

  async findMenuTree() {
    const permissions = await this.permissionRepo.find({
      where: { type: 'MENU' },
      order: { order: 'ASC' },
    });
    return this.sharedService.handleTree(permissions);
  }

  async findOne(id: string) {
    const [permission] = await this.permissionRepo.find({ where: { id } });
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const [permission] = await this.permissionRepo.find({ where: { id } });
    if (!permission) throw new BadRequestException('权限不存在或者已删除');
    const newPermission = this.permissionRepo.merge(permission, updatePermissionDto);
    await this.permissionRepo.save(newPermission);
    return true;
  }

  // TODO 递归删除所有子孙权限
  async remove(id: string) {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: { roles: true },
    });
    if (!permission) throw new BadRequestException('权限不存在或者已删除');
    if (permission.roles?.length)
      throw new BadRequestException('当前权限存在已授权的角色，不允许删除！');
    await this.permissionRepo.remove(permission);
    return true;
  }

  findButton(parentId: string) {
    return this.permissionRepo.find({
      where: { parentId, type: In(['BUTTON']) },
    });
  }

  async validateMenuPath(path: string) {
    const allMenu = await this.permissionRepo.find({
      where: { type: 'MENU' },
    });
    return allMenu.some((menu) => menu.path && pathToRegexp(menu.path).test(path))
  }
}
