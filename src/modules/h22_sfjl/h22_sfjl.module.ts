// src/h22-sfjl/h22-sfjl.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H22Sfjl } from './h22_sfjl.entity';
import { H22SfjlService } from './h22_sfjl.service';
import { H22SfjlController } from './h22_sfjl.controller';
import { ParamService } from '../h12_xmzd/service/param.service';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { GyIdentity } from '../gy_identity/gy-identity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H22Sfjl, Syspar, SysparNew, GyIdentity])],
  providers: [H22SfjlService, ParamService, GyIdentityService],
  controllers: [H22SfjlController],
  exports: [H22SfjlService],
})
export class H22SfjlModule {}
