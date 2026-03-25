import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { emr_jb01Service } from './emr_jb01.service';
import { emr_jb01 } from './emr_jb01.entity';

@Controller('emr_jb01')
export class emr_jb01Controller {
  constructor(private readonly emrJb01Service: emr_jb01Service) {}

  @Get('findAll')
  async findAll() {
    const results = await this.emrJb01Service.findAll();
    return { pageData: results, total: results.length };
  }

  @Get('findByFilter')
  async findByFilter(
    @Query('ksdm') ksdm?: string,
    @Query('bqdm') bqdm?: string,
    @Query('jblb') jblb?: string,
  ) {
    const results = await this.emrJb01Service.findByFilter({
      ksdm,
      bqdm: bqdm != null && bqdm !== '' ? Number(bqdm) : undefined,
      jblb: jblb != null && jblb !== '' ? Number(jblb) : undefined,
    });
    return { pageData: results, total: results.length };
  }

  @Get('findOne/:jbxh')
  async findOne(@Param('jbxh') jbxh: string) {
    const record = await this.emrJb01Service.findOne(jbxh);
    return { record };
  }

  /**
   * 新增
   * @param body 交接班主记录
   * @returns 交接班主记录
   */
  @Post('create')
  async create(@Body() body: Partial<emr_jb01>) {
    const record = await this.emrJb01Service.create(body);
    return { record };
  }

  @Post('save')
  async save(@Body() body) {
    const record = await this.emrJb01Service.save(body);
    return { record };
  }

  @Put('update/:jbxh')
  async update(@Param('jbxh') jbxh: string, @Body() body: Partial<emr_jb01>) {
    const record = await this.emrJb01Service.update(jbxh, body);
    return { record };
  }

  @Delete('remove/:jbxh')
  async remove(@Param('jbxh') jbxh: string) {
    const affected = await this.emrJb01Service.remove(jbxh);
    return { affected };
  }

  /**
   * 历史查询
   * zt=1：按住院号模糊查询；zt=2：按日期范围查询
   */
  @Get('history')
  async history(
    @Query('zt') zt: string,
    @Query('zyh') zyh?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const results = await this.emrJb01Service.history({ startDate, endDate });
    return results;
  }

  /**
   * 右边记录：按 jbxh 返回主表头 + 明细列表
   */
  @Get('detail/:jbxh')
  async findDetail(@Param('jbxh') jbxh: string) {
    return this.emrJb01Service.findDetail(jbxh);
  }

  /**
   * 检索
   * @param date 日期
   * @param ksdm 科室
   * @returns 病人列表、交接班主记录、交接班明细
   */
  @Get('search')
  async search(@Query('date') date: string, @Query('ksdm') ksdm: string) {
    const result = await this.emrJb01Service.search({ date, ksdm });
    return result;
  }

  /**
   * 审核
   * @param jbxh 交班序号
   * @param body.userid 审核人工号
   */
  @Post('approve/:jbxh')
  async approve(@Param('jbxh') jbxh: string, @Body('userid') userid: string) {
    const record = await this.emrJb01Service.approve(jbxh, userid);
    return { record };
  }

  /**
   * 取消审核
   * @param jbxh 交班序号
   */
  @Post('cancelApprove/:jbxh')
  async cancelApprove(@Param('jbxh') jbxh: string) {
    const record = await this.emrJb01Service.cancelApprove(jbxh);
    return { record };
  }
}
