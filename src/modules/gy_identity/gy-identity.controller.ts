import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GyIdentityService } from './gy-identity.service';
import { CreateGyIdentityDto } from './gy-identity.dto';
import { GyIdentity } from './gy-identity.entity';

@Controller('gy-identity')
export class GyIdentityController {
  constructor(private readonly gyIdentityService: GyIdentityService) {}

  @Post()
  create(@Body() createGyIdentityDto: CreateGyIdentityDto): Promise<GyIdentity> {
    return this.gyIdentityService.create(createGyIdentityDto);
  }

  @Get()
  findAll(): Promise<GyIdentity[]> {
    return this.gyIdentityService.findAll();
  }

  @Get(':tname')
  findOne(@Param('tname') tname: string): Promise<GyIdentity> {
    return this.gyIdentityService.findOne(tname);
  }

  @Put(':tname')
  update(
    @Param('tname') tname: string,
    @Body() updateData: Partial<CreateGyIdentityDto>,
  ): Promise<GyIdentity> {
    return this.gyIdentityService.update(tname, updateData);
  }

  @Delete(':tname')
  remove(@Param('tname') tname: string): Promise<void> {
    return this.gyIdentityService.remove(tname);
  }

  @Post('getTableMax')
  async getTableMax(@Body() createGyIdentityDto: CreateGyIdentityDto): Promise<number> {
    const { tname, inc_value } = createGyIdentityDto;
    return this.gyIdentityService.incTable(tname, inc_value);
  }
}
