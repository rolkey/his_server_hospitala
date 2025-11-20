import { Controller, Get, Query, Delete, Post, Body, Param } from '@nestjs/common';
import { h12_yzzbService } from './h12_yzzb.service';
import { h12_yzxbService } from './h12_yzxb.service';
import { executeDto, H12_yzzbOpeDto, reviewDto } from './dto/h12_yzzbOpe.dto';
import { UpdateH12_yzxbDto, H12_yzxbSyffTcDto } from './dto/h12_yzxb.dto';
import { H12_yzxbOpeDto } from './dto/h12_yzxbOpe.dto';
import { H12_yzzb1OpeDto } from './dto/h12_yzzb1Ope.dto';
import { UsrcatService } from '../usrcat/usrcat.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BabyAdviceService } from './baby-advice.service';
import { h12_yzxbServiceNew } from './h12_yzxb.service_new';
@Controller('h12_yzzb')
export class h12_yzzbController {
  constructor(
    private readonly h12_yzzbService: h12_yzzbService,
    private readonly h12_yzxbService: h12_yzxbService,
    private readonly h12_yzxbServiceNew: h12_yzxbServiceNew,
    private readonly babyAdviceService: BabyAdviceService,
    private readonly userService: UsrcatService,
  ) {}

  @Get('findAllByPatient')
  async findAllByPatient(
    @Query() data: { zyid: string; yzlx: string; yzzt?: number; yzzxcs?: string },
  ) {
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

  @Post('submitAdvices')
  async submitAdvices(@Body() h12_yzzb1OpeDto: H12_yzzb1OpeDto) {
    const record = await this.h12_yzxbService.submitAdvices(h12_yzzb1OpeDto);
    return { record };
  }

  @Post('syffTc')
  async syffTc(@Body() h12_yzxbSyffTcDto: H12_yzxbSyffTcDto) {
    const record = await this.h12_yzxbService.syffTc(h12_yzxbSyffTcDto);
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
    return await this.h12_yzxbService.addPackageToAdvice(h12_yzxbs);
  }

  @Post('getPackageItems')
  async getPackageItems(@Body() data: { advice: any; mbid: string }) {
    return await this.h12_yzxbService.getPackageItems({ ...data, recursionDepth: 1 });
  }

  /** 管理员重置密码 */
  @Get('checkPassword/:userId/:pwd')
  async checkPassword(@Param('userId') userId: string, @Param('pwd') pwd: string) {
    return await this.userService.checkPassword(userId, pwd);
  }

  @Post('stop-fymx')
  @ApiOperation({ summary: '停止医嘱费用明细' })
  @ApiResponse({ status: 200, description: '医嘱停止成功' })
  async wfStopFymx(
    @Body()
    body: {
      zyid: string;
      yzxh: number;
      yzlx: number;
      yzzh: number[];
      zxrq: string;
      mrcs: number;
      userId: string;
      u_zcid: string;
      jsys: string;
      ysstopbz: string;
    },
  ): Promise<void> {
    const { zyid, yzxh, yzlx, yzzh, zxrq, mrcs, userId, u_zcid, jsys, ysstopbz } = body;

    try {
      await this.h12_yzxbService.stopAdvice(
        zyid,
        yzxh,
        yzlx,
        yzzh,
        new Date(zxrq),
        mrcs,
        userId,
        u_zcid,
        jsys,
        ysstopbz,
      );
    } catch (error) {
      // 输出完整的错误信息
      console.error('停止医嘱错误:', error);

      // 根据业务需求，可能需要抛出错误或进行其他错误处理
      throw error;
    }
    return;
  }

  @Post('sign')
  async sign(
    @Body()
    data: {
      zyid: string;
      yzxh: number;
      yzlx: number;
      yzzh: number[];
      userId: string;
      zcid: string;
      jsys: string;
    },
  ) {
    const { zyid, yzxh, yzlx, yzzh, userId, zcid, jsys } = data;
    return this.h12_yzxbService.sign(zyid, yzxh, yzlx, yzzh, userId, zcid, jsys);
  }

  @Post('unSign')
  async unSign(@Body() data: { zyid: string; yzxh: number; yzlx: number; yzzh: number[] }) {
    const { zyid, yzxh, yzlx, yzzh } = data;
    return this.h12_yzxbService.unSign(zyid, yzxh, yzlx, yzzh);
  }

  @Post('unStop')
  async unStop(@Body() data: { zyid: string; yzxh: number; yzlx: number; yzzh: number[] }) {
    const { zyid, yzxh, yzlx, yzzh } = data;
    return this.h12_yzxbService.unStop(zyid, yzxh, yzlx, yzzh);
  }

  @Post('reorganize')
  async reorganize(
    @Body()
    data: {
      zyid: string;
      yzxh: number;
      czlx: number;
      kssj: string;
      userId: string;
      u_zcid: string;
      jsys: string;
      ysstopbz: string;
    },
  ) {
    const { zyid, yzxh, czlx, kssj, userId, u_zcid, jsys, ysstopbz } = data;
    const kssjDate = new Date(kssj);
    return this.h12_yzxbService.reorganize(
      zyid,
      yzxh,
      czlx,
      kssjDate,
      userId,
      u_zcid,
      jsys,
      ysstopbz,
    );
  }

  @Get('v-flag')
  async vFlag() {
    return '1.0.0.3';
  }

  @Post('generateBaby')
  async generateBabyAdvice(@Body() generateDto: { zyid: string; ysid: string }) {
    return await this.babyAdviceService.baby_generateAdvice(generateDto.zyid, generateDto.ysid);
  }

  @Post('review')
  async review(@Body() dto: reviewDto) {
    return await this.h12_yzxbServiceNew.review(dto);
  }

  @Post('execute')
  async execute(@Body() dto: executeDto) {
    return await this.h12_yzxbServiceNew.execute(dto);
  }

  @Post('voidable')
  async voidable(@Body() data: { zyid: string; yzlx: number; yzzh: number[]; tzsj: string }) {
    const { zyid, yzlx, yzzh, tzsj } = data;
    return this.h12_yzxbService.voidable(zyid, yzlx, yzzh, tzsj);
  }
}
