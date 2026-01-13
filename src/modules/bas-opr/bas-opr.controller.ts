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
import { BasOprService } from './bas-opr.service';
import { CreateBasOprDto, QueryBasOprDto, UpdateBasOprDto } from './dto/bas-opr.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('bas-opr')
@Controller('bas-opr')
export class BasOprController {
  constructor(private readonly basOprService: BasOprService) {}

  @Post()
  @ApiOperation({ summary: '创建手术信息' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '创建成功' })
  create(@Body() createDto: CreateBasOprDto) {
    return this.basOprService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取手术信息列表' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  findAll(@Query() queryDto: QueryBasOprDto) {
    return this.basOprService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个手术信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取成功' })
  findOne(@Param('id') id: string) {
    return this.basOprService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新手术信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '更新成功' })
  update(@Param('id') id: string, @Body() updateDto: UpdateBasOprDto) {
    return this.basOprService.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除手术信息' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.basOprService.remove(+id);
  }
}
