import { Controller, Get, Query } from '@nestjs/common';
import { Jbbmicd10Service } from './jbbmicd10.service';
import { Queryjbbmicd10Dto } from './dto';

@Controller('jbbmicd')
export class Jbbmicd10Controller {
  constructor(private readonly jbbmicd10Service: Jbbmicd10Service) {}

  @Get()
  async findAll(@Query() dto: Queryjbbmicd10Dto) {
    return await this.jbbmicd10Service.findAll(dto);
  }
}
