import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { h12_yzzbService } from './h12_yzzb.service';
import { H12_yzzbOpeDto } from './dto/h12_yzzbOpe.dto';

@Controller('h12_yzzb')
export class h12_yzzbController {
  constructor(private readonly h12_yzzbService: h12_yzzbService) {}

  @Get('findAllByPatient')
  async findAllByPatient(@Query() data: { zyid: string; yzlx: string }) {
    const record = await this.h12_yzzbService.findAllByPatient(data);
    return { record };
  }

  @Get('createAdvice')
  async createAdvice(@Query() data: { zyid: string; yzlx: number }) {
    const record = await this.h12_yzzbService.createAdvice(data);
    return { record };
  }

  @Post('saveAdvice')
  async saveAdvice(@Body() h12_yzzbOpeDto: H12_yzzbOpeDto) {
    const record = await this.h12_yzzbService.saveAdvices(h12_yzzbOpeDto);
    return { record };
  }
}
