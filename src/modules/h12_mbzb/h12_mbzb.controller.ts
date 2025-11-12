// src/h12_mbzb/h12_mbzb.controller.ts
import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { H12_mbzbService } from './h12_mbzb.service';
import {
  CreateH12_mbzbDto,
  UpdateH12_mbzbDto,
  QueryH12_mbzbDto,
  H12_mbzbResponseDto,
  H12_mbSaveDto,
} from './h12_mbzb.dto';

@Controller('h12-mbzb')
export class H12_mbzbController {
  constructor(private readonly h12MbzbService: H12_mbzbService) {}

  @Get()
  async findAll(@Query() queryDto: QueryH12_mbzbDto) {
    return this.h12MbzbService.findAll(queryDto);
  }

  @Get(':mbid/:mblx')
  async findOne(
    @Param('mbid') mbid: string,
    @Param('mblx') mblx: number,
  ): Promise<H12_mbzbResponseDto | null> {
    return this.h12MbzbService.findOne(mbid, mblx);
  }

  @Post()
  async create(@Body() createDto: CreateH12_mbzbDto): Promise<H12_mbzbResponseDto> {
    return this.h12MbzbService.create(createDto);
  }

  @Post('saveMb')
  async saveMb(@Body() h12_mbSaveDto: H12_mbSaveDto) {
    return this.h12MbzbService.saveMb(h12_mbSaveDto);
  }

  @Put(':mbid/:mblx')
  async update(
    @Param('mbid') mbid: string,
    @Param('mblx') mblx: number,
    @Body() updateDto: UpdateH12_mbzbDto,
  ): Promise<H12_mbzbResponseDto | null> {
    return this.h12MbzbService.update(mbid, mblx, updateDto);
  }

  @Delete(':mbid/:mblx')
  async delete(@Param('mbid') mbid: string, @Param('mblx') mblx: number): Promise<void> {
    return this.h12MbzbService.delete(mbid, mblx);
  }
}
