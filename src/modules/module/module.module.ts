import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as module } from './module.entity';
import { ModuleService } from './module.service';
import { Permission } from '../permission/permission.entity';
import { Role } from '../role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([module, Role, Permission])],
  providers: [ModuleService],
  controllers: [ModuleController],
})
export class ModuleModule {}
