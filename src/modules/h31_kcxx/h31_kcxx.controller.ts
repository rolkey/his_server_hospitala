import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { H31_kcxxService } from './h31_kcxx.service';
import { H31_kcxx } from './h31_kcxx.entity';
import { CreateH31_kcxxDto } from './dto/create-h31_kcxx.dto';
import { UpdateH31_kcxxDto } from './dto/update-h31_kcxx.dto';

@ApiTags('库存信息管理')
@Controller('h31-kcxx')
export class H31KcxxController {
  constructor(private readonly h31KcxxService: H31_kcxxService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建库存记录' })
  @ApiBody({ type: CreateH31_kcxxDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '库存记录创建成功',
    type: H31_kcxx,
  })
  async create(@Body() createDto: CreateH31_kcxxDto): Promise<H31_kcxx> {
    return this.h31KcxxService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '查询所有库存记录' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '返回所有库存记录',
    type: [H31_kcxx],
  })
  async findAll(): Promise<H31_kcxx[]> {
    return this.h31KcxxService.findAll();
  }

  @Get(':ksid/:ypid')
  @ApiOperation({ summary: '根据主键查询库存记录' })
  @ApiParam({ name: 'ksid', description: '科室ID' })
  @ApiParam({ name: 'ypid', description: '药品ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '返回指定库存记录',
    type: H31_kcxx,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '库存记录不存在',
  })
  async findOne(
    @Param('ksid') ksid: string,
    @Param('ypid') ypid: string,
  ): Promise<H31_kcxx | null> {
    return this.h31KcxxService.findOne(ksid, ypid);
  }

  @Patch(':ksid/:ypid')
  @ApiOperation({ summary: '更新库存记录' })
  @ApiParam({ name: 'ksid', description: '科室ID' })
  @ApiParam({ name: 'ypid', description: '药品ID' })
  @ApiBody({ type: UpdateH31_kcxxDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '返回更新后的库存记录',
    type: H31_kcxx,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '库存记录不存在',
  })
  async update(
    @Param('ksid') ksid: string,
    @Param('ypid') ypid: string,
    @Body() updateDto: UpdateH31_kcxxDto,
  ): Promise<H31_kcxx | null> {
    return this.h31KcxxService.update(ksid, ypid, updateDto);
  }

  @Delete(':ksid/:ypid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除库存记录' })
  @ApiParam({ name: 'ksid', description: '科室ID' })
  @ApiParam({ name: 'ypid', description: '药品ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '库存记录已删除',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '库存记录不存在',
  })
  async remove(@Param('ksid') ksid: string, @Param('ypid') ypid: string): Promise<void> {
    await this.h31KcxxService.remove(ksid, ypid);
  }

  @Get('search/condition')
  @ApiOperation({ summary: '根据条件查询库存记录' })
  @ApiQuery({ name: 'ksid', required: false })
  @ApiQuery({ name: 'ypid', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '返回符合条件的库存记录',
    type: [H31_kcxx],
  })
  async findByCondition(
    @Query('ksid') ksid?: string,
    @Query('ypid') ypid?: string,
  ): Promise<H31_kcxx[]> {
    return this.h31KcxxService.findByCondition({ ksid, ypid });
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '批量创建库存记录' })
  @ApiBody({ type: [CreateH31_kcxxDto] })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '批量创建成功',
    type: [H31_kcxx],
  })
  async batchInsert(@Body() records: CreateH31_kcxxDto[]): Promise<H31_kcxx[]> {
    return this.h31KcxxService.batchInsert(records);
  }

  @Get('search/kcsl-greater-than/:value')
  @ApiOperation({ summary: '查询库存数量大于指定值的记录' })
  @ApiParam({ name: 'value', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '返回符合条件的库存记录',
    type: [H31_kcxx],
  })
  async findByKcslGreaterThan(@Param('value') value: number): Promise<H31_kcxx[]> {
    return this.h31KcxxService.findByKcslGreaterThan(value);
  }

  @Get('search/expired')
  @ApiOperation({ summary: '查询过期药品' })
  @ApiQuery({ name: 'beforeDate', required: false, type: Date })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '返回过期药品记录',
    type: [H31_kcxx],
  })
  async findExpired(@Query('beforeDate') beforeDate?: Date): Promise<H31_kcxx[]> {
    return this.h31KcxxService.findExpired(beforeDate || new Date());
  }
}
