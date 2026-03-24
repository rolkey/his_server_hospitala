import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { enr_jb01Service } from './enr_jb01.service';
import { enr_jb01 } from './enr_jb01.entity';

@Controller('enr_jb01')
export class enr_jb01Controller {
  constructor(private readonly enrJb01Service: enr_jb01Service) {}

  @Get('findAll')
  async findAll() {
    const results = await this.enrJb01Service.findAll();
    return { pageData: results, total: results.length };
  }

  @Get('findByFilter')
  async findByFilter(
    @Query('ksdm') ksdm?: string,
    @Query('bqdm') bqdm?: string,
    @Query('jblb') jblb?: string,
  ) {
    const results = await this.enrJb01Service.findByFilter({
      ksdm,
      bqdm: bqdm != null && bqdm !== '' ? Number(bqdm) : undefined,
      jblb: jblb != null && jblb !== '' ? Number(jblb) : undefined,
    });
    return { pageData: results, total: results.length };
  }

  @Get('findOne/:jbxh')
  async findOne(@Param('jbxh') jbxh: string) {
    const record = await this.enrJb01Service.findOne(jbxh);
    return { record };
  }

  @Post('create')
  async create(@Body() body: Partial<enr_jb01>) {
    const record = await this.enrJb01Service.create(body);
    return { record };
  }

  @Put('update/:jbxh')
  async update(@Param('jbxh') jbxh: string, @Body() body: Partial<enr_jb01>) {
    const record = await this.enrJb01Service.update(jbxh, body);
    return { record };
  }

  @Delete('remove/:jbxh')
  async remove(@Param('jbxh') jbxh: string) {
    const affected = await this.enrJb01Service.remove(jbxh);
    return { affected };
  }
}
