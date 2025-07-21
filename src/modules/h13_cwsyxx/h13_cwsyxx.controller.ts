import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { h13_cwsyxxService } from './h13_cwsyxx.service';
import { GrpcMethod } from '@nestjs/microservices';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

@Controller('h13_cwsyxx')
export class h13_cwsyxxController {
  constructor(private readonly h13_cwsyxxService: h13_cwsyxxService) {}

  @Get('findAllByDept')
  async findAllByDept(@Query() queryDto: { ksid: string }) {
    const pageData = await this.h13_cwsyxxService.findAll(queryDto);
    // 组装床位和病人信息
    return { pageData, total: pageData.length };
  }
}
