import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H11YjkService } from './h11_yjk.service';
import { CreateH11YjkDto, UpdateH11YjkDto, H11YjkQueryDto, H11YjkCancelDto } from './h11_yjk.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ParseDatePipe } from './date-parse.pipe';

@ApiTags('预交款管理')
@Controller('h11_yjk')
export class H11YjkController {
  constructor(private readonly h11YjkService: H11YjkService) {}

  @Post('/create')
  create(@Body() createH11YjkDto: CreateH11YjkDto) {
    return this.h11YjkService.create(createH11YjkDto);
  }

  @Get('/findAll')
  findAll(@Query() queryDto: H11YjkQueryDto) {
    return this.h11YjkService.findAll(queryDto);
  }

  @Post('/cancelOrRefund')
  cancelOrRefund(@Body() h11YjkCancelDto: H11YjkCancelDto) {
    return this.h11YjkService.cancelOrRefund(h11YjkCancelDto);
  }

  // @Get(':sjhm/:sfsj')
  // findOne(@Param('sjhm') sjhm: string, @Param('sfsj', ParseDatePipe) sfsj: Date) {
  //   return this.h11YjkService.findOne(sjhm, sfsj);
  // }

  // @Get('zyid/:zyid')
  // findByZyid(@Param('zyid') zyid: string) {
  //   return this.h11YjkService.findByZyid(zyid);
  // }

  // @Patch(':sjhm/:sfsj')
  // update(
  //   @Param('sjhm') sjhm: string,
  //   @Param('sfsj', ParseDatePipe) sfsj: Date,
  //   @Body() updateH11YjkDto: UpdateH11YjkDto,
  // ) {
  //   return this.h11YjkService.update(sjhm, sfsj, updateH11YjkDto);
  // }
}
