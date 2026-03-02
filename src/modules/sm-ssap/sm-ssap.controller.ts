import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { SmSsapService } from './sm-ssap.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CancelSmSsapDto, CreateSmSsapDto, FeeListQueryDto } from './dto/sm-ssap.dto';

@ApiTags('手术安排管理')
@Controller('sm-ssap')
export class SmSsapController {
  constructor(private readonly smSsapService: SmSsapService) {}

  @Post()
  @ApiOperation({ summary: '新增手术安排通知单' })
  async create(@Body() createDto: CreateSmSsapDto) {
    return await this.smSsapService.create(createDto);
  }

  @Post('cancel')
  @ApiOperation({ summary: '取消手术安排（作废）' })
  @ApiBody({ type: CancelSmSsapDto, description: 'zyid: 住院标识；sqdh: 手术申请单号' })
  async cancel(@Body() dto: CancelSmSsapDto) {
    return await this.smSsapService.cancel(dto);
  }

  @Get('arranged-list')
  @ApiOperation({ summary: '已安排手术列表查询' })
  async findArrangedList() {
    return await this.smSsapService.findArrangedList();
  }

  @Get('detail/:sqdh')
  @ApiOperation({ summary: '手术安排通知单查看详情' })
  async findDetail(@Param('sqdh', ParseIntPipe) sqdh: number) {
    return await this.smSsapService.findDetail(sqdh);
  }

  @Get('fee-list')
  @ApiOperation({ summary: '费用列表查询' })
  async findFeeList(@Query() query: FeeListQueryDto) {
    return await this.smSsapService.findFeeList(query);
  }
}
