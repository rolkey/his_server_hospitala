import { Global, Module } from '@nestjs/common';
import { h11_zybhService } from './h11_zybh.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h11_zybh } from './h11_zybh.entity';
import { h11_zybhController } from './h11_zybh.controller';
import { ParamService } from '@/modules/h12_xmzd/service/param.service';
import { Syspar } from '@/modules/h12_xmzd/entity/syspar.entity';
import { SysparNew } from '@/modules/h12_xmzd/entity/__syspar_new.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h11_zybh, Syspar, SysparNew])],
  controllers: [h11_zybhController],
  providers: [h11_zybhService, ParamService],
  exports: [h11_zybhService],
})
export class h11_zybhModule {}
