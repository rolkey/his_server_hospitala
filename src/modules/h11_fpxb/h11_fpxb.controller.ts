import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H11FpxbService } from './h11_fpxb.service';
import { H11FpxbQueryDto } from './h11_fpxb.dto';

@Controller('h11_fpxb')
export class H11FpxbController {
  constructor(private readonly h11FpxbService: H11FpxbService) {}

  @Get('findAllNotPage')
  findAllNotPage(@Query() queryDto: H11FpxbQueryDto) {
    return this.h11FpxbService.findAllNotPage(queryDto);
  }
}
