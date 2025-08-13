import { Controller, Get } from '@nestjs/common';
import { h20_jzzbService } from './h20_jzzb.service';

@Controller('h20_jzzb')
export class h20_jzzbController {
  constructor(private readonly h20_jzzbService: h20_jzzbService) {}

  @Get('findAll')
  async findAll() {
    const results = await this.h20_jzzbService.findAll();
    return { pageData: results, total: results.length };
  }
}
