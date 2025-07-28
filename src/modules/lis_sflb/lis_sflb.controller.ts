// src/lis_sflb/lis_sflb.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Lis_sflbService } from './lis_sflb.service';
import { CreateLisSflbDto, UpdateLisSflbDto, LisSflbResponseDto } from './lis_sflb.dto';

@Controller('lis-sflb')
export class Lis_sflbController {
  constructor(private readonly lisSflbService: Lis_sflbService) {}

  @Get()
  async findAll(): Promise<LisSflbResponseDto[]> {
    return this.lisSflbService.findAll();
  }

  @Get(':lbcode')
  async findOne(@Param('lbcode') lbcode: string): Promise<LisSflbResponseDto | null> {
    return this.lisSflbService.findOne(lbcode);
  }

  @Post()
  async create(@Body() createDto: CreateLisSflbDto): Promise<LisSflbResponseDto> {
    return this.lisSflbService.create(createDto);
  }

  @Put(':lbcode')
  async update(
    @Param('lbcode') lbcode: string,
    @Body() updateDto: UpdateLisSflbDto,
  ): Promise<LisSflbResponseDto | null> {
    return this.lisSflbService.update(lbcode, updateDto);
  }

  @Delete(':lbcode')
  async delete(@Param('lbcode') lbcode: string): Promise<void> {
    return this.lisSflbService.delete(lbcode);
  }
}
