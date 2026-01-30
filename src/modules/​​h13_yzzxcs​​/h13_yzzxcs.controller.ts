import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { h13_yzzxcsService } from './h13_yzzxcs.service';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { CreateH13YzzxcsDto, H13YzzxcsResponseDto, UpdateH13YzzxcsDto } from './dto/h13-yzzxcs.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { H13YzzxcsTfResponseDto } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.dto';
// import { h12_yzxbService } from '../h12_yzzb/h12_yzxb.service';

@ApiTags('h13_医嘱执行次数')
@Controller('h13_yzzxcs')
export class h13_yzzxcsController {
  constructor(
    private readonly h13_yzzxcsService: h13_yzzxcsService,
    // private readonly h12_yzxbService: h12_yzxbService,
  ) {}

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
  async create(@Body() createDto: CreateH13YzzxcsDto): Promise<h13_yzzxcs> {
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
    @Body() updateDto: UpdateH13YzzxcsDto,
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

  @Get('generate-temp-data-nurse')
  async generateTempNurse(
    @Query() data: { zyid: string; yzzhs: string },
  ): Promise<H13YzzxcsResponseDto[]> {
    return await this.h13_yzzxcsService.generateTempDataNurse(data);
  }

  @Get('generate-temp-data')
  async generateTempData(
    @Query('zyid') zyid: string,
    @Query('yzxh') yzxh: number,
    @Query('yzlx') yzlx: number,
    @Query('yzzh') yzzh: string, // 接收字符串，然后转换为数组
    @Query('zxrq') zxrq: string,
    @Query('mrcs') mrcs: number,
    @Query('u_userid') u_userid: string,
  ): Promise<H13YzzxcsResponseDto[]> {
    // 将逗号分隔的字符串转换为数字数组
    const yzzhArray = yzzh.split(',').map(Number);

    // 准备公共参数
    const gstr_ainf = { u_userid };

    return await this.h13_yzzxcsService.generateTempData(
      zyid,
      yzxh,
      yzlx,
      yzzhArray,
      zxrq,
      mrcs,
      gstr_ainf,
    );
  }

  @Get('query-yzzxcs')
  async queryByYzzh(@Query() data: { zyid: string; yzzhs: string }) {
    // 将逗号分隔的字符串转换为数字数组
    return await this.h13_yzzxcsService.queryByYzzh({
      zyid: data.zyid,
      yzzhs: data.yzzhs.split(',').map(Number),
    });
  }

  // 撤回退费：没有领药单、没有退费
  @Put('revoke-refund')
  async revokeRefund(@Body() data: { zyid: string; maxids: string }) {
    // 将逗号分隔的字符串转换为数字数组
    return await this.h13_yzzxcsService.revokeRefund({
      zyid: data.zyid,
      maxids: data.maxids.split(',').map(Number),
    });
  }

  // 撤回退费领药单：有领药单没有发药，已经有领药单
  @Put('revoke-refund-medicine-receipt')
  async revokeRefundMedicineReceipt(
    @Body() data: { zyid: string; maxidList: Array<{ maxid: number }> },
  ) {
    // 将逗号分隔的字符串转换为数字数组
    return await this.h13_yzzxcsService.revokeRefundMedicineReceipt({
      zyid: data.zyid,
      maxids: data.maxidList.map((item) => item.maxid),
    });
  }
}
