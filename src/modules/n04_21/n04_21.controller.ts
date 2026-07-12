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
import { N0421WorkflowService } from './n04_21.workflow.service';
import { N0421 } from './n04_21.entity';
import { FindByZyidDto } from './dto/n04_21.dto';
import { PatientCaseWorkflowDto } from './dto/workflow.dto';

@ApiTags('n04-21')
@Controller('n0421')
export class N0421Controller {
  constructor(
    private readonly n0421Service: N0421Service,
    private readonly n0421WorkflowService: N0421WorkflowService,
  ) {}

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

  @Post('workflow')
  @ApiOperation({
    summary: '病案首页工作流（提交/归档/取消提交/取消归档）',
    description:
      '对齐 PB wf_gd/wf_qxgd。一次请求完成：业务数据保存 + 状态变更 +（归档时）NQ04 同步，全部在同一事务内。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '操作成功' })
  workflow(@Body() dto: PatientCaseWorkflowDto) {
    return this.n0421WorkflowService.runWorkflow(dto);
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
