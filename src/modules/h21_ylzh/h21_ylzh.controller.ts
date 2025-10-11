import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H21YlzhService } from './h21_ylzh.service';
import { CreateH21YlzhDto, UpdateH21YlzhDto, H21YlzhQueryDto } from './h21_ylzh.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('h21_ylzh')
export class H21YlzhController {
  constructor(private readonly h21YlzhService: H21YlzhService) {}

  @Get('findAll')
  findAll(@Query() queryDto: H21YlzhQueryDto) {
    return this.h21YlzhService.findAll(queryDto);
  }

  @Get(':ylzh')
  findOne(@Param('ylzh') ylzh: string) {
    return this.h21YlzhService.findOne(ylzh);
  }
}
