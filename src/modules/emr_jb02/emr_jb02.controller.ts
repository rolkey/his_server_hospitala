import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { emr_jb02Service } from './emr_jb02.service';
import { emr_jb02 } from './emr_jb02.entity';

@Controller('emr_jb02')
export class emr_jb02Controller {
  constructor(private readonly emrJb02Service: emr_jb02Service) {}

  @Get('findAll')
  async findAll() {
    const results = await this.emrJb02Service.findAll();
    return { pageData: results, total: results.length };
  }

  @Get('findByFilter')
  async findByFilter(
    @Query('jbxh') jbxh?: string,
    @Query('zyh') zyh?: string,
    @Query('brch') brch?: string,
  ) {
    const results = await this.emrJb02Service.findByFilter({ jbxh, zyh, brch });
    return { pageData: results, total: results.length };
  }

  @Get('findByJbxh/:jbxh')
  async findByJbxh(@Param('jbxh') jbxh: string) {
    const pageData = await this.emrJb02Service.findByJbxh(jbxh);
    return { pageData, total: pageData.length };
  }

  @Get('findOne/:jlxh')
  async findOne(@Param('jlxh') jlxh: string) {
    const record = await this.emrJb02Service.findOne(jlxh);
    return { record };
  }

  @Post('create')
  async create(@Body() body: Partial<emr_jb02>) {
    const record = await this.emrJb02Service.create(body);
    return { record };
  }

  @Put('update/:jlxh')
  async update(@Param('jlxh') jlxh: string, @Body() body: Partial<emr_jb02>) {
    const record = await this.emrJb02Service.update(jlxh, body);
    return { record };
  }

  @Delete('remove/:jlxh')
  async remove(@Param('jlxh') jlxh: string) {
    const affected = await this.emrJb02Service.remove(jlxh);
    return { affected };
  }
}
