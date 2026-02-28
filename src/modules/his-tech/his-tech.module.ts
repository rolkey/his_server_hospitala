import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HisTechController } from './his-tech.controller';
import { HisTechService } from './his-tech.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';
import { h13_yzzxcs } from '../​​h13_yzzxcs​​/h13_yzzxcs.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Syspar, SysparNew, h12_yzxb, h13_yzzxcs]),
    // forwardRef(() => GyIdentityModule),
  ],
  controllers: [HisTechController],
  providers: [HisTechService, ParamService],
  exports: [HisTechService],
})
export class HisTechModule {}
