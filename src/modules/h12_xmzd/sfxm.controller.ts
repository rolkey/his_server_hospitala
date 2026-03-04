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
  async getKsConfigs(@Query('ksid') ksid: string) {
    return this.configReaderService.getKsids(ksid);
  }

  @Get('gs_cxsz')
  async getGsCxsz() {
    return this.configReaderService.readGsCxsz();
  }

  //   @Get('gstr_ainf')
  //   async getGstrAinf() {
  //     return this.configReaderService.readGstrAinf();
  //   }

  @Get('g_configs')
  async getGConfigs() {
    return this.configReaderService.readGConfigs();
  }

  @Get('configs')
  async getAllConfigs(@Query() data: { userId: string; systemId: string }) {
    return this.configReaderService.readAllConfigs(data);
  }

  @Get('ssap-configs')
  async ssapConfigs(@Query() data: { userId: string; systemId: string }) {
    return this.configReaderService.readAllConfigs(data);
  }

  @Get('querySfxm')
  async querySfxm(
    @Query()
    query: {
      xmzl?: string;
      fylbid?: string;
      ypflbm?: string;
      value: string;
      pageNo: number;
      pageSize: number;
      ksid: string;
      ksid1: string;
      ksid2: string;
      ksid3: string;
      ksid4: string;
      ksid5: string;
      ksid6: string;
      ksid7: string;
      ksid8: string;
    },
  ) {
    return this.sfxmService.querySfxm(query);
  }
}
