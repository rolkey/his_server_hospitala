import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H11YjkService } from './h11-yjk.service';
import { CreateH11YjkDto, UpdateH11YjkDto, H11YjkQueryDto } from './h11-yjk.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ParseDatePipe } from './date-parse.pipe';

@ApiTags('预交款管理')
@Controller('h11-yjk')
export class H11YjkController {
  constructor(private readonly h11YjkService: H11YjkService) {}

  @Post()
  @ApiOperation({ summary: '创建预交款记录' })
  @ApiResponse({ status: 201, description: '预交款记录创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() createH11YjkDto: CreateH11YjkDto) {
    return this.h11YjkService.create(createH11YjkDto);
  }

  @Get()
  @ApiOperation({ summary: '查询预交款记录列表' })
  @ApiResponse({ status: 200, description: '返回预交款记录列表' })
  findAll(@Query() queryDto: H11YjkQueryDto) {
    return this.h11YjkService.findAll(queryDto);
  }

  @Get(':sjhm/:sfsj')
  @ApiOperation({ summary: '根据收据号码和收费时间查询预交款记录' })
  @ApiParam({ name: 'sjhm', description: '收据号码' })
  @ApiParam({ name: 'sfsj', description: '收费时间', type: String })
  @ApiResponse({ status: 200, description: '返回预交款记录' })
  @ApiResponse({ status: 404, description: '预交款记录不存在' })
  findOne(@Param('sjhm') sjhm: string, @Param('sfsj', ParseDatePipe) sfsj: Date) {
    return this.h11YjkService.findOne(sjhm, sfsj);
  }

  @Get('zyid/:zyid')
  @ApiOperation({ summary: '根据住院ID查询预交款记录' })
  @ApiParam({ name: 'zyid', description: '住院ID' })
  @ApiResponse({ status: 200, description: '返回预交款记录列表' })
  findByZyid(@Param('zyid') zyid: string) {
    return this.h11YjkService.findByZyid(zyid);
  }

  @Patch(':sjhm/:sfsj')
  @ApiOperation({ summary: '更新预交款记录' })
  @ApiParam({ name: 'sjhm', description: '收据号码' })
  @ApiParam({ name: 'sfsj', description: '收费时间', type: String })
  @ApiResponse({ status: 200, description: '预交款记录更新成功' })
  @ApiResponse({ status: 404, description: '预交款记录不存在' })
  update(
    @Param('sjhm') sjhm: string,
    @Param('sfsj', ParseDatePipe) sfsj: Date,
    @Body() updateH11YjkDto: UpdateH11YjkDto,
  ) {
    return this.h11YjkService.update(sjhm, sfsj, updateH11YjkDto);
  }

  @Delete(':sjhm/:sfsj')
  @ApiOperation({ summary: '删除预交款记录' })
  @ApiParam({ name: 'sjhm', description: '收据号码' })
  @ApiParam({ name: 'sfsj', description: '收费时间', type: String })
  @ApiResponse({ status: 200, description: '预交款记录删除成功' })
  @ApiResponse({ status: 404, description: '预交款记录不存在' })
  remove(@Param('sjhm') sjhm: string, @Param('sfsj', ParseDatePipe) sfsj: Date) {
    return this.h11YjkService.remove(sjhm, sfsj);
  }

  @Get('statistics/total')
  @ApiOperation({ summary: '统计指定时间段内的预交款总额' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: true })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: true })
  @ApiResponse({ status: 200, description: '返回预交款总额' })
  getTotalAmount(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.h11YjkService.getTotalAmount(startDate, endDate);
  }

  @Get('statistics/department')
  @ApiOperation({ summary: '按科室统计预交款金额' })
  @ApiQuery({ name: 'startDate', description: '开始日期', required: true })
  @ApiQuery({ name: 'endDate', description: '结束日期', required: true })
  @ApiResponse({ status: 200, description: '返回各科室预交款统计' })
  getAmountByDepartment(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.h11YjkService.getAmountByDepartment(startDate, endDate);
  }
}
