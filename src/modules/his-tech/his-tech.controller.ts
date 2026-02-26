import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import { HisTechService } from './his-tech.service';
import { ConfigDto, QueryParamsDto } from './his-tech.dto';
import { Request } from 'express';

@Controller('his-tech')
export class HisTechController {
  constructor(private readonly hisTechService: HisTechService) {}

  private getIp(request: Request): string {
    return (
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      (request.connection as any).socket?.remoteAddress
    );
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
}
