import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h21_brxx } from './h21-brxx.entity';
import { Jbbmicd10 } from '../jbbmicd/jbbmicd10.entity';
import { usrcat } from '../usrcat/usrcat.entity';
import { ksmc } from '../ksmc/ksmc.entity';
import { fyxx } from '../fyxx/fyxx.entity';
import { h21_brxxService } from './h21_brxx.service';
import { h21_brxxController } from './h21_brxx.controller';

@Module({
  imports: [TypeOrmModule.forFeature([h21_brxx, Jbbmicd10, usrcat, ksmc, fyxx])],
  controllers: [h21_brxxController],
  providers: [h21_brxxService],
  exports: [h21_brxxService],
})
export class h21_brxxModule {}

