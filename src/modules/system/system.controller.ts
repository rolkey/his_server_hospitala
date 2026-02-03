import { Controller, Get, UseGuards, Query, Post, Body } from '@nestjs/common';
import { SystemService } from './system.service';
import { SysparDto } from './dto/syspar.dto';
import { JwtGuard } from '@/common/guards';

@Controller('system')
// @UseGuards(JwtGuard)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('time')
  getCurrentTime() {
    return this.systemService.getCurrentTime();
  }

  @Get('param')
  getParam(@Query() query: SysparDto) {
    return this.systemService.getParam(query);
  }

  @Post('batchParamsRead')
  batchParamsRead(@Body() data: SysparDto[]) {
    return this.systemService.batchParamsRead(data);
  }

  @Post('batchParamsWrite')
  batchParamsWrite(@Body() data: SysparDto[]) {
    return this.systemService.batchParamsWrite(data);
  }
}
