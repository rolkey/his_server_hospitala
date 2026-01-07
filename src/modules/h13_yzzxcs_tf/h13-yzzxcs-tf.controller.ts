import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { H13YzzxcsTfService } from './h13-yzzxcs-tf.service';
import {
  CreateH13YzzxcsTfDto,
  UpdateH13YzzxcsTfDto,
  QueryH13YzzxcsTfDto,
  H13YzzxcsTfResponseDto,
} from './h13-yzzxcs-tf.dto';
import { plainToInstance } from 'class-transformer';
import { QueryYzzxcsDto } from './dto/h13-yzzxcs-tf.dto';

@Controller('h13-yzzxcs-tf')
export class H13YzzxcsTfController {
  constructor(private readonly h13YzzxcsTfService: H13YzzxcsTfService) {}

  @Post()
  async create(@Body() createDto: CreateH13YzzxcsTfDto): Promise<H13YzzxcsTfResponseDto> {
    const entity = await this.h13YzzxcsTfService.create(createDto);
    return plainToInstance(H13YzzxcsTfResponseDto, entity);
  }

  @Get()
  async findAll(
    @Query() queryDto: QueryH13YzzxcsTfDto,
  ): Promise<{ data: H13YzzxcsTfResponseDto[]; meta: any }> {
    const result = await this.h13YzzxcsTfService.findAll(queryDto);
    return {
      data: plainToInstance(H13YzzxcsTfResponseDto, result.data),
      meta: {
        total: result.total,
        pageNo: result.pageNo,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
      },
    };
  }

  // 新增的查询接口
  @Get('query-yzzxcs')
  async queryYzzxcs(@Query() params: QueryYzzxcsDto) {
    return await this.h13YzzxcsTfService.queryYzzxcs(params);
  }

  @Get(':yzlx/:yzxh/:mxxh/:zyid/:zxrq')
  async findOne(
    @Param('yzlx') yzlx: number,
    @Param('yzxh') yzxh: number,
    @Param('mxxh') mxxh: number,
    @Param('zyid') zyid: string,
    @Param('zxrq') zxrq: string,
  ): Promise<H13YzzxcsTfResponseDto | null> {
    const entity = await this.h13YzzxcsTfService.findOne({
      yzlx: +yzlx,
      yzxh: +yzxh,
      mxxh: +mxxh,
      zyid,
      zxrq: new Date(zxrq),
    });
    return entity ? plainToInstance(H13YzzxcsTfResponseDto, entity) : null;
  }

  @Put(':yzlx/:yzxh/:mxxh/:zyid/:zxrq')
  async update(
    @Param('yzlx') yzlx: number,
    @Param('yzxh') yzxh: number,
    @Param('mxxh') mxxh: number,
    @Param('zyid') zyid: string,
    @Param('zxrq') zxrq: string,
    @Body() updateDto: UpdateH13YzzxcsTfDto,
  ): Promise<H13YzzxcsTfResponseDto | null> {
    const entity = await this.h13YzzxcsTfService.update(
      {
        yzlx: +yzlx,
        yzxh: +yzxh,
        mxxh: +mxxh,
        zyid,
        zxrq: new Date(zxrq),
      },
      updateDto,
    );
    return entity ? plainToInstance(H13YzzxcsTfResponseDto, entity) : null;
  }

  @Delete(':yzlx/:yzxh/:mxxh/:zyid/:zxrq')
  async remove(
    @Param('yzlx') yzlx: number,
    @Param('yzxh') yzxh: number,
    @Param('mxxh') mxxh: number,
    @Param('zyid') zyid: string,
    @Param('zxrq') zxrq: string,
  ): Promise<void> {
    await this.h13YzzxcsTfService.remove({
      yzlx: +yzlx,
      yzxh: +yzxh,
      mxxh: +mxxh,
      zyid,
      zxrq: new Date(zxrq),
    });
  }
}
