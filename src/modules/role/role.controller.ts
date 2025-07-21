import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  AddRolePermissionsDto,
  AddRoleUsersDto,
  CreateRoleDto,
  GetRolesDto,
  QueryRoleDto,
  UpdateRoleDto,
} from './dto';
import { JwtGuard, PreviewGuard, RoleGuard } from '@/common/guards';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('role')
@UseGuards(JwtGuard, RoleGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll(@Query() query: GetRolesDto) {
    return this.roleService.findAll(query);
  }

  @Get('page')
  findPagination(@Query() queryDto: QueryRoleDto) {
    return this.roleService.findPagination(queryDto);
  }

  @Get('permissions')
  findRolePermissions(@Query('id') id: string) {
    return this.roleService.findRolePermissions(id);
  }

  @Get('permissions/tree')
  findRolePermissionsTree(@Request() req: any) {
    return this.roleService.findRolePermissionsTree(req.user.currentRoleCode);
  }

  @Get('modules')
  findRoleModule(@Request() req: any, @Query('permissions') permissions: boolean) {
    return this.roleService.findRoleModule(req?.user?.currentRoleCode, permissions);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Post()
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Patch(':id')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN', 'ROLE_PMS')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Post('permissions/add')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  addRolePermissions(@Body() dto: AddRolePermissionsDto) {
    return this.roleService.addRolePermissions(dto);
  }

  // 给角色分配用户
  @Patch('users/add/:roleId')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  addRoleUsers(@Param('roleId') roleId: string, @Body() dto: AddRoleUsersDto) {
    return this.roleService.addRoleUsers(roleId, dto);
  }

  // 给角色取消分配用户
  @Patch('users/remove/:roleId')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  removeRoleUsers(@Param('roleId') roleId: string, @Body() dto: AddRoleUsersDto) {
    return this.roleService.removeRoleUsers(roleId, dto);
  }
}
