import { Body, Controller, Post } from '@nestjs/common';
import { CreateDto } from './dto/h13_djdy.dto';
import { h13_djdyService } from './h13_djdy.service';

@Controller('h13_djdy')
export class h13_djdyController {
  constructor(private readonly h13_djdyService: h13_djdyService) { }

  @Post('create')
  create(@Body() dto: CreateDto) {
    return this.h13_djdyService.create(dto);
  }
}
