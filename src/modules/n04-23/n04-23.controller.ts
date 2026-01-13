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
  create(@Body() createDto: CreateN0423Dto) {
    return this.n0423Service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取手术记录列表' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  findAll(@Query() queryDto: QueryN0423Dto) {
    return this.n0423Service.findAll(queryDto);
  }

  @Get(':zyid/:ssxh')
  @ApiOperation({ summary: '获取单个手术记录' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功', type: N0423ResponseDto })
  findOne(@Param('zyid') zyid: string, @Param('ssxh') ssxh: number) {
    return this.n0423Service.findOne(zyid, ssxh);
  }

  @Patch(':zyid/:ssxh')
  @ApiOperation({ summary: '更新手术记录' })
  @ApiResponse({ status: HttpStatus.OK, description: '更新成功', type: N0423ResponseDto })
  update(
    @Param('zyid') zyid: string,
    @Param('ssxh') ssxh: number,
    @Body() updateDto: UpdateN0423Dto,
  ) {
    return this.n0423Service.update(zyid, ssxh, updateDto);
  }

  @Delete(':zyid/:ssxh')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除手术记录' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: '删除成功' })
  remove(@Param('zyid') zyid: string, @Param('ssxh') ssxh: number) {
    return this.n0423Service.remove(zyid, ssxh);
  }

  @Post('batch')
  @ApiOperation({ summary: '批量操作手术记录' })
  @ApiResponse({ status: HttpStatus.OK, description: '操作成功' })
  batchOperation(@Body() operationDto: N0423BatchOperationDto) {
    return this.n0423Service.batchOperation(operationDto);
  }
}
