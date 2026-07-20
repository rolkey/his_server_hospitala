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
import { N0424Service } from './n04_24.service';
import { N0424 } from './n04_24.entity';
import { FindByZyidDto, ReadFyxxDto } from './dto/n04_24.dto';

@ApiTags('n04-24')
@Controller('n0424')
export class N0424Controller {
  constructor(private readonly n0424Service: N0424Service) {}

  @Get()
  @ApiOperation({ summary: '按条件查询病案费用' })
  find(@Query() condition: Partial<N0424>) {
    return this.n0424Service.findByCondition(condition);
  }

  @Get('zyid/:zyid')
  @ApiOperation({ summary: '根据住院ID查看费用信息' })
  @ApiParam({ name: 'zyid', description: '住院ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '费用信息不存在' })
  findByZyid(@Param('zyid') zyid: string) {
    return this.n0424Service.findByZyid(zyid);
  }

  @Get('info')
  @ApiOperation({ summary: '根据住院ID查看费用信息（Query参数）' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '费用信息不存在' })
  findByZyidQuery(@Query() query: FindByZyidDto) {
    return this.n0424Service.findByZyid(query.zyid);
  }

  @Post('read-fyxx')
  @ApiOperation({ summary: '读取费用（调用 h50_readfy 并写入 N04_24）' })
  @ApiResponse({ status: HttpStatus.OK, description: '读取成功' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '已有费用数据且未强制重新读取' })
  readFyxx(@Body() dto: ReadFyxxDto) {
    return this.n0424Service.readFyxx(dto);
  }

  @Post()
  @ApiOperation({ summary: '创建或更新病案费用' })
  save(@Body() data: Partial<N0424>) {
    return this.n0424Service.save(data);
  }

  @Put(':zyid')
  @ApiOperation({ summary: '更新病案费用' })
  update(@Param('zyid') zyid: string, @Body() data: Partial<N0424>) {
    return this.n0424Service.update(zyid, data);
  }

  @Delete(':zyid')
  @ApiOperation({ summary: '删除病案费用' })
  remove(@Param('zyid') zyid: string) {
    return this.n0424Service.remove(zyid);
  }
}
