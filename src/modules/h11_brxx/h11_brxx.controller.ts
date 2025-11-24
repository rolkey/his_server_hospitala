import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { h11_brxxService } from './h11_brxx.service';
import {
  Queryh11_brxxDto,
  CreateDto,
  UpdateDto,
  QueryCostDetailDto,
  QueryCostCategoryDto,
  bedAllocationDto,
  QueryDto,
} from './dto';

@Controller('h11_brxx')
export class h11_brxxController {
  constructor(private readonly h11_brxxService: h11_brxxService) { }

  @Get('findAll')
  async findAll(@Query() queryDto: Queryh11_brxxDto) {
    return await this.h11_brxxService.findAll(queryDto);
  }

  @Get('findOne')
  async findOne(@Query() data: { zyid: string }) {
    const brxx = await this.h11_brxxService.findOne(data.zyid);
    return { record: brxx };
  }

  @Get('findPatientTotal')
  async findPatientTotal(@Query() queryDto: QueryDto) {
    return this.h11_brxxService.findPatientTotal(queryDto);
  }


  @Post('create')
  async create(@Body() dto: CreateDto) {
    return await this.h11_brxxService.create(dto);
  }

  @Put('update')
  async update(@Body() dto: UpdateDto) {
    return await this.h11_brxxService.update(dto);
  }

  // 费用类别
  @Get('costDetails')
  async costDetails(@Query() queryCostDetailDto: QueryCostDetailDto) {
    return await this.h11_brxxService.costDetails(queryCostDetailDto);
  }

  // 费用明细
  @Get('costCategory')
  async costCategory(@Query() queryCostCategoryDto: QueryCostCategoryDto) {
    return await this.h11_brxxService.costCategory(queryCostCategoryDto);
  }

  //分配床位
  @Post('bedAllocation')
  async bedAllocation(@Body() dto: bedAllocationDto) {
    return await this.h11_brxxService.bedAllocation(dto);
  }


}
