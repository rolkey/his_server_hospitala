import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { h11_lshService } from './h11_lsh.service';
import { Createh11_lshDto } from './h11_lsh.dto';
import { h11_lsh } from './h11_lsh.entity';

@Controller('h11_lsh')
export class h11_lshController {
  constructor(private readonly h11_lshService: h11_lshService) {}

  @Get('getMax')
  async getMax(@Query() createh11_lshDto: Createh11_lshDto): Promise<number> {
    const { tname, inc_value } = createh11_lshDto;
    return this.h11_lshService.getMax(tname, inc_value);
  }

  @Get('getSerialNumber')
  async getSerialNumber(): Promise<string> {
    return this.h11_lshService.getSerialNumber('ZYID', '住院ID号', 12);
  }
}
