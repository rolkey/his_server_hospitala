import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { N0421Service } from './n04_21.service';
import { N0421 } from './n04_21.entity';
import { FindByZyidDto } from './dto/n04_21.dto';

@ApiTags('n04-21')
@Controller('n0421')
export class N0421Controller {
  constructor(private readonly n0421Service: N0421Service) {}

  @Get()
  @ApiOperation({ summary: '按条件查询病案首页' })
  find(@Query() condition: Partial<N0421>) {
    return this.n0421Service.findByCondition(condition);
  }

  @Get('zyid/:zyid')
  @ApiOperation({ summary: '根据住院ID查看病案首页详情' })
  @ApiParam({ name: 'zyid', description: '住院ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  findByZyid(@Param('zyid') zyid: string) {
    return this.n0421Service.findByZyid(zyid);
  }

  @Get('info')
  @ApiOperation({ summary: '根据住院ID查看病案首页详情（Query参数）' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  findByZyidQuery(@Query() query: FindByZyidDto) {
    return this.n0421Service.findByZyid(query.zyid);
  }

  @Post()
  @ApiOperation({ summary: '创建或更新病案首页' })
  save(@Body() data: Partial<N0421>) {
    return this.n0421Service.save(data);
  }

  @Put(':zyid')
  @ApiOperation({ summary: '更新病案首页' })
  update(@Param('zyid') zyid: string, @Body() data: Partial<N0421>) {
    return this.n0421Service.update(zyid, data);
  }

  @Delete(':zyid')
  @ApiOperation({ summary: '删除病案首页' })
  remove(@Param('zyid') zyid: string) {
    return this.n0421Service.remove(zyid);
  }
}
