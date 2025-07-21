/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/07 20:26:53
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { Exclude } from 'class-transformer';
import { Allow, IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateDto {
  @IsNotEmpty({ message: '模块名不能为空' })
  name: string;

  @IsNotEmpty({ message: '模块标题不能为空' })
  title: string;

  @IsNotEmpty({ message: '模块图标不能为空' })
  icon: string;

  @IsNotEmpty({ message: '模块路径不能为空' })
  path: string;

  @IsOptional()
  logo: string;

  @IsOptional()
  notes: string;

  @IsOptional()
  category: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsOptional()
  @IsArray()
  permissionIds: string[];
}

export class UpdateDto {
  @Exclude()
  id: string;

  @IsNotEmpty({ message: '模块名不能为空' })
  name: string;

  @IsNotEmpty({ message: '模块名不能为空' })
  title: string;

  @IsNotEmpty({ message: '模块图标不能为空' })
  icon: string;

  @IsNotEmpty({ message: '模块路径不能为空' })
  path: string;

  @IsOptional()
  logo: string;

  @IsOptional()
  notes: string;

  @IsOptional()
  category: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsOptional()
  @IsArray()
  permissionIds: string[];
}

export class QueryDto {
  @Allow()
  pageSize?: number;

  @Allow()
  pageNo?: number;

  @Allow()
  permissions: boolean;
}
