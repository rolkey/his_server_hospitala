import { Controller, Get } from '@nestjs/common';
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
}
