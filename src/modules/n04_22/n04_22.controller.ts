import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { N0422Service } from './n04_22.service';
import { N0422 } from './n04_22.entity';

@Controller('n0422')
export class N0422Controller {
  constructor(private readonly n0422Service: N0422Service) {}

  //   @Post()
  //   create(@Body() createN0422Dto: Partial<N0422>) {
  //     return this.n0422Service.create(createN0422Dto);
  //   }

  @Get()
  find(@Query() condition: Partial<N0422>) {
    return this.n0422Service.findByCondition(condition);
  }

  //   @Put()
  //   update(@Body() updateN0422Dto: Partial<N0422>) {
  //     return this.n0422Service.update(updateN0422Dto);
  //   }

  //   @Delete(':zyid/:zdxh')
  //   remove(@Param('zyid') zyid: string, @Param('zdxh') zdxh: number) {
  //     return this.n0422Service.remove(zyid, zdxh);
  //   }

  @Post()
  save(@Body() data: { zyid: string; list: Partial<N0422>[] }) {
    return this.n0422Service.save(data.zyid, data.list);
  }
}
