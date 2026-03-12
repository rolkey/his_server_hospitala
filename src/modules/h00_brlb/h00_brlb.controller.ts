import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { H00BrlbService } from './h00_brlb.service';
import { CreateH00BrlbDto, UpdateH00BrlbDto, H00BrlbQueryDto } from './h00_brlb.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('h00_brlb-病人类别')
@Controller('h00_brlb')
export class H00BrlbController {
  constructor(private readonly h00BrlbService: H00BrlbService) {}

  @Get('findAll')
  @ApiOperation({ summary: '分页/列表查询病人类别' })
  findAll(@Query() queryDto: H00BrlbQueryDto) {
    return this.h00BrlbService.findAll(queryDto);
  }

  @Get(':brlbid')
  @ApiOperation({ summary: '按ID查询病人类别' })
  @ApiParam({ name: 'brlbid', description: '病人类别ID' })
  findOne(@Param('brlbid') brlbid: string) {
    return this.h00BrlbService.findOne(brlbid);
  }

  @Post()
  @ApiOperation({ summary: '新增病人类别' })
  create(@Body() createDto: CreateH00BrlbDto) {
    return this.h00BrlbService.create(createDto);
  }

  @Patch(':brlbid')
  @ApiOperation({ summary: '更新病人类别' })
  @ApiParam({ name: 'brlbid', description: '病人类别ID' })
  update(@Param('brlbid') brlbid: string, @Body() updateDto: UpdateH00BrlbDto) {
    return this.h00BrlbService.update(brlbid, updateDto);
  }

  @Delete(':brlbid')
  @ApiOperation({ summary: '删除病人类别' })
  @ApiParam({ name: 'brlbid', description: '病人类别ID' })
  remove(@Param('brlbid') brlbid: string) {
    return this.h00BrlbService.remove(brlbid);
  }
}
