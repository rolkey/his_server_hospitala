import { Exclude } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色编码不能为空' })
  code: string;

  @IsNotEmpty({ message: '角色名不能为空' })
  name: string;

  @IsOptional()
  @IsArray()
  permissionIds: string[];

  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @IsNotEmpty({ message: '角色首页不能为空' })
  home: string;

  @IsOptional()
  @IsArray()
  moduleIds: string[];
}

export class GetRolesDto {
  @IsOptional()
  enable?: boolean;
}

export class UpdateRoleDto {
  @Exclude()
  code: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  permissionIds?: string[];

  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @IsNotEmpty({ message: '角色首页不能为空' })
  home: string;

  @IsOptional()
  @IsArray()
  moduleIds: string[];
}

export class AddRolePermissionsDto {
  @IsString()
  id: string;

  @IsArray()
  permissionIds: string[];
}

export class AddRoleUsersDto {
  @IsArray()
  userIds: string[];
}

export class AddRoleButtonsDto {
  @IsNumber()
  id: string;

  @IsString()
  menuId: string;

  @IsArray()
  buttons: string[];
}

export class QueryRoleDto {
  @Allow()
  pageSize?: number;

  @Allow()
  pageNo?: number;

  @Allow()
  name?: string;

  @Allow()
  enable?: boolean;
}
