import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { SmSsapService } from './sm-ssap.service';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
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
  @ApiQuery({ name: 'zyid', required: false, description: '住院标识' })
  @ApiQuery({ name: 'ssrqStart', required: false, description: '手术日期起' })
  @ApiQuery({ name: 'ssrqEnd', required: false, description: '手术日期止' })
  @ApiQuery({ name: 'zfbz', required: false, description: '作废标志，默认 0' })
  @ApiQuery({ name: 'dateStart', required: false, description: '开始日期（入院日期范围）' })
  @ApiQuery({ name: 'dateEnd', required: false, description: '结束日期（入院日期范围）' })
  @ApiQuery({ name: 'rqcx', required: false, description: '是否按入院日期筛选，传 true 启用' })
  @ApiQuery({ name: 'zt', required: false, description: '状态：0=全部, 1=在院, 3=待办, 4=出院' })
  @ApiQuery({ name: 'cx', required: false, description: '检索关键字（住院号或姓名）' })
  @ApiQuery({ name: 'ksid', required: false, description: '科室ID，0 或空为全部' })
  @ApiQuery({ name: 'brlx', required: false, description: '病人类型ID，0 或空为全部' })
  async findFeeList(@Query() query: FeeListQueryDto) {
    return await this.smSsapService.findFeeList(query);
  }
}
