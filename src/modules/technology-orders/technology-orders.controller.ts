import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { TechnologyOrdersService } from './technology-orders.service';
import { ExportDataDto, QueryOrdersDto, UpdateExecuteStatusDto } from './technology-orders.dto';

@Controller('technology-orders')
export class TechnologyOrdersController {
  constructor(private readonly technologyOrdersService: TechnologyOrdersService) {}

  @Get('query')
  queryOrders(@Query() queryOrdersDto: QueryOrdersDto) {
    return this.technologyOrdersService.queryOrders(queryOrdersDto);
  }

  @Post('print')
  getPrintData(@Body() params: any) {
    return this.technologyOrdersService.getPrintData(params);
  }

  @Post('execute')
  updateExecuteStatus(@Body() updateExecuteStatusDto: UpdateExecuteStatusDto) {
    return this.technologyOrdersService.updateExecuteStatus(updateExecuteStatusDto);
  }

  @Get('signature')
  async getSignatureImage(@Query('usid') usid: string, @Res() res: Response) {
    const result = await this.technologyOrdersService.getSignatureImage(usid);
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="signature-${usid}.png"`,
    });
    res.send(result);
  }

  @Post('export')
  async exportData(@Body() exportDataDto: ExportDataDto, @Res() res: Response) {
    const result = await this.technologyOrdersService.exportData(exportDataDto);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="orders.xlsx"',
    });
    res.send(result);
  }
}
