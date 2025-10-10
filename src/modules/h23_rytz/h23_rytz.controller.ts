import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H23RytzService } from './h23_rytz.service';
import { CreateH23RytzDto, UpdateH23RytzDto, H23RytzQueryDto } from './h23_rytz.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('h23_rytz')
export class H23RytzController {
  constructor(private readonly h23RytzService: H23RytzService) {}

  @Get('findAll')
  findAll(@Query() queryDto: H23RytzQueryDto) {
    return this.h23RytzService.findAll(queryDto);
  }

  // @Get(':tzdh')
  // findOne(@Param('tzdh') tzdh: string) {
  //   return this.h23RytzService.findOne(tzdh);
  // }
}
