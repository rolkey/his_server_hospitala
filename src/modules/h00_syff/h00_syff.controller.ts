import { Controller, Get, Query } from '@nestjs/common';
import { h00_syffService } from './h00_syff.service';

@Controller('h00_syff')
export class h00_syffController {
  constructor(private readonly h00_syffService: h00_syffService) {}

  @Get('findAllFiltered')
  async findAllFiltered(@Query() data: { ksid: string }) {
    const record = await this.h00_syffService.findAllFiltered(data.ksid);
    return { record };
  }
}
