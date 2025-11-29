import { forwardRef, Global, Module } from '@nestjs/common';
import { h11_brxxService } from './h11_brxx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h11_brxx } from './h11_brxx.entity';
import { h11_brxxController } from './h11_brxx.controller';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { h00_brlx } from '../h00_brlx/h00_brlx.entity';
import { h00_rybq } from '../h00_rybq/h00_rybq.entity';
import { Jbbmicd10 } from '../jbbmicd/jbbmicd10.entity';
import { h11_lsh } from '../h11_lsh/h11_lsh.entity';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';
import { h11_zybh } from '../h11_zybh/h11_zybh.entity';
import { h11_zybhService } from '../h11_zybh/h11_zybh.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';
import { H11Jszb } from '../h11_jszb/h11_jszb.entity';
import { h00_fylbService } from '../h00_fylb/h00_fylb.service';
import { h00_fylb } from '../h00_fylb/h00_fylb.entity';
import { h13_cwsyxx } from '../h13_cwsyxx/h13_cwsyxx.entity';
// import { Jbbmicd10Module } from '../jbbmicd/jbbmicd10.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      h11_brxx,
      ksmc,
      h00_cwxx,
      h13_cwsyxx,
      usrcat,
      h00_rybq,
      h00_brlx,
      Jbbmicd10,
      h11_lsh,
      h11_zybh,
      Syspar,
      SysparNew,
      H11Jszb,
      h00_fylb,
    ]),
    // forwardRef(() => Jbbmicd10Module),
  ],
  controllers: [h11_brxxController],
  providers: [h11_brxxService, h11_lshService, h11_zybhService, ParamService, h00_fylbService],
  exports: [h11_brxxService],
})
export class h11_brxxModule {}
