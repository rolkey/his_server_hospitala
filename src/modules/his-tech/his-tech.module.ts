import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HisTechController } from './his-tech.controller';
import { HisTechService } from './his-tech.service';
import { ParamService } from '../h12_xmzd/service/param.service';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Syspar, SysparNew]),
    // forwardRef(() => GyIdentityModule),
  ],
  controllers: [HisTechController],
  providers: [HisTechService, ParamService],
  exports: [HisTechService],
})
export class HisTechModule {}
