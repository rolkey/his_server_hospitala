import { Global, Module, forwardRef } from '@nestjs/common';
import { h12_yzzbService } from './h12_yzzb.service';
import { h12_yzxbService } from './h12_yzxb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzzbController } from './h12_yzzb.controller';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { h00_fylb } from '../h00_fylb/h00_fylb.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { GyIdentityModule } from '../gy_identity/gy-identity.module';
import { SfxmModule } from '../h12_xmzd/sfxm.module';
import { SunsoftModule } from '../sunsoft/sunsoft.module';
import { H31_kcxxModule } from '../h31_kcxx/h31_kcxx.module';
import { H00TcxbModule } from '../h00_tcxb/h00_tcxb.module';
import { SharedModule } from '@/shared/shared.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      h12_yzzb,
      h13_yzzxcs,
      h12_yzxb,
      usrcat,
      ksmc,
      h00_cwxx,
      h00_fylb,
      h00_syff,
      h00_sypl,
      h11_brxx,
    ]),
    SharedModule,
    forwardRef(() => GyIdentityModule),
    forwardRef(() => SfxmModule),
    forwardRef(() => SunsoftModule),
    forwardRef(() => H31_kcxxModule),
    forwardRef(() => H00TcxbModule),
  ],
  controllers: [h12_yzzbController],
  providers: [h12_yzzbService, h12_yzxbService],
  exports: [h12_yzzbService],
})
export class h12_yzzbModule {}
