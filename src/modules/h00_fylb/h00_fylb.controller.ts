import { Controller } from '@nestjs/common';
import { h00_fylbService } from './h00_fylb.service';

@Controller('h00_fylb')
export class h00_fylbController {
  constructor(private readonly h00_fylbService: h00_fylbService) {}

  async findAll() {
    const results = await this.h00_fylbService.findAll();
    return { pageData: results, total: results.length };
  }
}
