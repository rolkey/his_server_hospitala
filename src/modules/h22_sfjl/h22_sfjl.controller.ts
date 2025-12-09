// src/h22-sfjl/h22-sfjl.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { H22SfjlService } from './h22_sfjl.service';
import {
  CreateH22SfjlDto,
  UpdateH22SfjlDto,
  QueryH22SfjlDto,
  QueryCheckoutDateDto,
} from './h22_sfjl.dto';

@Controller('h22_sfjl')
export class H22SfjlController {
  constructor(private readonly service: H22SfjlService) {}

  // @Post()
  // create(@Body() dto: CreateH22SfjlDto) {
  //   return this.service.create(dto);
  // }

  @Get('findAll')
  findAll(@Query() queryDto: QueryH22SfjlDto) {
    return this.service.findAll(queryDto);
  }

  // @Get(':lsh')
  // findOne(@Param('lsh') lsh: string) {
  //   return this.service.findOne(lsh);
  // }

  @Get('findCheckoutDate')
  findCheckoutDate(@Query() dto: QueryCheckoutDateDto) {
    return this.service.findCheckoutDate(dto);
  }

  // @Patch(':lsh')
  // update(@Param('lsh') lsh: string, @Body() dto: UpdateH22SfjlDto) {
  //   return this.service.update(lsh, dto);
  // }

  // @Delete(':lsh')
  // remove(@Param('lsh') lsh: string) {
  //   return this.service.remove(lsh);
  // }
}
