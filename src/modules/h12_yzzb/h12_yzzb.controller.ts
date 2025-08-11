import { Controller, Get, Query, Delete, Post, Body } from '@nestjs/common';
import { h12_yzzbService } from './h12_yzzb.service';
import { h12_yzxbService } from './h12_yzxb.service';
import { H12_yzzbOpeDto } from './dto/h12_yzzbOpe.dto';
import { UpdateH12_yzxbDto } from './dto/h12_yzxb.dto';
import { H12_yzxbOpeDto } from './dto/h12_yzxbOpe.dto';

@Controller('h12_yzzb')
export class h12_yzzbController {
  constructor(
    private readonly h12_yzzbService: h12_yzzbService,
    private readonly h12_yzxbService: h12_yzxbService,
  ) {}

  @Get('findAllByPatient')
  async findAllByPatient(@Query() data: { zyid: string; yzlx: string }) {
    const record = await this.h12_yzzbService.findAllByPatient(data);
    return { record };
  }

  @Get('createAdvice')
  async createAdvice(
    @Query() data: { zyid: string; yzlx: number; newZxcs?: boolean; newGroup?: boolean },
  ) {
    // 设置默认值
    const newZxcs = data.newZxcs ?? true;
    const newGroup = data.newGroup ?? false;
    const newData = { ...data, newZxcs, newGroup };
    const record = await this.h12_yzxbService.createAdvice(newData);
    return { record };
  }

  @Post('saveAdvice')
  async saveAdvice(@Body() h12_yzzbOpeDto: H12_yzzbOpeDto) {
    const record = await this.h12_yzxbService.saveAdvice(h12_yzzbOpeDto);
    return { record };
  }

  @Delete()
  async remove(@Query() data: { zyid: string; yzlx: number; yzxh: number; mxxh: number }) {
    const { zyid, yzlx, yzxh, mxxh } = data;
    return await this.h12_yzxbService.remove(zyid, yzlx, yzxh, mxxh);
  }

  @Delete('yzzh')
  async removeYzzh(@Body() data: Array<{ zyid: string; yzlx: number; yzzh: number }>) {
    return await this.h12_yzxbService.removeYzzh(data);
  }

  // 合并组
  @Post('merge-group')
  async mergeGroup(@Body() h12_yzxbs: UpdateH12_yzxbDto[]) {
    return await this.h12_yzxbService.mergeGroup(h12_yzxbs);
  }

  // 拆分组
  @Post('split-group')
  async splitGroup(@Body() h12_yzxbs: UpdateH12_yzxbDto[]) {
    return await this.h12_yzxbService.splitGroup(h12_yzxbs);
  }

  // 取组套到医嘱中
  @Post('addPackageToAdvice')
  async addPackageToAdvice(@Body() h12_yzxbs: H12_yzxbOpeDto) {
    return this.h12_yzxbService.addPackageToAdvice(h12_yzxbs);
  }

  @Post('getPackageItems')
  async getPackageItems(@Body() data: { advice: any; mbid: string }) {
    return this.h12_yzxbService.getPackageItems({ ...data, recursionDepth: 1 });
  }
}
