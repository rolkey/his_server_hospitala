// src/h12-cycl/h12-cycl.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { H12CyclService } from './h12-cycl.service';
import { CreateH12CyclDto, UpdateH12CyclDto, QueryH12CyclDto } from './dto/h12-cycl.dto';

@Controller('h12-cycl')
export class H12CyclController {
  constructor(private readonly h12CyclService: H12CyclService) {}

  // 创建记录
  @Post()
  create(@Body() createH12CyclDto: CreateH12CyclDto) {
    return this.h12CyclService.create(createH12CyclDto);
  }

  // 分页查询
  @Get()
  findAll(@Query() queryDto: QueryH12CyclDto) {
    return this.h12CyclService.findAll(queryDto);
  }

  // 根据住院编号查询
  @Get('zybh/:zybh')
  findByZybh(@Param('zybh') zybh: string) {
    return this.h12CyclService.findByZybh(zybh);
  }

  // 根据病人姓名查询
  @Get('brxm/:brxm')
  findByBrxm(@Param('brxm') brxm: string) {
    return this.h12CyclService.findByBrxm(brxm);
  }

  // 根据ID查询单条记录
  @Get(':zyid')
  findOne(@Param('zyid') zyid: string) {
    return this.h12CyclService.findOne(zyid);
  }

  // 更新记录
  @Put(':zyid')
  update(@Param('zyid') zyid: string, @Body() updateH12CyclDto: UpdateH12CyclDto) {
    return this.h12CyclService.update(zyid, updateH12CyclDto);
  }

  // 删除单条记录
  @Delete(':zyid')
  remove(@Param('zyid') zyid: string) {
    return this.h12CyclService.remove(zyid);
  }

  // 批量删除
  @Delete()
  removeBatch(
    @Body('zyids', new ParseArrayPipe({ items: String, separator: ',' }))
    zyids: string[],
  ) {
    return this.h12CyclService.removeBatch(zyids);
  }
}
