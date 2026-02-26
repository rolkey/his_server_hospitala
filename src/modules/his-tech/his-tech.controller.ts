import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { QueryDto, SaveDto } from '../emr_jcsq/dto';
import { HisTechService } from './his-tech.service';

@Controller('his-tech')
export class HisTechController {
  constructor(private readonly hisTechService: HisTechService) {}

  @Get('brxxs')
  async queryBrxxs(@Query() queryDto: QueryDto) {
    return await this.hisTechService.queryBrxxs(queryDto);
  }
}
