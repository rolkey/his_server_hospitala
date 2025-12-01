import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h11_lshService } from './h11_lsh.service';
import { h11_lsh } from './h11_lsh.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { H11Jszb } from '../h11_jszb/h11_jszb.entity';
import { h11_brxxService } from '../h11_brxx/h11_brxx.service';
import { h11_lshController } from './h11_lsh.controller';
import { h00_fylbService } from '../h00_fylb/h00_fylb.service';
import { h00_fylb } from '../h00_fylb/h00_fylb.entity';
import { Syspar } from '../h12_xmzd/entity/syspar.entity';
import { SysparNew } from '../h12_xmzd/entity/__syspar_new.entity';
import { ParamService } from '../h12_xmzd/service/param.service';

@Module({
  imports: [TypeOrmModule.forFeature([h11_lsh, h11_brxx, H11Jszb, h00_fylb, Syspar, SysparNew])],
  providers: [h11_lshService, h11_brxxService, h00_fylbService, ParamService],
  controllers: [h11_lshController], // 确保h11_lshController被导入
  exports: [h11_lshService],
})
export class h11_lshModule {}
