import { Controller, Get, Post, Put, Delete, Body, Query } from '@nestjs/common';
import { chsService } from './chs.service';
import { ChsPersonDetail, MsgDto, PreSettlement, ReplaceDto, Settlement } from './dto';

@Controller('chs')
export class chsController {
  constructor(private readonly chsService: chsService) { }

  // @Post('saveChsPersonDetail')
  // async saveChsPersonDetail(@Body() chsPersonDetail: ChsPersonDetail) {
  //   await this.chsService.saveChsPersonDetail(chsPersonDetail);
  // }

  // @Post('saveRegistrationAndPreSettlement')
  // async saveRegistrationAndPreSettlement(@Body() preSettlement: PreSettlement) {
  //   return await this.chsService.saveRegistrationAndPreSettlement(preSettlement);
  // }

  // @Post('saveSettlement')
  // async saveSettlement(@Body() settlement: Settlement) {
  //   return await this.chsService.saveSettlement(settlement);
  // }
  // @Post('cancelPreSettlement')
  // async cancelPreSettlement(@Body() data: { lsh: string; mdtrt_id: string }) {
  //   return await this.chsService.cancelPreSettlement(data);
  // }

  // @Post('cancelSettlement')
  // async cancelSettlement(@Body() data: Settlement) {
  //   return await this.chsService.cancelSettlement(data);
  // }

  // @Get('getChsDetail')
  // async getChsPersonDetail(@Query() data: { lsh; lshxh }) {
  //   return this.chsService.getChsDetail(data.lsh, data.lshxh);
  // }

  // @Get('getChsDetailByInvono')
  // async getChsDetailByInvono(@Query() data: { lsh; ybdjh }) {
  //   return this.chsService.getChsDetailByInvono(data.lsh, data.ybdjh);
  // }

  // @Post('saveDjxx')
  // async saveDjxx(@Body() data: PreSettlement) {
  //   return await this.chsService.saveDjxx(data);
  // }

  // @Get('getChsMaxLshxh')
  // async getChsMaxLshxh(@Query() data: { lsh }) {
  //   return this.chsService.getChsMaxLshxh(data.lsh);
  // }

  // @Post('getMsgId')
  // async getMsgId(@Body() data: MsgDto) {
  //   return this.chsService.getMsgId(data);
  // }
}
