import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H11JsxbService } from './h11_jsxb.service';
import { CreateH11JsxbDto, UpdateH11JsxbDto, H11JsxbQueryDto } from './h11_jsxb.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('h11_jsxb')
export class H11JsxbController {
  constructor(private readonly h11JsxbService: H11JsxbService) {}

  @Get('findAllNotPage')
  findAllNotPage(@Query() queryDto: H11JsxbQueryDto) {
    return this.h11JsxbService.findAllNotPage(queryDto);
  }
}
