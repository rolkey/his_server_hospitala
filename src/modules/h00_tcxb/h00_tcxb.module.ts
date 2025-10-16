// src/h00_tcxb/h00-tcxb-combined.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H00TcxbService } from './service/h00_tcxb.service';
import { H00TcxbController } from './h00_tcxb.controller';
import { H00Tcxb } from './entity/h00_tcxb.entity';
import { h00_syff } from '../h00_syff/h00_syff.entity';
import { H00TcxbZyfj } from './entity/h00_tcxb_zyfj.entity';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H00Tcxb, H00TcxbZyfj, H00_xmzd, h00_syff])],
  controllers: [H00TcxbController],
  providers: [H00TcxbService],
  exports: [H00TcxbService],
})
export class H00TcxbModule {}
