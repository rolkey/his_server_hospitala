import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { QueryC00FbxxDto } from './dto/c00_fbxx.dto';
import { C00FbxxService } from './c00_fbxx.service';

@Controller('c00-fbxx')
export class C00FbxxController {
  constructor(private readonly c00FbxxService: C00FbxxService) {}

  // 根据条件查询
  @Get()
  async findAll(@Query() conditions: QueryC00FbxxDto) {
    return await this.c00FbxxService.findAll(conditions);
  }
}
