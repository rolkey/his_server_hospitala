

import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  usid: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  pwrd: string;
}

export class RegisterUserDto {
  @IsString()
  @Length(3, 20, {
    message: `用户名长度必须是$constraint1到$constraint2之间，当前传递的值是$value`,
  })
  usid: string;

  @IsString()
  @Length(3, 20, { message: `密码长度必须是$constraint1到$constraint2之间` })
  pwrd: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string;

  @IsString()
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}
