import { Controller, Get } from '@nestjs/common';
import { csxzService } from './csxz.service';

@Controller('csxz')
export class csxzController {
  constructor(private readonly csxzService: csxzService) {}

  @Get('findAllPersonnelCategory')
  async findAllPersonnelCategory() {
    const results = await this.csxzService.findAllPersonnelCategory();
    return { pageData: results, total: results.length };
  }
}
