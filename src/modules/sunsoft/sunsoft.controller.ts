import { Controller, Body, Param, All, Req, UseGuards } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { JwtGuard } from '@/common/guards';
import { SunsoftService } from './sunsoft.service';

// @UseGuards(JwtGuard)
@Controller('sunsoft')
export class SunsoftController {
  constructor(
    // private readonly httpService: HttpService,
    private readonly sunsoftService: SunsoftService,
  ) {}

  @All(':serviceName/:method')
  async forwardRequest(
    @Param('serviceName') serviceName: string,
    @Param('method') method: string,
    @Body() body: any,
    @Req() request: any,
  ) {
    return this.sunsoftService.forwardRequest(serviceName, method, body, request);
  }
}
