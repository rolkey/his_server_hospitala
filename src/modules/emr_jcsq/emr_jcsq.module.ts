import { forwardRef, Global, Module } from '@nestjs/common';
import { emr_jcsqService } from './emr_jcsq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { emr_jcsq } from './emr_jcsq.entity';
import { emr_jcsqController } from './emr_jcsq.controller';
import { emr_jcsqmx } from './emr_jcsqmx.entity';
import { GyIdentityModule } from '../gy_identity/gy-identity.module';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { h12_yzxbService } from '../h12_yzzb/h12_yzxb.service';
import { ConfigReaderService } from '../h12_xmzd/service/config-reader.service';
import { H31_kcxxService } from '../h31_kcxx/h31_kcxx.service';
import { H00TcxbService } from '../h00_tcxb/service/h00_tcxb.service';
import { H11Jshztzd1Service } from '../h11_jshztzd1/h11-jshztzd1.service';
import { h13_yzzxcsService } from '../​​h13_yzzxcs​​/h13_yzzxcs.service';
import { H12CyclService } from '../h12-cycl/h12-cycl.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { GyIdentity } from '../gy_identity/gy-identity.entity';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';
import { h00_sypl } from '../h00_sypl/h00_sypl.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';
import { H31_kcxx } from '../h31_kcxx/h31_kcxx.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';
import { H30_ypzd } from '../h30_ypzd/h30_ypzd.entity';
import { H00Tcxb } from '../h00_tcxb/entity/h00_tcxb.entity';
import { H00TcxbZyfj } from '../h00_tcxb/entity/h00_tcxb_zyfj.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { H11Jshztzd1 } from '../h11_jshztzd1/h11-jshztzd1.entity';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { H12Cycl } from '../h12-cycl/h12-cycl.entity';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';
import { Mzff } from '../mzff/mzff.entity';
import { h12_yzzbModule } from '../h12_yzzb/h12_yzzb.module';
import { h21_brxx } from '../h21_brxx/h21-brxx.entity';
import { N0422 } from '../n04_22/n04_22.entity';
import { N04_23 } from '../n04-23/n04-23.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      emr_jcsq,
      emr_jcsqmx,
      h11_brxx,
      h21_brxx,
      GyIdentity,
      h12_yzxb,
      h00_sypl,
      h13_yzzxcs,
      H31_kcxx,
      usrcat,
      ksmc,
      H00_xmzd,
      H30_ypzd,
      H00Tcxb,
      H00TcxbZyfj,
      h00_syff,
      H11Jshztzd1,
      H13YzzxcsTf,
      H12Cycl,
      Syspar,
      SysparNew,
      Mzff,
      N0422,
      N04_23,
    ]),
    forwardRef(() => GyIdentityModule),
    forwardRef(() => h12_yzzbModule),
  ],
  controllers: [emr_jcsqController],
  providers: [
    emr_jcsqService,
    GyIdentityService,
    h12_yzxbService,
    ConfigReaderService,
    H31_kcxxService,
    H00TcxbService,
    H11Jshztzd1Service,
    h13_yzzxcsService,
    H12CyclService,
    ParamService,
  ],
  exports: [emr_jcsqService],
})
export class emr_jcsqModule {}
