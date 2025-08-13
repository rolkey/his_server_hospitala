import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { H40SqzbService } from './h40-sqzb.service';
import {
  CreateH40SqzbDto,
  UpdateH40SqzbDto,
  QueryH40SqzbDto,
  H40SqzbResponseDto,
} from './h40_sqzb.dto';
import { H40Sqzb } from './h40_sqzb.entity';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('申请单管理')
@Controller('h40-sqzb')
export class H40SqzbController {
  constructor(private readonly h40SqzbService: H40SqzbService) {}

  @Post()
  @ApiOperation({ summary: '创建申请单' })
  @ApiResponse({ status: 201, type: H40SqzbResponseDto })
  async create(@Body() createDto: CreateH40SqzbDto): Promise<H40SqzbResponseDto> {
    return await this.h40SqzbService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '分页查询申请单列表' })
  @ApiQuery({ name: 'pageNo', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({ status: 200, type: [H40SqzbResponseDto] })
  async findAll(
    @Query() queryDto: QueryH40SqzbDto,
    @Query('pageNo', new DefaultValuePipe(1), ParseIntPipe) pageNo?: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize?: number,
  ): Promise<{ data: H40SqzbResponseDto[]; total: number }> {
    const [data, total] = await this.h40SqzbService.findAll({
      ...queryDto,
      pageNo,
      pageSize,
    });
    return { data, total };
  }

  @Get(':djbh')
  @ApiOperation({ summary: '根据单据编号获取申请单详情' })
  @ApiResponse({ status: 200, type: H40SqzbResponseDto })
  async findOne(@Param('djbh') djbh: string): Promise<H40SqzbResponseDto> {
    return await this.h40SqzbService.findOne(djbh);
  }

  @Put(':djbh')
  @ApiOperation({ summary: '更新申请单信息' })
  @ApiResponse({ status: 200, type: H40SqzbResponseDto })
  async update(
    @Param('djbh') djbh: string,
    @Body() updateDto: UpdateH40SqzbDto,
  ): Promise<H40SqzbResponseDto> {
    return await this.h40SqzbService.update(djbh, updateDto);
  }

  @Delete(':djbh')
  @ApiOperation({ summary: '删除单个申请单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('djbh') djbh: string): Promise<void> {
    await this.h40SqzbService.remove(djbh);
  }

  @Delete()
  @ApiOperation({ summary: '批量删除申请单' })
  @ApiResponse({ status: 200, description: '批量删除成功' })
  async batchRemove(@Body() djbhList: string[]): Promise<void> {
    await this.h40SqzbService.batchRemove(djbhList);
  }

  @Get('find-and-create')
  async findAndCreate(@Query() yzzh: string, zyid: string, xmid: string) {
    return this.h40SqzbService.findAndCreate(yzzh, zyid, xmid);
  }
}
