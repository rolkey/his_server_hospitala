import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { reportService } from './report.service';
import {
  Carete_Report_CategoryDto,
  Updateh_Report_CategoryDto,
  Carete_Report_InfomationDto,
  Update_Report_InfomationDto,
  Get_Report_InfomationDto,
} from './dto';

@Controller('report')
export class reportController {
  constructor(private readonly reportService: reportService) {}

  @Get('findAll')
  async findAll() {
    const results = await this.reportService.findAll();
    return { pageData: results, total: results.length };
  }

  @Get('listParams')
  async listParams(@Query('reportCode') reportCode: string) {
    const results = await this.reportService.listParams(reportCode);
    return { pageData: results, total: results.length };
  }

  @Get('catetoryList')
  async catetoryList() {
    const results = await this.reportService.listCatetory();
    return { pageData: results, total: results.length };
  }

  //   @Get('addCatetory')
  //   async addCatetory() {
  //     const results = await this.reportService.addCatetory();
  //     return { pageData: results, total: results.length };
  //   }

  @Post('addCategory')
  createCatetory(@Body() report_catetory: Carete_Report_CategoryDto) {
    return this.reportService.createCatetory(report_catetory);
  }

  @Patch('updateCategory/:id')
  updateCategory(@Param('id') id: string, @Body() updateDto: Updateh_Report_CategoryDto) {
    return this.reportService.updateCategory(id, updateDto);
  }

  @Delete('deleteCatetory/:id')
  removeCategory(@Param('id') id: string) {
    return this.reportService.removeCategory(id);
  }

  @Get('informationList')
  async informationList(@Query() query: Get_Report_InfomationDto) {
    const results = await this.reportService.listInformation(query);
    return { pageData: results, total: results.total };
  }

  @Post('addInformation')
  createInformation(@Body() report_catetory: Carete_Report_InfomationDto) {
    return this.reportService.createInformation(report_catetory);
  }

  @Patch('updateInformation/:id')
  updateInformation(@Param('id') id: string, @Body() updateDto: Update_Report_InfomationDto) {
    return this.reportService.updateInformation(id, updateDto);
  }

  @Delete('deleteInformation/:id')
  removeInformation(@Param('id') id: string) {
    return this.reportService.removeInformation(id);
  }
}
