import { Controller, Get, Query } from '@nestjs/common';
import { ksmcService } from './ksmc.service';

@Controller('ksmc')
export class ksmcController {
  constructor(private readonly ksmcService: ksmcService) {}

  @Get('findHisDept')
  async findHisDept(@Query() queryDto: { usid?: string; usrcats?: boolean; zc?: string }) {
    const results = await this.ksmcService.findHisDept(queryDto);
    return { pageData: results, total: results.length };
  }
  @Get('findAll')
  async findAll() {
    const results = await this.ksmcService.findAll();
    return { pageData: results, total: results.length };
  }
}
