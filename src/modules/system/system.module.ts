import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemService } from './system.service';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';
import { ParamService } from '../h12_xmzd/service/param.service';
import { SystemController } from './system.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Syspar, SysparNew])],
  providers: [SystemService, ParamService],
  controllers: [SystemController],
  exports: [SystemService],
})
export class SystemModule {}
