import { Controller, Get, Query, Delete, Post, Body } from '@nestjs/common';
import { h12_yzzbService } from './h12_yzzb.service';
import { H12_yzzbOpeDto } from './dto/h12_yzzbOpe.dto';
import { H12_yzxbDto } from './dto/h12_yzxb.dto';

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
    const record = await this.h12_yzzbService.saveAdvice(h12_yzzbOpeDto);
    return { record };
  }

  @Delete()
  async remove(@Query() data: { zyid: string; yzlx: number; yzxh: number; mxxh: number }) {
    const { zyid, yzlx, yzxh, mxxh } = data;
    return await this.h12_yzzbService.remove(zyid, yzlx, yzxh, mxxh);
  }

  @Delete('yzzh')
  async removeByYzzh(@Query() data: { zyid: string; yzlx: number; yzzh: number }) {
    const { zyid, yzlx, yzzh } = data;
    return await this.h12_yzzbService.removeByYzzh(zyid, yzlx, yzzh);
  }
}
