import { Controller, Get, Post, Put, Delete, Body, Query } from '@nestjs/common'
import { syspar_newService } from './syspar_new.service';

import { syspar } from './syspar.entity';
import { QueryDto } from './dto';


@Controller('syspar_new')
export class syspar_newController {

  constructor(private readonly syspar_newService: syspar_newService) { }

  @Get('getRegisterMode')
  async getRegisterMode() {
    return this.syspar_newService.getRegisterMode();
  }

  @Get('findSysparAll')
  async findSysparAll(@Query() queryDto: QueryDto) {
    const results = await this.syspar_newService.findSysparAll(queryDto);
    return { pageData: results, total: results.length };
  }

  @Get('findDefaultPharmacy')
  async findDefaultPharmacy(@Query() data: { ksid: string }) {
    const results = await this.syspar_newService.findOrCreateDefaultPharmacy(data.ksid);
    return { pageData: results, total: results.length };
  }

  @Get('findAutoDiagnosisFee')
  async findAutoDiagnosisFee() {
    const record = await this.syspar_newService.findAutoDiagnosisFee();
    return { record };
  }

  @Post('saveDefaultPharmacy')
  async saveDefaultPharmacy(@Body() data: { data: syspar[] }) {
    await this.syspar_newService.saveDefaultPharmacy(data?.data || []);
  }
}
