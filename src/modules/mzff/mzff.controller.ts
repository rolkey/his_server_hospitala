// mzff.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MzffService } from './mzff.service';
import { CreateMzffDto, UpdateMzffDto, QueryMzffDto } from './dto/mzff.dto';

@Controller('mzff')
export class MzffController {
  constructor(private readonly mzffService: MzffService) {}

  @Post()
  async create(@Body() createMzffDto: CreateMzffDto) {
    return await this.mzffService.create(createMzffDto);
  }

  @Get()
  async findAll(@Body() queryMzffDto: QueryMzffDto) {
    return await this.mzffService.findByCondition(queryMzffDto);
  }

  @Get(':id')
  async findOne(@Param('id') mzid: string) {
    return await this.mzffService.findByCondition({ mzid });
  }

  @Put()
  async update(@Body() updateMzffDto: UpdateMzffDto) {
    return await this.mzffService.update(updateMzffDto);
  }

  @Delete(':id')
  async remove(@Param('id') mzid: string) {
    return await this.mzffService.remove(mzid);
  }
}
