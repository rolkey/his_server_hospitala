import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { emr_jcsqService } from './emr_jcsq.service';
import { QueryDto, SaveDto } from './dto';

@Controller('emr_jcsq')
export class emr_jcsqController {
  constructor(private readonly emr_jcsqService: emr_jcsqService) { }

  @Post('save')
  async save(@Body() saveDto: SaveDto) {
    const sqdh = await this.emr_jcsqService.save(saveDto);
    return { sqdh };
  }

  @Get('findOne')
  async findOne(@Query() queryDto: QueryDto) {
    const record = await this.emr_jcsqService.findOne(queryDto);
    return { record };
  }
}
