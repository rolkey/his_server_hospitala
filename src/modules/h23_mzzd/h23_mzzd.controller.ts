import { Controller, Get, Query } from '@nestjs/common';
import { H23MzzdService } from './h23_mzzd.service';

@Controller('h23_mzzd')
export class H23MzzdController {
  constructor(private readonly h23MzzdService: H23MzzdService) {}

  /**
   * 根据门诊ID(mzid)查询门诊诊断列表
   * GET /h23_mzzd/findByMzid?mzid=xxx
   */
  @Get('findByMzid')
  async findByMzid(@Query('mzid') mzid: string) {
    const list = await this.h23MzzdService.findByMzid(mzid);
    return { list };
  }
}
