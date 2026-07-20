import { Controller, Get, Query } from '@nestjs/common';
import { UsrcatService } from './usrcat.service';
import { FindDoctorsByKsidDto } from './dto';

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

  /** 根据科室查询医生列表 */
  @Get('findDoctorsByKsid')
  findDoctorsByKsid(@Query() query: FindDoctorsByKsidDto) {
    return this.userService.findDoctorsByKsid(query.ksid);
  }

  /** 查询护士列表 */
  @Get('findNurses')
  findNurses() {
    return this.userService.findNurses();
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
