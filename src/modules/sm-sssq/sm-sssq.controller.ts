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
import { CreateSmSssqDto, UpdateSmSssqDto, QuerySmSssqDto, VoidSmSssqDto } from './dto/sm-sssq.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('手术申请管理')
@Controller('sm-sssq')
export class SmSssqController {
  constructor(private readonly smSssqService: SmSssqService) {}

  @Post()
  @ApiOperation({ summary: '创建手术申请' })
  async create(@Body() createDto: CreateSmSssqDto) {
    return await this.smSssqService.create(createDto);
  }

  @Get('unarranged-list')
  @ApiOperation({ summary: '未安排手术列表查询' })
  @ApiQuery({ name: 'ksid', required: true, description: '科室ID，支持 LIKE 匹配（如 01 或 01%）' })
  async findUnarrangedList(@Query('ksid') ksid: string) {
    return await this.smSssqService.findUnarrangedList(ksid);
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

  @Put()
  @ApiOperation({ summary: '更新手术申请' })
  async update(@Body() updateDto: UpdateSmSssqDto) {
    return await this.smSssqService.updateSmSssq(updateDto);
  }

  @Post('void')
  @ApiOperation({ summary: '手术申请单作废/取消作废' })
  @ApiBody({
    type: VoidSmSssqDto,
    description: 'sqdh: 申请单号；zfbz: 1=作废，0=取消作废。作废时若已安排(apbz=1)会报错。',
  })
  async voidOrCancelVoid(@Body() dto: VoidSmSssqDto) {
    return await this.smSssqService.voidOrCancelVoid(dto);
  }

  @Delete()
  @ApiOperation({ summary: '删除手术申请' })
  @ApiParam({ name: 'sqdh', description: '手术申请单号' })
  async remove(@Query() data: { zyid: string; sqdh: string }) {
    return await this.smSssqService.remove(data);
  }
}
