// src/modules/h30_ypzd/h30_ypzd.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { H30_ypzdService } from './h30_ypzd.service';
import {
  CreateH30_ypzdDto,
  UpdateH30_ypzdDto,
  QueryH30_ypzdDto,
  H30_ypzdResponseDto,
} from './h30_ypzd.dto';

@Controller('h30-ypzd')
export class H30_ypzdController {
  constructor(private readonly h30YpzdService: H30_ypzdService) {}

  @Post()
  async create(@Body() createDto: CreateH30_ypzdDto): Promise<H30_ypzdResponseDto> {
    return await this.h30YpzdService.create(createDto);
  }

  @Get()
  async findAll(@Query() query: QueryH30_ypzdDto): Promise<[H30_ypzdResponseDto[], number]> {
    return await this.h30YpzdService.findAll(query);
  }

  @Get(':ypid')
  async findOne(@Param('ypid') ypid: string): Promise<H30_ypzdResponseDto | null> {
    return await this.h30YpzdService.findOne(ypid);
  }

  @Patch(':ypid')
  async update(@Param('ypid') ypid: string, @Body() updateDto: UpdateH30_ypzdDto): Promise<void> {
    await this.h30YpzdService.update(ypid, updateDto);
  }

  @Delete(':ypid')
  async remove(@Param('ypid') ypid: string): Promise<void> {
    await this.h30YpzdService.remove(ypid);
  }
}
