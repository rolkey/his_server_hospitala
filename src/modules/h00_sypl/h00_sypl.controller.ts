import { Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { h00_syplService } from './H00_sypl.service';

@Controller('h00_sypl')
export class h00_syplController {
  constructor(private readonly h00_syplService: h00_syplService) {}

  @Get(':syplid')
  async findOne(@Param('syplid') syplid: string) {
    return this.h00_syplService.findOne(syplid);
  }
}
