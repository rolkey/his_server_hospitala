import { Global, Module } from '@nestjs/common';
import { h11_brxxService } from './h11_brxx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h11_brxx } from './h11_brxx.entity';
import { h11_brxxController } from './h11_brxx.controller';
import { ksmc } from '../ksmc/ksmc.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { h00_cwxx } from '../h00_cwxx/h00_cwxx.entity';
import { h00_brlx } from '../h00_brlx/h00_brlx.entity';
import { h00_rybq } from '../h00_rybq/h00_rybq.entity';
import { jbbmicd10 } from '../jbbmicd/jbbmicd10.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([h11_brxx, ksmc, h00_cwxx, usrcat, h00_rybq, h00_brlx, jbbmicd10]),
  ],
  controllers: [h11_brxxController],
  providers: [h11_brxxService],
  exports: [h11_brxxService],
})
export class h11_brxxModule {}
