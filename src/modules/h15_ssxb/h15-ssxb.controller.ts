import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { H15SsxbService } from './h15-ssxb.service';
import { QueryH15SsxbDto, H15SsxbBatchDto } from './dto/h15-ssxb.dto';

@Controller('h15-ssxb')
export class H15SsxbController {
  constructor(private readonly h15SsxbService: H15SsxbService) {}

  // 创建收费明细
  @Post()
  save(@Body() ssxb: H15SsxbBatchDto) {
    return this.h15SsxbService.batchSave(ssxb);
  }

  // 分页查询收费明细
  @Get()
  findAll(@Query() queryDto: QueryH15SsxbDto) {
    return this.h15SsxbService.findAll(queryDto);
  }

  // 删除收费明细
  @Delete()
  remove(@Query() maxid: number) {
    return this.h15SsxbService.remove(maxid);
  }

  // 获取患者收费汇总
  @Get('patient/:zyid/fee-summary')
  getPatientFeeSummary(@Param('zyid') zyid: string) {
    return this.h15SsxbService.getPatientFeeSummary(zyid);
  }

  @Post('submitSurgeryDetail')
  submitSurgeryDetail(ssxb: H15SsxbBatchDto) {
    return this.h15SsxbService.submitSurgeryDetail(ssxb);
  }
}
