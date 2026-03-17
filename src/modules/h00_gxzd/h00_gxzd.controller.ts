import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { H00GxzdService } from './h00_gxzd.service';
import { CreateH00GxzdDto, UpdateH00GxzdDto, H00GxzdQueryDto } from './h00_gxzd.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('h00_gxzd-关系字典')
@Controller('h00_gxzd')
export class H00GxzdController {
  constructor(private readonly h00GxzdService: H00GxzdService) {}

  @Get('findAll')
  @ApiOperation({ summary: '分页/列表查询关系字典' })
  findAll(@Query() queryDto: H00GxzdQueryDto) {
    return this.h00GxzdService.findAll(queryDto);
  }

  @Get(':gxid')
  @ApiOperation({ summary: '按ID查询关系字典' })
  @ApiParam({ name: 'gxid', description: '关系字典ID' })
  findOne(@Param('gxid') gxid: string) {
    return this.h00GxzdService.findOne(gxid);
  }

  @Post()
  @ApiOperation({ summary: '新增关系字典' })
  create(@Body() createDto: CreateH00GxzdDto) {
    return this.h00GxzdService.create(createDto);
  }

  @Patch(':gxid')
  @ApiOperation({ summary: '更新关系字典' })
  @ApiParam({ name: 'gxid', description: '关系字典ID' })
  update(@Param('gxid') gxid: string, @Body() updateDto: UpdateH00GxzdDto) {
    return this.h00GxzdService.update(gxid, updateDto);
  }

  @Delete(':gxid')
  @ApiOperation({ summary: '删除关系字典' })
  @ApiParam({ name: 'gxid', description: '关系字典ID' })
  remove(@Param('gxid') gxid: string) {
    return this.h00GxzdService.remove(gxid);
  }
}
