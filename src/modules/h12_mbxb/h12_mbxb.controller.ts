// src/h12_mbxb/h12_mbxb.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { H12_mbxbService } from './h12_mbxb.service';
import { CreateH12_mbxbDto, UpdateH12_mbxbDto, H12_mbxbResponseDto } from './h12_mbxb.dto';

@Controller('h12-mbxb')
export class H12_mbxbController {
  constructor(private readonly h12MbxbService: H12_mbxbService) {}

  @Get()
  async findAll(): Promise<H12_mbxbResponseDto[]> {
    return this.h12MbxbService.findAll();
  }

  @Get(':mbid/:mblx/:mxxh')
  async findOne(
    @Param('mbid') mbid: string,
    @Param('mblx') mblx: number,
    @Param('mxxh') mxxh: number,
  ): Promise<H12_mbxbResponseDto | null> {
    return this.h12MbxbService.findOne(mbid, mblx, mxxh);
  }

  @Post()
  async create(@Body() createDto: CreateH12_mbxbDto): Promise<H12_mbxbResponseDto> {
    return this.h12MbxbService.create(createDto);
  }

  @Put(':mbid/:mblx/:mxxh')
  async update(
    @Param('mbid') mbid: string,
    @Param('mblx') mblx: number,
    @Param('mxxh') mxxh: number,
    @Body() updateDto: UpdateH12_mbxbDto,
  ): Promise<H12_mbxbResponseDto | null> {
    return this.h12MbxbService.update(mbid, mblx, mxxh, updateDto);
  }

  @Delete(':mbid/:mblx/:mxxh')
  async delete(
    @Param('mbid') mbid: string,
    @Param('mblx') mblx: number,
    @Param('mxxh') mxxh: number,
  ): Promise<void> {
    return this.h12MbxbService.delete(mbid, mblx, mxxh);
  }
}
