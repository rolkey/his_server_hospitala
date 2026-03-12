import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Views360Service } from './views_360.service';
import { MedicalRecordQueryDto } from './views_360.dto';
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
}
