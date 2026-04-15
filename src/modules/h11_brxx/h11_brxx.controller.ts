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
  ForciblyDeleteDto,
  receiptDto,
  TransferDepartmentDto,
} from './dto';
import { h11_brxxService_new } from './h11_brxx.service_new';

@Controller('h11_brxx')
export class h11_brxxController {
  constructor(
    private readonly h11_brxxService: h11_brxxService,
    private readonly h11_brxxService_new: h11_brxxService_new,
  ) {}

  @Get('findAll')
  async findAll(@Query() queryDto: Queryh11_brxxDto) {
    return await this.h11_brxxService.findAll(queryDto);
  }

  @Get('findOne')
  async findOne(@Query() data: { zyid: string }) {
    const record = await this.h11_brxxService.findOne(data.zyid);
    return { record };
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

  @Get('getPatientListForReceipt')
  async getPatientListForReceipt(@Query() queryDto: receiptDto) {
    return await this.h11_brxxService.getPatientListForReceipt(queryDto);
  }

  // 费用类别
  @Get('costDetails')
  async costDetails(@Query() queryCostDetailDto: QueryCostDetailDto) {
    return await this.h11_brxxService.costDetails(queryCostDetailDto);
  }

  @Get('getUnSettleFee')
  async getUnSettleFee(@Query() data: { zyid: string }) {
    return await this.h11_brxxService_new.getUnSettleFee(data.zyid);
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

  //分配床位
  @Post('updateBedAllocation')
  async updateBedAllocation(
    @Body()
    data: {
      lrsj: Date;
      cwid: string;
      cwidOld: string;
      zyid: string;
      cwmc: string;
      ksid: string;
      userId: string;
      userName: string;
    },
  ) {
    return await this.h11_brxxService_new.updateBedAllocation(data);
  }

  // 删除
  @Get('forciblyDelete')
  async forciblyDelete(@Query() dto: ForciblyDeleteDto) {
    return await this.h11_brxxService.forciblyDelete(dto);
  }

  // 作废未确认出院
  @Post('cancelUnconfirmedDischarge')
  async cancelUnconfirmedDischarge(@Body() dto: { zyid: string; ksid: string }) {
    return await this.h11_brxxService.cancelUnconfirmedDischarge(dto);
  }

  // 转科操作
  @Post('transferDepartment')
  async transferDepartment(@Body() dto: TransferDepartmentDto) {
    return await this.h11_brxxService.transferDepartment(dto);
  }
}
