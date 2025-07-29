// src/controllers/sfxm.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SfxmService } from './service/sfxm.service';
import { SfxmQueryDto } from './dto/sfxm-query.dto';
import { ConfigReaderService } from './service/config-reader.service';

@Controller('sfxm')
export class SfxmController {
  constructor(
    private readonly sfxmService: SfxmService,
    private readonly configReaderService: ConfigReaderService,
  ) {}

  @Get('h13_sfxm')
  async getSfxmData(@Query() query: SfxmQueryDto) {
    return this.sfxmService.getSfxmData(query);
  }

  @Get('ksids')
  async getKsConfigs(@Query('id') ksid: string) {
    return this.sfxmService.initParams(ksid);
  }

  @Get('gs_cxsz')
  async getGsCxsz() {
    return this.configReaderService.readGsCxsz();
  }

  @Get('gstr_ainf')
  async getGstrAinf() {
    return this.configReaderService.readGstrAinf();
  }

  @Get('g_configs')
  async getGConfigs() {
    return this.configReaderService.readGConfigs();
  }

  @Get('configs')
  async getAllConfigs() {
    return this.configReaderService.readAllConfigs();
  }
}
