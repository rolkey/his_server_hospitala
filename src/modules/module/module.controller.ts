import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateDto, UpdateDto, QueryDto } from './dto';
import { ModuleService } from './module.service';
import { JwtGuard } from '@/common/guards';

@Controller('module')
@UseGuards(JwtGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}
  @Get()
  findAll(@Query() queryDto: QueryDto) {
    return this.moduleService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateDto) {
    return this.moduleService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return this.moduleService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleService.remove(id);
  }
}
