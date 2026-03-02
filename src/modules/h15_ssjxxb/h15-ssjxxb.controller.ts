import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { H15SsjxxbService } from './h15-ssjxxb.service';

@ApiTags('手术间信息表')
@Controller('h15-ssjxxb')
export class H15SsjxxbController {
  constructor(private readonly h15SsjxxbService: H15SsjxxbService) {}

  @Get()
  @ApiOperation({ summary: '不分页查询列表' })
  findAll() {
    return this.h15SsjxxbService.findAll();
  }
}
