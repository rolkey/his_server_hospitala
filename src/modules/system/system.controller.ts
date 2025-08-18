import { Controller, Get, UseGuards, Query } from '@nestjs/common';
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
}
