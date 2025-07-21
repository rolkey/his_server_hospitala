import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from '@/modules/permission/permission.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { Module as module } from '@/modules/Module/Module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, usrcat, module])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
