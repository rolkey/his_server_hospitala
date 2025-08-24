import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { H11ZypjService } from './h11_zypj.service';
import {
  CreateH11ZypjDto,
  UpdateH11ZypjDto,
  H11ZypjQueryDto,
  H11ZypjPrimaryDto,
} from './h11_zypj.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('h11_zypj')
export class H11ZypjController {
  constructor(private readonly h11ZypjService: H11ZypjService) {}

  // @Post()
  // create(@Body() createH11ZypjDto: CreateH11ZypjDto) {
  //   return this.h11ZypjService.create(createH11ZypjDto);
  // }

  // @Get()
  // findAll(@Query() queryDto: H11ZypjQueryDto) {
  //   return this.h11ZypjService.findAll(queryDto);
  // }

  // 根据主键获取单条票据记录
  // @Get('findOne')
  // findOne(@Query() h11ZypjPrimaryDto: H11ZypjPrimaryDto) {
  //   return this.h11ZypjService.findOne(h11ZypjPrimaryDto);
  // }

  @Get('getAdvancePaymenNumber')
  getAdvancePaymenNumber(@Query() h11ZypjPrimaryDto: H11ZypjPrimaryDto) {
    return this.h11ZypjService.getCurrentNumber(h11ZypjPrimaryDto);
  }

  // // 更新票据记录
  // @Patch(':pjlxid/:usid/:fyid')
  // update(
  //   @Param('pjlxid') pjlxid: string,
  //   @Param('usid') usid: string,
  //   @Param('fyid') fyid: string,
  //   @Body() updateH11ZypjDto: UpdateH11ZypjDto,
  // ) {
  //   return this.h11ZypjService.update(pjlxid, usid, fyid, updateH11ZypjDto);
  // }

  // @Delete(':pjlxid/:usid/:fyid')
  // remove(
  //   @Param('pjlxid') pjlxid: string,
  //   @Param('usid') usid: string,
  //   @Param('fyid') fyid: string,
  // ) {
  //   return this.h11ZypjService.remove(pjlxid, usid, fyid);
  // }

  // @Get('kshm/:kshm')
  // findByKshm(@Param('kshm') kshm: string) {
  //   return this.h11ZypjService.findByKshm(kshm);
  // }

  // @Get('statistics/overview')
  // getStatistics() {
  //   return this.h11ZypjService.getStatistics();
  // }
}
