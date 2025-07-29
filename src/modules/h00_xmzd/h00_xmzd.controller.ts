// H00XmzdController.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { H00_xmzdService } from './h00_xmzd.service';

@Controller('h00-xmzd')
export class H00_xmzdController {
  constructor(private readonly h00_xmzdService: H00_xmzdService) {}

  @Get()
  async findAll() {
    return this.h00_xmzdService.findAll();
  }

  @Get(':xmzl/:xmid/:ggxh')
  async findOne(
    @Param('xmzl') xmzl: number,
    @Param('xmid') xmid: string,
    @Param('ggxh') ggxh: string,
  ) {
    return this.h00_xmzdService.findOne(+xmzl, xmid, ggxh);
  }
}
