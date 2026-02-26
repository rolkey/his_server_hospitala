import { Controller, Get, Query } from '@nestjs/common';
import { UsrcatService } from './usrcat.service';

@Controller('usrcat')
export class UsrcatNewController {
  constructor(private readonly userService: UsrcatService) {}

  @Get('findOutpatientDoctor')
  findOutpatientDoctor() {
    return this.userService.findOutpatientDoctor();
  }

  @Get('findResidentDoctor')
  findResidentDoctor() {
    return this.userService.findResidentDoctor();
  }

  @Get('findTollCollector')
  findTollCollector() {
    return this.userService.findTollCollector();
  }

  @Get('findTollCollectorMZZY')
  findTollCollectorMZZY() {
    return this.userService.findTollCollectorMZZY();
  }

  @Get('sysDepts')
  getSysDepts(@Query() data: { userId: string; sysId: string }) {
    return this.userService.getSysDepts(data);
  }
}
