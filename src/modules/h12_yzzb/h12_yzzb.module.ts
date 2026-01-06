import { Global, Module, forwardRef } from '@nestjs/common';
import { h12_yzzbService } from './h12_yzzb.service';
import { h12_yzxbService } from './h12_yzxb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzzbController } from './h12_yzzb.controller';

import { h12_yzxb } from './h12_yzxb.entity';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { h00_fylb } from '../h00_fylb/h00_fylb.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { h13_cwsyxx } from '../h13_cwsyxx/h13_cwsyxx.entity';
import { GyIdentityModule } from '../gy_identity/gy-identity.module';
import { SfxmModule } from '../h12_xmzd/sfxm.module';
// import { SunsoftModule } from '../sunsoft/sunsoft.module';
import { H31_kcxxModule } from '../h31_kcxx/h31_kcxx.module';
import { H00TcxbModule } from '../h00_tcxb/h00_tcxb.module';
import { SharedModule } from '@/shared/shared.module';
import { H11Jshztzd1Module } from '../h11_jshztzd1/h11-jshztzd1.module';
import { h13_yzzxcsModule } from '../​​h13_yzzxcs​​/h13_yzzxcs.module';
import { h13_yzzxcsService } from '../​​h13_yzzxcs​​/h13_yzzxcs.service';
import { H13YzzxcsTfModule } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.module';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { ContextService } from '@/shared/context.service';
import { BabyAdviceService } from './baby-advice.service';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_lshModule } from '../h11_lsh/h11_lsh.module';
import { h11_lsh } from '../h11_lsh/h11_lsh.entity';
import { H11Jszb } from '../h11_jszb/h11_jszb.entity';
import { h12_yzxbServiceNew } from './h12_yzxb.service_new';
import { SfxmService } from '../h12_xmzd/service/sfxm.service';
import { TempSfxm } from '../h12_xmzd/entity/temp-sfxm.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';
// import { H00TcxbService } from '../h00_tcxb/service/h00_tcxb.service';
// import { UsrcatModule } from '../usrcat/usrcat.module';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';
import { H31Lyjl } from '../h31_lyjl/h31_lyjl.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
import { H12CyclModule } from '../h12-cycl/h12-cycl.module';
import { H12CyclService } from '../h12-cycl/h12-cycl.service';
import { H12Cycl } from '../h12-cycl/h12-cycl.entity';
import { C00Fbxx } from '../c00_fbxx/c00_fbxx.entity';
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
      h11_lsh,
      H11Jszb,
      h11_brxx,
      H13YzzxcsTf,
      TempSfxm,
      SysparNew,
      H00_xmzd,
      H31Lyjl,
      H12Cycl,
      h13_cwsyxx,
      C00Fbxx,
    ]),
    forwardRef(() => GyIdentityModule),
    forwardRef(() => SfxmModule),
    // forwardRef(() => SunsoftModule),
    forwardRef(() => H31_kcxxModule),
    forwardRef(() => H00TcxbModule),
    forwardRef(() => H11Jshztzd1Module),
    forwardRef(() => h13_yzzxcsModule),
    forwardRef(() => H13YzzxcsTfModule),
    forwardRef(() => SharedModule),
    forwardRef(() => h11_lshModule),
    forwardRef(() => H12CyclModule),
  ],
  controllers: [h12_yzzbController],
  providers: [
    h12_yzzbService,
    h12_yzxbService,
    h12_yzxbServiceNew,
    h13_yzzxcsService,
    ContextService,
    BabyAdviceService,
    h11_lshService,
    SfxmService,
    H12CyclService,
  ],
  exports: [h12_yzzbService, h12_yzxbService, h12_yzxbServiceNew],
})
export class h12_yzzbModule {}
