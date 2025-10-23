import { Controller, Get, Query } from '@nestjs/common';
import { csxzService } from './csxz.service';
import { CsxzQueryDto } from './dto/csxz-query-dto';

@Controller('csxz')
export class csxzController {
  constructor(private readonly csxzService: csxzService) {}

  @Get('findAllPersonnelCategory')
  async findAllPersonnelCategory() {
    const results = await this.csxzService.findAllPersonnelCategory();
    return { pageData: results, total: results.length };
  }

  @Get('findAll')
  async findAll(@Query() csxzQueryDto: CsxzQueryDto) {
    const results = await this.csxzService.findAll(csxzQueryDto);
    return { pageData: results, total: results.length };
  }
}
