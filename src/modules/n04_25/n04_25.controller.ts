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
import { N0425Service } from './n04_25.service';
import { N0425 } from './n04_25.entity';
import { FindByZyidDto } from './dto/n04_25.dto';

@ApiTags('n04-25')
@Controller('n0425')
export class N0425Controller {
  constructor(private readonly n0425Service: N0425Service) {}

  @Get()
  @ApiOperation({ summary: '按条件查询产儿信息' })
  find(@Query() condition: Partial<N0425>) {
    return this.n0425Service.findByCondition(condition);
  }

  @Get('zyid/:zyid')
  @ApiOperation({ summary: '根据住院ID查询婴儿信息' })
  @ApiParam({ name: 'zyid', description: '住院ID' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '婴儿信息不存在' })
  findByZyid(@Param('zyid') zyid: string) {
    return this.n0425Service.findByZyid(zyid);
  }

  @Get('info')
  @ApiOperation({ summary: '根据住院ID查询婴儿信息（Query参数）' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '婴儿信息不存在' })
  findByZyidQuery(@Query() query: FindByZyidDto) {
    return this.n0425Service.findByZyid(query.zyid);
  }

  @Post()
  @ApiOperation({ summary: '创建或更新产儿信息' })
  save(@Body() data: Partial<N0425>) {
    return this.n0425Service.save(data);
  }

  @Put(':zyid')
  @ApiOperation({ summary: '更新产儿信息' })
  update(@Param('zyid') zyid: string, @Body() data: Partial<N0425>) {
    return this.n0425Service.update(zyid, data);
  }

  @Delete(':zyid')
  @ApiOperation({ summary: '删除产儿信息' })
  remove(@Param('zyid') zyid: string) {
    return this.n0425Service.remove(zyid);
  }
}
