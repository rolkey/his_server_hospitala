// src/h12_mbzb/h12_mbzb.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H12_mbzb } from './h12_mbzb.entity';
import { H12_mbzbService } from './h12_mbzb.service';
import { H12_mbzbController } from './h12_mbzb.controller';
import { ksmc } from '@/modules/ksmc/ksmc.entity';
import { usrcat } from '@/modules/usrcat/usrcat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H12_mbzb, ksmc, usrcat])],
  providers: [H12_mbzbService],
  controllers: [H12_mbzbController],
  exports: [H12_mbzbService],
})
export class H12_mbzbModule {}
