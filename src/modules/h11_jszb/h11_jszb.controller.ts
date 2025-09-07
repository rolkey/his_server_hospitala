import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H11JszbService } from './h11_jszb.service';
import { CreateH11JszbDto, UpdateH11JszbDto, H11JszbQueryDto } from './h11_jszb.dto';

@Controller('h11_jszb')
export class H11JszbController {
  constructor(private readonly h11JszbService: H11JszbService) {}

  @Post('create')
  create(@Body() createH11JszbDto: CreateH11JszbDto) {
    return this.h11JszbService.create(createH11JszbDto);
  }

  @Get('findAll')
  findAll(@Query() query: H11JszbQueryDto) {
    return this.h11JszbService.findAll(query);
  }

  @Get('')
  cancel(@Param('jsdh') jsdh: string) {
    return this.h11JszbService.cancel(jsdh);
  }
}
