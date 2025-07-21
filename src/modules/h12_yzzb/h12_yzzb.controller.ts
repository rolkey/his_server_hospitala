import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { h12_yzzbService } from './h12_yzzb.service';

import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

@Controller('h12_yzzb')
export class h12_yzzbController {
  constructor(private readonly h12_yzzbService: h12_yzzbService) {}

  @Get('findAllByPatient')
  async findAllByPatient(@Query() data: { zyid: string; yzlx: string }) {
    const record = await this.h12_yzzbService.findAllByPatient(data);
    return { record };
  }
}
