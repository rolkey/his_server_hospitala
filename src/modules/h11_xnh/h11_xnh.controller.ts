import { Controller, Query, Get, Param } from '@nestjs/common';
import { H11XnhService } from './h11_xnh.service';
import { CreateH11XnhDto, UpdateH11XnhDto, H11XnhQueryDto } from './h11_xnh.dto';

@Controller('h11_xnh')
export class H11XnhController {
  constructor(private readonly h11XnhService: H11XnhService) {}

  @Get('findAll')
  findAll(@Query() query: H11XnhQueryDto) {
    return this.h11XnhService.findAll(query);
  }

  @Get('findOne')
  findOne(@Query('fphm') fphm: string) {
    return this.h11XnhService.findOne(fphm);
  }
}
