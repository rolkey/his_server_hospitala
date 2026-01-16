import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { SmSssqService } from './sm-sssq.service';
import { CreateSmSssqDto, UpdateSmSssqDto, QuerySmSssqDto } from './dto/sm-sssq.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('手术申请管理')
@Controller('sm-sssq')
export class SmSssqController {
  constructor(private readonly smSssqService: SmSssqService) {}

  @Post()
  @ApiOperation({ summary: '创建手术申请' })
  async create(@Body() createDto: CreateSmSssqDto) {
    return await this.smSssqService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取手术申请列表' })
  @ApiQuery({ name: 'pageNo', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'sortBy', required: false, description: '排序字段' })
  @ApiQuery({ name: 'sortOrder', required: false, description: '排序方式(ASC/DESC)' })
  async findAll(@Query() queryDto: QuerySmSssqDto) {
    return await this.smSssqService.findAll(queryDto);
  }

  @Get(':sqdh')
  @ApiOperation({ summary: '获取单个手术申请' })
  @ApiParam({ name: 'sqdh', description: '手术申请单号' })
  async findOne(@Param('sqdh', ParseIntPipe) sqdh: number) {
    return await this.smSssqService.findOne(sqdh);
  }

  @Put()
  @ApiOperation({ summary: '更新手术申请' })
  async update(@Body() updateDto: UpdateSmSssqDto) {
    return await this.smSssqService.updateSmSssq(updateDto);
  }

  @Delete(':sqdh')
  @ApiOperation({ summary: '删除手术申请' })
  @ApiParam({ name: 'sqdh', description: '手术申请单号' })
  async remove(@Param('sqdh', ParseIntPipe) sqdh: number) {
    return await this.smSssqService.remove(sqdh);
  }
}
