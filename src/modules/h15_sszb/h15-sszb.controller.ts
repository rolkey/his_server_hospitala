import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { H15SszbService } from './h15-sszb.service';
import {
  CreateH15SszbDto,
  UpdateH15SszbDto,
  QueryH15SszbDto,
  SurgeryStatisticsDto,
} from './dto/h15-sszb.dto';
import { H15Sszb } from './h15-sszb.entity';

@Controller('h15-sszb')
export class H15SszbController {
  constructor(private readonly h15SszbService: H15SszbService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateH15SszbDto): Promise<H15Sszb> {
    return this.h15SszbService.create(createDto);
  }

  @Get()
  findAll(@Query() queryDto: QueryH15SszbDto): Promise<H15Sszb[]> {
    return this.h15SszbService.findAll(queryDto);
  }

  @Get('findOne/:ssid/:zyid/:xh/:ksid')
  findOne(
    @Param('ssid') ssid: string,
    @Param('zyid') zyid: string,
    @Param('xh') xh: number,
    @Param('ksid') ksid: string,
  ): Promise<H15Sszb> {
    return this.h15SszbService.findOne(ssid, zyid, xh, ksid);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(@Body() updateDto: UpdateH15SszbDto): Promise<H15Sszb> {
    return this.h15SszbService.update(updateDto);
  }

  @Delete(':ssid/:zyid/:xh/:ksid')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('ssid') ssid: string,
    @Param('zyid') zyid: string,
    @Param('xh') xh: number,
    @Param('ksid') ksid: string,
  ): Promise<void> {
    return this.h15SszbService.remove(ssid, zyid, xh, ksid);
  }

  @Get('findByZyid/:zyid')
  findByZyid(@Param('zyid') zyid: string): Promise<H15Sszb[]> {
    return this.h15SszbService.findByZyid(zyid);
  }

  @Post('statistics')
  @HttpCode(HttpStatus.OK)
  getSurgeryStatistics(@Body() statisticsDto: SurgeryStatisticsDto) {
    return this.h15SszbService.getSurgeryStatistics(statisticsDto);
  }
}
