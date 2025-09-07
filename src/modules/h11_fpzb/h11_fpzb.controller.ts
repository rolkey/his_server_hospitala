import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H11FpzbService } from './h11_fpzb.service';
import { CreateH11FpzbDto, UpdateH11FpzbDto, H11FpzbQueryDto } from './h11_fpzb.dto';

@Controller('h11_fpzb')
export class H11FpzbController {
  constructor(private readonly h11FpzbService: H11FpzbService) {}

  @Post('create')
  create(@Body() createH11FpzbDto: CreateH11FpzbDto) {
    return this.h11FpzbService.create(createH11FpzbDto);
  }

  @Get('findAll')
  findAll(@Query() queryDto: H11FpzbQueryDto) {
    return this.h11FpzbService.findAll(queryDto);
  }

  @Get(':fphm/:kshm')
  findOne(@Param('fphm') fphm: string, @Param('kshm') kshm: string) {
    return this.h11FpzbService.findOne(fphm);
  }

  // @Get('')
  // cancel(@Param('jsdh') jsdh: string) {
  //   return this.h11FpzbService.cancel(jsdh);
  // }
}
