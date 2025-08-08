import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { H12RyjlService } from './h12-ryjl.service';
import {
  CreateH12RyjlDto,
  UpdateH12RyjlDto,
  QueryH12RyjlDto,
  H12RyjlResponseDto,
} from './h12_ryjl.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('入院记录管理')
@Controller('h12-ryjl')
export class H12RyjlController {
  constructor(private readonly h12RyjlService: H12RyjlService) {}

  @Post()
  @ApiOperation({ summary: '创建入院记录' })
  @ApiResponse({ status: 201, type: H12RyjlResponseDto })
  async create(@Body() createDto: CreateH12RyjlDto): Promise<H12RyjlResponseDto> {
    return await this.h12RyjlService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '分页查询入院记录' })
  @ApiQuery({ name: 'pageNo', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, type: [H12RyjlResponseDto] })
  async findAll(
    @Query() queryDto: QueryH12RyjlDto,
    @Query('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ): Promise<{ data: H12RyjlResponseDto[]; total: number }> {
    const [data, total] = await this.h12RyjlService.findAll({
      ...queryDto,
      pageNo,
      pageSize,
    });
    return { data, total };
  }

  @Get(':zyid/:lx')
  @ApiOperation({ summary: '根据复合主键查询入院记录详情' })
  @ApiResponse({ status: 200, type: H12RyjlResponseDto })
  async findOne(@Param('zyid') zyid: string, @Param('lx') lx: string): Promise<H12RyjlResponseDto> {
    return await this.h12RyjlService.findOne(zyid, lx);
  }

  @Put(':zyid/:lx')
  @ApiOperation({ summary: '更新入院记录' })
  @ApiResponse({ status: 200, type: H12RyjlResponseDto })
  async update(
    @Param('zyid') zyid: string,
    @Param('lx') lx: string,
    @Body() updateDto: UpdateH12RyjlDto,
  ): Promise<H12RyjlResponseDto> {
    return await this.h12RyjlService.update(zyid, lx, updateDto);
  }

  @Delete(':zyid/:lx')
  @ApiOperation({ summary: '删除单条入院记录' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('zyid') zyid: string, @Param('lx') lx: string): Promise<void> {
    await this.h12RyjlService.remove(zyid, lx);
  }

  @Delete()
  @ApiOperation({ summary: '批量删除入院记录' })
  @ApiResponse({ status: 200, description: '批量删除成功' })
  async removeBatch(@Body() ids: Array<{ zyid: string; lx: string }>): Promise<void> {
    await this.h12RyjlService.removeBatch(ids);
  }
}
