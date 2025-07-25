import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { h13_yzzxcsService } from './h13_yzzxcs.service';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { Createh13_yzzxcsDto, Updateh13_yzzxcsDto } from './dto/h13_yzzxcs.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('h13_医嘱执行次数')
@Controller('h13_yzzxcs')
export class h13_yzzxcsController {
  constructor(private readonly h13_yzzxcsService: h13_yzzxcsService) {}

  @Get()
  @ApiOperation({ summary: '获取所有h13医嘱执行次数记录' })
  @ApiResponse({ status: 200, description: '返回所有记录', type: [h13_yzzxcs] })
  async findAll(): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsService.findAll();
  }

  @Get('find')
  @ApiOperation({ summary: '根据复合主键查找h13记录' })
  @ApiResponse({ status: 200, description: '返回找到的记录', type: h13_yzzxcs })
  async findOne(
    @Query('yzxh') yzxh: number,
    @Query('mxxh') mxxh: number,
    @Query('yzlx') yzlx: number,
    @Query('zyid') zyid: string,
    @Query('zxrq') zxrq: Date,
  ): Promise<h13_yzzxcs> {
    return this.h13_yzzxcsService.findOne({ yzxh, mxxh, yzlx, zyid, zxrq });
  }

  @Get('zyid/:zyid')
  @ApiOperation({ summary: '根据住院ID查找h13记录' })
  @ApiResponse({ status: 200, description: '返回找到的记录', type: [h13_yzzxcs] })
  async findByZyid(@Param('zyid') zyid: string): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsService.findByZyid(zyid);
  }

  @Get('yzxh/:yzxh')
  @ApiOperation({ summary: '根据医嘱序号查找h13记录' })
  @ApiResponse({ status: 200, description: '返回找到的记录', type: [h13_yzzxcs] })
  async findByYzxh(@Param('yzxh') yzxh: number): Promise<h13_yzzxcs[]> {
    return this.h13_yzzxcsService.findByYzxh(yzxh);
  }

  @Post()
  @ApiOperation({ summary: '创建新的h13医嘱执行次数记录' })
  @ApiResponse({
    status: 201,
    description: '记录已创建',
    type: h13_yzzxcs,
  })
  async create(@Body() createDto: Createh13_yzzxcsDto): Promise<h13_yzzxcs> {
    return this.h13_yzzxcsService.create(createDto);
  }

  @Put()
  @ApiOperation({ summary: '更新h13医嘱执行次数记录' })
  @ApiResponse({ status: 200, description: '记录已更新', type: h13_yzzxcs })
  async update(
    @Query('yzxh') yzxh: number,
    @Query('mxxh') mxxh: number,
    @Query('yzlx') yzlx: number,
    @Query('zyid') zyid: string,
    @Query('zxrq') zxrq: Date,
    @Body() updateDto: Updateh13_yzzxcsDto,
  ): Promise<h13_yzzxcs> {
    return this.h13_yzzxcsService.update({ yzxh, mxxh, yzlx, zyid, zxrq }, updateDto);
  }

  @Delete()
  @ApiOperation({ summary: '删除h13医嘱执行次数记录' })
  @ApiResponse({ status: 200, description: '记录已删除' })
  async delete(
    @Query('yzxh') yzxh: number,
    @Query('mxxh') mxxh: number,
    @Query('yzlx') yzlx: number,
    @Query('zyid') zyid: string,
    @Query('zxrq') zxrq: Date,
  ): Promise<void> {
    return this.h13_yzzxcsService.delete({ yzxh, mxxh, yzlx, zyid, zxrq });
  }
}
