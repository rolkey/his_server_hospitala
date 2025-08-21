import { Exclude } from 'class-transformer';
import { Allow, IsArray, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '账号不能为空' })
  @Length(3, 20, {
    message: `账号长度必须大于$constraint1到$constraint2之间，当前传递的值是$value`,
  })
  usid: string;

  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 20, {
    message: `用户名长度必须大于$constraint1到$constraint2之间，当前传递的值是$value`,
  })
  @IsOptional()
  unam?: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(3, 20, { message: `密码长度必须大于$constraint1到$constraint2之间` })
  pwrd: string;
  // @IsBoolean()
  // @IsOptional()
  // enable?: boolean;

  @IsOptional()
  @IsArray()
  roleIds?: string[];

  @IsOptional()
  // @IsNumber()
  zhjy?: number;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: '账号不能为空' })
  @Length(3, 20, {
    message: `账号长度必须大于$constraint1到$constraint2之间，当前传递的值是$value`,
  })
  usid: string;

  @Exclude()
  pwrd: string;

  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 20, {
    message: `用户名长度必须大于$constraint1到$constraint2之间，当前传递的值是$value`,
  })
  @IsOptional()
  unam?: string;

  @IsOptional()
  // @IsNumber()
  zhjy?: number;

  @IsOptional()
  @IsArray()
  roleIds?: string[];
}

export class UpdateProfileDto {}

export class GetUserDto {
  @Allow()
  pageSize?: number;

  @Allow()
  pageNo?: number;

  @Allow()
  unam?: string;

  // @Allow()
  // gender?: number;

  @Allow()
  role?: string;

  @IsOptional()
  // @IsNumber()
  zhjy?: number;
}

export class AddUserRolesDto {
  @IsArray()
  roleIds: string[];
}
export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(3, 20, { message: `密码长度必须大于$constraint1到$constraint2之间` })
  pwrd: string;
}
