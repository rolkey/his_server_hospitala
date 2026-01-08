import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { N0422Service } from './n04_22.service';
import { N0422 } from './n04_22.entity';

@Controller('n0422')
export class N0422Controller {
  constructor(private readonly n0422Service: N0422Service) {}

  @Post()
  create(@Body() createN0422Dto: Partial<N0422>) {
    return this.n0422Service.create(createN0422Dto);
  }

  @Get()
  findAll() {
    return this.n0422Service.findAll();
  }

  @Get(':zyid/:zdxh')
  findOne(@Param('zyid') zyid: string, @Param('zdxh') zdxh: number) {
    return this.n0422Service.findOne(zyid, zdxh);
  }

  @Patch(':zyid/:zdxh')
  update(
    @Param('zyid') zyid: string,
    @Param('zdxh') zdxh: number,
    @Body() updateN0422Dto: Partial<N0422>,
  ) {
    return this.n0422Service.update(zyid, zdxh, updateN0422Dto);
  }

  @Delete(':zyid/:zdxh')
  remove(@Param('zyid') zyid: string, @Param('zdxh') zdxh: number) {
    return this.n0422Service.remove(zyid, zdxh);
  }

  @Get('by-zyid/:zyid')
  findByZyid(@Param('zyid') zyid: string) {
    return this.n0422Service.findByZyid(zyid);
  }

  @Get('by-zdbm/:zdbm')
  findByZdbm(@Param('zdbm') zdbm: string) {
    return this.n0422Service.findByZdbm(zdbm);
  }

  @Get('by-icd10/:icd10')
  findByIcd10(@Param('icd10') icd10: string) {
    return this.n0422Service.findByIcd10(icd10);
  }

  @Get('main-diagnosis/:zyid')
  getMainDiagnosis(@Param('zyid') zyid: string) {
    return this.n0422Service.getMainDiagnosis(zyid);
  }

  @Get('condition')
  findByCondition(@Query() condition: Partial<N0422>) {
    return this.n0422Service.findByCondition(condition);
  }
}
