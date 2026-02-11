import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { h13_brzkqkService } from './h13_brzkqk.service';
import { AbandonBrzkqkDto, ConfirmBrzkqkDto } from './dto/h13_brzkqk.dto';

/**
 * 病人转科情况 h13_brzkqk
 * 提供确认/放弃转科接口，与 h11_brxx 转科流程配合使用
 */
@Controller('h13-brzkqk')
export class h13_brzkqkController {
  constructor(private readonly h13_brzkqkService: h13_brzkqkService) { }

  /**
   * 确认转科 或 放弃转科
   * 文档逻辑：1 确认人不空则返回；2 确认转科(1a 写确认时间/护士 2a 病人表出院科室/住院状态 3a 停止病床/医嘱/租床)；3 放弃转科(1b 插入作废表 2b 住院状态 3b 删除)
   */
  @Post('confirmZk')
  async confirmZk(@Body() body: ConfirmBrzkqkDto) {
    return this.h13_brzkqkService.confirmZk(body);
  }

  /**
   * 
   * @param body 放弃转科
   * @returns 
   */
  @Post('abandonZk')
  async abandonZk(@Body() body: AbandonBrzkqkDto) {
    return this.h13_brzkqkService.abandonZk(body);
  }

  /**
   * 查询需要确认转科的病人
   */
  @Get('queryNeedConfirmZk')
  async queryNeedConfirmZk(@Query('ksid') ksid: string) {
    return this.h13_brzkqkService.queryNeedConfirmZk(ksid);
  }
}
