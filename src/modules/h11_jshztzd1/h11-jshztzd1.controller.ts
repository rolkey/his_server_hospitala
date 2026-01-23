import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { H11Jshztzd1Service } from './h11-jshztzd1.service';
import {
  CreateH11Jshztzd1Dto,
  UpdateH11Jshztzd1Dto,
  QueryH11Jshztzd1Dto,
  H11Jshztzd1ResponseDto,
} from './h11-jshztzd1.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('h11-jshztzd1')
@Controller('h11-jshztzd1')
export class H11Jshztzd1Controller {
  constructor(private readonly h11Jshztzd1Service: H11Jshztzd1Service) {}

  @Post()
  @ApiOperation({ summary: '创建结算汇总通知单' })
  @ApiResponse({ type: H11Jshztzd1ResponseDto })
  async create(@Body() createDto: CreateH11Jshztzd1Dto) {
    return this.h11Jshztzd1Service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '查询结算汇总通知单列表' })
  @ApiResponse({ type: [H11Jshztzd1ResponseDto] })
  async findAll(@Query() queryDto: QueryH11Jshztzd1Dto) {
    // return this.h11Jshztzd1Service.findAll(queryDto);
    return this.h11Jshztzd1Service.queryMessages(queryDto.ksid);
  }

  @Get(':zyid/:ksid/:qfbz')
  @ApiOperation({ summary: '获取单个结算汇总通知单' })
  @ApiResponse({ type: H11Jshztzd1ResponseDto })
  async findOne(
    @Param('zyid') zyid: string,
    @Param('ksid') ksid: string,
    @Param('qfbz') qfbz: number,
  ) {
    return this.h11Jshztzd1Service.findOne(zyid, ksid, qfbz);
  }

  @Put(':zyid/:ksid/:qfbz')
  @ApiOperation({ summary: '更新结算汇总通知单' })
  @ApiResponse({ type: H11Jshztzd1ResponseDto })
  async update(
    @Param('zyid') zyid: string,
    @Param('ksid') ksid: string,
    @Param('qfbz') qfbz: number,
    @Body() updateDto: UpdateH11Jshztzd1Dto,
  ) {
    return this.h11Jshztzd1Service.update(zyid, ksid, qfbz, updateDto);
  }

  @Delete(':zyid/:ksid/:qfbz')
  @ApiOperation({ summary: '删除结算汇总通知单' })
  async remove(
    @Param('zyid') zyid: string,
    @Param('ksid') ksid: string,
    @Param('qfbz') qfbz: number,
  ) {
    return this.h11Jshztzd1Service.remove(zyid, ksid, qfbz);
  }
}
