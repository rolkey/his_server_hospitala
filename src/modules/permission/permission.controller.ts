
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { JwtGuard, PreviewGuard } from '@/common/guards';

@UseGuards(JwtGuard)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Post()
  @UseGuards(PreviewGuard)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Post('batch')
  @UseGuards(PreviewGuard)
  batchCreate(@Body() createPermissionDtos: CreatePermissionDto[]) {
    return this.permissionService.batchCreate(createPermissionDtos);
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get('findAllParent')
  findAllParent() {
    return this.permissionService.findAllParent();
  }

  @Get('tree')
  findAllTree() {
    return this.permissionService.findAllTree();
  }

  @Get('menu/tree')
  findMenuTree() {
    return this.permissionService.findMenuTree();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PreviewGuard)
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @UseGuards(PreviewGuard)
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }

  @Get('button/:parentId')
  findButton(@Param('parentId') parentId: string) {
    return this.permissionService.findButton(parentId);
  }

  /* 校验 path 存不存在menu资源内  */
  @Get('menu/validate')
  validateMenuPath(@Query('path') path: string) {
    return this.permissionService.validateMenuPath(path);
  }
}
