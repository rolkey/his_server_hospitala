// src/modules/sfxm.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SfxmController } from './sfxm.controller';
import { SfxmService } from './service/sfxm.service';
import { ParamService } from './service/param.service';
import { TempSfxm } from './entity/temp-sfxm.entity';
import { Syspar } from './entity/syspar.entity';
// import { Ypzd } from './entity/ypzd.entity';
// import { Kcxx } from './entity/kcxx.entity';
// import { Xmzd } from './entity/xmzd.entity';
import { SysparNew } from './entity/__syspar_new.entity';
import { ConfigReaderService } from './service/config-reader.service';
import { UsrcatModule } from '@/modules/usrcat/usrcat.module';
import { ksmcModule } from '@/modules/ksmc/ksmc.module';
import { usrcat as Usrcat } from '@/modules/usrcat/usrcat.entity';
import { ksmc as Ksmc } from '@/modules/ksmc/ksmc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TempSfxm, Syspar, SysparNew, Usrcat, Ksmc]),
    forwardRef(() => UsrcatModule),
    forwardRef(() => ksmcModule),
  ],
  controllers: [SfxmController],
  providers: [SfxmService, ParamService, ConfigReaderService],
  exports: [SfxmService, ParamService, ConfigReaderService],
})
export class SfxmModule {}
