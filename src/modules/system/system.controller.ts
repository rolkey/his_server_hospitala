import { Controller, Get, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';
import { JwtGuard } from '@/common/guards';

@Controller('system')
// @UseGuards(JwtGuard)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('time')
  getCurrentTime() {
    return this.systemService.getCurrentTime();
  }
}
