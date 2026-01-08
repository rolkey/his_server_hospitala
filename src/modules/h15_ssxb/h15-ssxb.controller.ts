import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { H15SsxbService } from './h15-ssxb.service';
import {
  CreateH15SsxbDto,
  UpdateH15SsxbDto,
  QueryH15SsxbDto,
  H15SsxbBatchOperationDto,
  FeeStatisticsDto,
  UpdateFeeStatusDto,
} from './dto/h15-ssxb.dto';

@Controller('h15-ssxb')
export class H15SsxbController {
  constructor(private readonly h15SsxbService: H15SsxbService) {}

  // 创建收费明细
  @Post()
  create(@Body() createDto: CreateH15SsxbDto) {
    return this.h15SsxbService.create(createDto);
  }

  // 批量创建收费明细
  @Post('batch')
  batchCreate(@Body() createDtos: CreateH15SsxbDto[]) {
    return this.h15SsxbService.batchCreate(createDtos);
  }

  // 分页查询收费明细
  @Get()
  findAll(@Query() queryDto: QueryH15SsxbDto) {
    return this.h15SsxbService.findAll(queryDto);
  }

  // 查询单个收费明细
  @Get('findOne/:ssid/:zyid/:ssmxid/:czid/:xh/:ksid')
  findOne(
    @Param('ssid') ssid: string,
    @Param('zyid') zyid: string,
    @Param('ssmxid') ssmxid: number,
    @Param('czid') czid: string,
    @Param('xh') xh: number,
    @Param('ksid') ksid: string,
  ) {
    return this.h15SsxbService.findOne(ssid, zyid, ssmxid, czid, xh, ksid);
  }

  // 更新收费明细
  @Put(':ssid/:zyid/:ssmxid/:czid/:xh/:ksid')
  update(
    @Param('ssid') ssid: string,
    @Param('zyid') zyid: string,
    @Param('ssmxid') ssmxid: number,
    @Param('czid') czid: string,
    @Param('xh') xh: number,
    @Param('ksid') ksid: string,
    @Body() updateDto: UpdateH15SsxbDto,
  ) {
    return this.h15SsxbService.update(ssid, zyid, ssmxid, czid, xh, ksid, updateDto);
  }

  // 删除收费明细
  @Delete(':ssid/:zyid/:ssmxid/:czid/:xh/:ksid')
  remove(
    @Param('ssid') ssid: string,
    @Param('zyid') zyid: string,
    @Param('ssmxid') ssmxid: number,
    @Param('czid') czid: string,
    @Param('xh') xh: number,
    @Param('ksid') ksid: string,
  ) {
    return this.h15SsxbService.remove(ssid, zyid, ssmxid, czid, xh, ksid);
  }

  // 获取患者收费汇总
  @Get('patient/:zyid/fee-summary')
  getPatientFeeSummary(@Param('zyid') zyid: string) {
    return this.h15SsxbService.getPatientFeeSummary(zyid);
  }
}
