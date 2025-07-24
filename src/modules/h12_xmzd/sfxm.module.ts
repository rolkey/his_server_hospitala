// src/modules/sfxm.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SfxmController } from './sfxm.controller';
import { SfxmService } from './service/sfxm.service';
import { ParamService } from './service/param.service';
import { TempSfxm } from './entity/temp-sfxm.entity';
import { Syspar } from './entity/syspar.entity';
import { Ypzd } from './entity/ypzd.entity';
import { Kcxx } from './entity/kcxx.entity';
import { Xmzd } from './entity/xmzd.entity';
import { SysparNew } from './entity/__syspar_new.entity';
import { ConfigReaderService } from './service/config-reader.service';

@Module({
  imports: [TypeOrmModule.forFeature([TempSfxm, Syspar, Ypzd, Kcxx, Xmzd, SysparNew])],
  controllers: [SfxmController],
  providers: [SfxmService, ParamService, ConfigReaderService],
})
export class SfxmModule {}
