// src/h12_mbzb/h12_mbzb.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H12_mbzb } from './h12_mbzb.entity';
import { H12_mbzbService } from './h12_mbzb.service';
import { H12_mbzbController } from './h12_mbzb.controller';
import { ksmc } from '@/modules/ksmc/ksmc.entity';
import { usrcat } from '@/modules/usrcat/usrcat.entity';
import { H13YzzxcsTfModule } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.module';
import { H12_mbxbService } from '../h12_mbxb/h12_mbxb.service';
import { H12_mbxb } from '../h12_mbxb/h12_mbxb.entity';
import { H00TcxbZyfj } from '../h00_tcxb/entity/h00_tcxb_zyfj.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([H12_mbzb, ksmc, usrcat, H12_mbxb, H00TcxbZyfj]),
    forwardRef(() => H13YzzxcsTfModule),
  ],
  providers: [H12_mbzbService, H12_mbxbService],
  controllers: [H12_mbzbController],
  exports: [H12_mbzbService],
})
export class H12_mbzbModule {}
