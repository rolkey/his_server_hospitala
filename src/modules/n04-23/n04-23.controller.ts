import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { N0423Service } from './n04-23.service';
import {
  CreateN0423Dto,
  QueryN0423Dto,
  UpdateN0423Dto,
  N0423BatchOperationDto,
  N0423ResponseDto,
} from './dto/n04-23.dto';

@ApiTags('n04-23')
@Controller('n04-23')
export class N0423Controller {
  constructor(private readonly n0423Service: N0423Service) {}

  @Post()
  @ApiOperation({ summary: '创建手术记录' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '创建成功', type: N0423ResponseDto })
  save(@Body() createDto: CreateN0423Dto) {
    return this.n0423Service.save(createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取手术记录列表' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  findAll(@Query() queryDto: QueryN0423Dto) {
    return this.n0423Service.findAll(queryDto);
  }
}
