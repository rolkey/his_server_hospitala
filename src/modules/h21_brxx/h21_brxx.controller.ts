import { Controller, Get, Query } from '@nestjs/common';
import { h21_brxxService } from './h21_brxx.service';

@Controller('h21_brxx')
export class h21_brxxController {
  constructor(private readonly h21BrxxService: h21_brxxService) {}

  /**
   * 根据门诊ID(mzid)查询病人信息
   * GET /h21_brxx/findByMzid?mzid=xxx
   */
  @Get('findByMzid')
  async findByMzid(@Query('mzid') mzid: string) {
    const record = await this.h21BrxxService.findOneByMzid(mzid);
    return { record };
  }
}
