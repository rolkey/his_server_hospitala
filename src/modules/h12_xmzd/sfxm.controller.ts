// src/controllers/sfxm.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SfxmService } from './service/sfxm.service';
import { SfxmQueryDto } from './dto/sfxm-query.dto';

@Controller('sfxm')
export class SfxmController {
  constructor(private readonly sfxmService: SfxmService) {}

  @Get('h13_sfxm')
  async getSfxmData(@Query() query: SfxmQueryDto) {
    return this.sfxmService.h13_sfxm(query);
  }
}
