import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsrcatService } from './usrcat.service';

import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import { JwtGuard, PreviewGuard, RoleGuard } from '@/common/guards';
import { Roles } from '@/common/decorators/roles.decorator';
import {
  AddUserRolesDto,
  CreateUserDto,
  GetUserDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateUserDto,
} from './dto';

@Controller('user')
@UseGuards(JwtGuard, RoleGuard)
export class UsrcatController {
  constructor(private readonly userService: UsrcatService) {}

  @Post()
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  addUser(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Get()
  async getAllUsers(@Query() queryDto: GetUserDto) {
    return this.userService.findAll(queryDto);
  }

  @Delete(':id')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  async deleteUser(@Param('id') id: string, @Request() req: any) {
    const currentUser = req.user;
    if (currentUser.userId === id)
      throw new CustomException(ErrorCode.ERR_11006, '非法操作，不能删除自己！');
    const user = await this.userService.findById(id);
    if (user.unam.trim() == 'admin')
      throw new CustomException(ErrorCode.ERR_11006, '非法操作，不能删除admin！');
    return this.userService.remove(id);
  }

  @Patch(':id')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findById(id);
    if (Object.prototype.hasOwnProperty.call(updateUserDto, 'enable') && user.usid == 'admin')
      throw new CustomException(ErrorCode.ERR_11006, '非法操作，不能停用admin！');

    if (
      Object.prototype.hasOwnProperty.call(updateUserDto, 'roleIds') &&
      !updateUserDto.roleIds.includes('1') &&
      user.usid == 'admin'
    )
      throw new CustomException(ErrorCode.ERR_11006, '非法操作，admin不能取消超级管理员角色！');

    return this.userService.update(id, updateUserDto);
  }

  /**
   * @desc 修改用户资料
   */
  @Patch('/profile/:id')
  @UseGuards(PreviewGuard)
  updateProfile(@Body() profile: UpdateProfileDto, @Param('id') id: string, @Request() req: any) {
    const currentUser = req.user;
    // 只能本人修改
    if (currentUser.usid.trim() !== id)
      throw new CustomException(ErrorCode.ERR_11004, '越权操作，用户资料只能本人修改！');
    return this.userService.updateProfile(id, profile);
  }

  /**
   * @desc 获取当前登录用户的详情信息
   */
  @Get('detail')
  getUserInfo(@Request() req: any) {
    const currentUser = req.user;
    return this.userService.findUserDetail(currentUser.usid, currentUser.currentRoleCode);
  }

  @Get(':username')
  @Roles('SUPER_ADMIN')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsid(username);
  }

  // 查询用户的profile
  @Get('profile/:userId')
  getUserProfile(@Param('userId') userId: string, @Request() req: any) {
    // 涉及隐私信息，只能本人或者超管查询
    const currentUser = req.user;
    // 只能本人或者超管查询
    if (currentUser.usid.trim() === userId.trim() || currentUser.roles.includes('SUPER_ADMIN')) {
      return this.userService.findByUsid(userId);
    }
    throw new CustomException(ErrorCode.ERR_11003);
  }

  /** 给用户赋角色 */
  @Post('roles/add/:userId')
  @Roles('SUPER_ADMIN')
  @UseGuards(PreviewGuard)
  addRoles(@Param('userId') userId: string, @Body() dto: AddUserRolesDto) {
    return this.userService.addRoles(userId, dto.roleIds);
  }

  /** 管理员重置密码 */
  @Patch('password/reset/:userId')
  @Roles('SUPER_ADMIN')
  @UseGuards(PreviewGuard)
  resetPassword(@Param('userId') userId: string, @Body() dto: UpdatePasswordDto) {
    return this.userService.resetPassword(userId, dto.pwrd);
  }
}
