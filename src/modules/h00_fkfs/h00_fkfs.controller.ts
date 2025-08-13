import { Controller, Get } from '@nestjs/common';
import { h00_fkfsService } from './h00_fkfs.service';

@Controller('h00_fkfs')
export class h00_fkfsController {
  constructor(private readonly h00_fkfsService: h00_fkfsService) {}

  @Get('findZY')
  async findZY() {
    const results = await this.h00_fkfsService.findZY();
    return { pageData: results, total: results.length };
  }
}
