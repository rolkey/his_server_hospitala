import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { compareSync } from 'bcryptjs';
// import { UserService } from '@/modules/user/user.service';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import { RedisService } from '@/shared/redis.service';
import { ACCESS_TOKEN_EXPIRATION_TIME, USER_ACCESS_TOKEN_KEY } from '@/constants/redis.contant';
import { ConfigService } from '@nestjs/config';
import { UsrcatService } from '../usrcat/usrcat.service';

@Injectable()
export class AuthService {
  constructor(
    // private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
    private userService: UsrcatService,
  ) {}

  async validateUser(usid: string, password: string) {
    const user = await this.userService.findByUsid(usid);
    // if (user && compareSync(password, user.pwrd)) {
    if (user && password == user.pwrd.trim()) {
      const { pwrd, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any, captcha?: string) {
    // 判断用户是否有enable属性为true的角色
    // if (!user.roles?.some((item) => item.enable)) {
    //   throw new CustomException(ErrorCode.ERR_11003);
    // }

    const roleCodes = user.roles?.map((item) => item.code);
    const currentRole = user.roles[0];
    const payload = {
      usid: user.usid,
      unam: user.unam,
      roleCodes,
      currentRoleCode: currentRole?.code || '',
    };
    console.log('----------------login', payload);
    if (this.configService.get('IS_PREVIEW') === 'true') payload['captcha'] = captcha;
    return this.generateToken(payload);
  }

  generateToken(payload: any) {
    const accessToken = this.jwtService.sign(payload);
    this.redisService.set(
      this.getAccessTokenKey(payload),
      accessToken,
      ACCESS_TOKEN_EXPIRATION_TIME,
    );
    return {
      accessToken,
    };
  }

  async switchCurrentRole(payload: any, roleCode: string) {
    const user = await this.userService.findByUsid(payload.usid);
    // if (!user.roles?.some((item) => item.enable)) {
    //   throw new CustomException(ErrorCode.ERR_11003);
    // }
    const roleCodes = user.roles.map((item) => item.code);
    const currentRole = user.roles.find((item) => item.code === roleCode);
    if (!currentRole) {
      throw new CustomException(ErrorCode.ERR_11005, '您目前暂无此角色，请联系管理员申请权限');
    }
    payload = { ...payload, roleCodes, currentRoleCode: currentRole.code };
    return this.generateToken(payload);
  }

  async logout(user: any) {
    if (user.usid) {
      await Promise.all([this.redisService.del(this.getAccessTokenKey(user))]);
      return true;
    }
    return false;
  }

  getAccessTokenKey(payload: any) {
    console.log('----------------getAccessTokenKey', payload);
    return `${USER_ACCESS_TOKEN_KEY}:${payload.usid}${
      payload.captcha ? ':' + payload.captcha : ''
    }`;
  }
}
