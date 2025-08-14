import { Controller, Get } from '@nestjs/common';
import { h11_zybhService } from './h11_zybh.service';

@Controller('h11_zybh')
export class h11_zybhController {
  constructor(private readonly h11_zybhService: h11_zybhService) {}

  @Get('findCurrentZYBH')
  async findCurrentZYBH() {
    const results = await this.h11_zybhService.findCurrentZYBH();
    return results;
  }
}
