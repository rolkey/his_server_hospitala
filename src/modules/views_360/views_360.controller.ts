import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Views360Service } from './views_360.service';
import { FeeDetailQueryDto, FeeSummaryQueryDto, MedicalRecordQueryDto } from './views_360.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('views_360-360视图')
@Controller('views_360')
export class Views360Controller {
  constructor(private readonly views360Service: Views360Service) {}

  @Get('findMedicalRecord')
  @ApiOperation({ summary: '历次就诊信息' })
  findMedicalRecord(@Query() queryDto: MedicalRecordQueryDto) {
    return this.views360Service.findMedicalRecord(queryDto);
  }

  @Get('findPatientInfo')
  @ApiOperation({ summary: '患者基本信息' })
  findPatientInfo(@Query('ylzh') ylzh: string) {
    return this.views360Service.findPatientInfo(ylzh);
  }
  // 费用清单汇总
  @Get('findFeeSummary')
  @ApiOperation({ summary: '费用清单汇总' })
  findFeeSummary(@Query() feeSummaryQueryDto: FeeSummaryQueryDto) {
    return this.views360Service.findFeeSummary(feeSummaryQueryDto);
  }

  // 费用清单明细
  @Get('findFeeDetail')
  @ApiOperation({ summary: '费用清单明细' })
  findFeeDetail(@Query() feeDetailQueryDto: FeeDetailQueryDto) {
    return this.views360Service.findFeeDetail(feeDetailQueryDto);
  }
}
