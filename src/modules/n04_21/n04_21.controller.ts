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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { N0421Service } from './n04_21.service';
import { N0421WorkflowService } from './n04_21.workflow.service';
import { N0421SettlementService } from './n04_21.settlement.service';
import { N0421ReceiveService } from './n04_21.receive.service';
import { N0421AuditService } from './n04_21.audit.service';
import { N0421UnlockService } from './n04_21.unlock.service';
import { N0421SearchService } from './n04_21.search.service';
import { N0421 } from './n04_21.entity';
import { FindByZyidDto } from './dto/n04_21.dto';
import { PatientCaseWorkflowDto } from './dto/workflow.dto';
import { ReceiveListQueryDto, ReceiveSignDto, ReceiveUnsignDto } from './dto/receive-list.dto';
import { AuditListQueryDto } from './dto/audit-list.dto';
import { UnlockFormQueryDto, UnlockSaveDto } from './dto/unlock.dto';
import { UnlockListQueryDto } from './dto/unlock-list.dto';
import { SearchListQueryDto } from './dto/search-list.dto';

@ApiTags('n04-21')
@Controller('n0421')
export class N0421Controller {
  constructor(
    private readonly n0421Service: N0421Service,
    private readonly n0421WorkflowService: N0421WorkflowService,
    private readonly n0421SettlementService: N0421SettlementService,
    private readonly n0421ReceiveService: N0421ReceiveService,
    private readonly n0421AuditService: N0421AuditService,
    private readonly n0421UnlockService: N0421UnlockService,
    private readonly n0421SearchService: N0421SearchService,
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

  @Get('receive-list')
  @ApiOperation({
    summary: '病案首页接收列表',
    description:
      '对齐 PB 首页接收 dw_dj.retrieve。按出院/结算日期、科室、签收状态等查询待接收病案。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  findReceiveList(@Query() query: ReceiveListQueryDto) {
    return this.n0421ReceiveService.findReceiveList(query);
  }

  @Get('audit-list')
  @ApiOperation({
    summary: '病案首页审核列表',
    description:
      '对齐 PB 首页审核 dw_dj.retrieve。按出院/结算日期、科室、患者类型、提交/审核/DRG 状态查询。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  findAuditList(@Query() query: AuditListQueryDto) {
    return this.n0421AuditService.findAuditList(query);
  }

  @Post('search-list')
  @ApiOperation({
    summary: '病案查询列表',
    description:
      '查询 N04_21，出院诊断取 N04_22 主诊/西医诊断。filters 可按列表字段动态增删条件。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  findSearchList(@Body() dto: SearchListQueryDto) {
    return this.n0421SearchService.findSearchList(dto);
  }

  @Post('receive-sign')
  @ApiOperation({
    summary: '病案首页签收',
    description:
      '对齐 PB 签收。对未签收病人写入 n04_czjl：无记录则新增，已有未签收记录则更新；已签收跳过。接受人为当前登录用户。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '签收成功' })
  signReceive(@Body() dto: ReceiveSignDto, @Req() req: { user?: { usid?: string } }) {
    return this.n0421ReceiveService.signReceive(dto, req.user?.usid || dto.czry || '');
  }

  @Get('unlock-discharge-list')
  @ApiOperation({
    summary: '首页解锁-出院病人列表',
    description:
      '对齐 PB dw_cybr。按出院日期、病人类型、姓名、住院号、科室、电话、身份证号查询 h11_brxx。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  findUnlockDischargeList(@Query() query: UnlockListQueryDto) {
    return this.n0421UnlockService.findDischargeList(query);
  }

  @Get('unlock-record-list')
  @ApiOperation({
    summary: '首页解锁-解锁记录列表',
    description:
      '对齐 PB dw_2。h12_bljs INNER JOIN h11_brxx，查询条件与出院病人列表相同。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  findUnlockRecordList(@Query() query: UnlockListQueryDto) {
    return this.n0421UnlockService.findUnlockRecordList(query);
  }

  @Get('unlock-form')
  @ApiOperation({
    summary: '病案首页解锁表单',
    description:
      '对齐 PB w_basy_edit 打开逻辑。按住院ID预填新解锁记录：病历类型=首页，解锁期限默认次日 23:59:59。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  getUnlockForm(@Query() query: UnlockFormQueryDto) {
    return this.n0421UnlockService.getUnlockForm(query);
  }

  @Post('unlock')
  @ApiOperation({
    summary: '病案首页解锁',
    description:
      '对齐 PB w_basy_edit 保存。校验证号/姓名后写入 h12_bljs，yxbz=1，用于超过录入时限后重新放开首页编辑。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '保存成功' })
  saveUnlock(@Body() dto: UnlockSaveDto, @Req() req: { user?: { usid?: string } }) {
    return this.n0421UnlockService.saveUnlock(dto, req.user?.usid || dto.czry || '');
  }

  @Post('receive-unsign')
  @ApiOperation({
    summary: '病案首页取消签收',
    description:
      '对齐 PB 取消签收。仅处理已签收（jsbz=1）记录：清空接受人/交接人，更新操作时间，jsbz 置 0；未签收跳过。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '取消签收成功' })
  unsignReceive(@Body() dto: ReceiveUnsignDto) {
    return this.n0421ReceiveService.unsignReceive(dto);
  }

  @Get('settlement')
  @ApiOperation({
    summary: '医保结算单打印数据',
    description:
      '汇总基本信息、诊断、手术、机构信息、医保结算与费用分类等，用于医保基金结算清单打印预览。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功' })
  getSettlementSheet(@Query() query: FindByZyidDto) {
    return this.n0421SettlementService.getSettlementSheet(query.zyid);
  }

  @Post('workflow')
  @ApiOperation({
    summary: '病案首页工作流（提交/归档/病案室审核/取消提交/取消归档）',
    description:
      '对齐 PB wf_gd/wf_qxgd/病案室审核/取消审核。一次请求完成：业务数据保存 + 状态变更 +（归档/审核时）NQ04 同步，全部在同一事务内。',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '操作成功' })
  workflow(
    @Body() dto: PatientCaseWorkflowDto,
    @Req() req: { user?: { usid?: string } },
  ) {
    return this.n0421WorkflowService.runWorkflow(
      dto,
      req.user?.usid || dto.shry || '',
    );
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
