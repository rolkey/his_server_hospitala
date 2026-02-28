import { Controller, Get, Post, Body, Query, Req, Put } from '@nestjs/common';
import { HisTechService } from './his-tech.service';
import { ConfigDto, Execute0Dto, Execute1Dto, QueryParamsDto, YzDetailDto } from './his-tech.dto';
import { Request } from 'express';

@Controller('his-tech')
export class HisTechController {
  constructor(private readonly hisTechService: HisTechService) {}

  private getIp(request: Request): string {
    let ip =
      (request.headers['x-forwarded-for'] as string) ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      (request.connection as any).socket?.remoteAddress;

    // 如果是IPv4映射的IPv6地址，转换为IPv4
    if (ip && ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7);
    }

    // 如果是localhost或::1，转换为127.0.0.1
    if (ip === '::1' || ip === 'localhost') {
      ip = '127.0.0.1';
    }

    // 如果有多个代理IP，取第一个
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    return ip || '127.0.0.1';
  }

  @Get('config')
  getConfig(@Req() request: Request) {
    return this.hisTechService.getConfig(this.getIp(request));
  }

  @Post('config')
  changeConfig(@Req() request: Request, @Body() saveDto: ConfigDto) {
    return this.hisTechService.changeConfig(this.getIp(request), saveDto);
  }

  @Get('brxxs')
  queryBrxxs(@Req() request: Request, @Query() queryDto: QueryParamsDto) {
    return this.hisTechService.queryBrxxs(this.getIp(request), queryDto);
  }

  @Get('detail0')
  async queryDetail0(@Req() request: Request, @Query() queryDto: QueryParamsDto) {
    return this.hisTechService.queryDetail0(this.getIp(request), queryDto);
  }

  @Get('detail1')
  async queryDetail1(@Req() request: Request, @Query() queryDto: QueryParamsDto) {
    return this.hisTechService.queryDetail1(this.getIp(request), queryDto);
  }

  @Put('execute0')
  async execute0(@Body() queryDto: Execute0Dto) {
    return this.hisTechService.execute0(queryDto);
  }

  @Put('execute1')
  async execute1(@Body() queryDto: Execute1Dto) {
    return this.hisTechService.execute1(queryDto);
  }
}
