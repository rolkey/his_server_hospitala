import { Controller, Get } from '@nestjs/common';
import { h11_zybhService } from './h11_zybh.service';

@Controller('h11_zybh')
export class h11_zybhController {
  constructor(private readonly h11_zybhService: h11_zybhService) {}

  @Get('findZY')
  async findOne() {
    const results = await this.h11_zybhService.findOne();
    return results;
  }
}
