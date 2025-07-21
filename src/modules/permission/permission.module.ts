

import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Module as module } from '@/modules/Module/Module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, module])],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule { }
