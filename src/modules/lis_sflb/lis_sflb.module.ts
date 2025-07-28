// src/lis_sflb/lis_sflb.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lis_sflb } from './lis_sflb.entity';
import { Lis_sflbService } from './lis_sflb.service';
import { Lis_sflbController } from './lis_sflb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lis_sflb])],
  providers: [Lis_sflbService],
  controllers: [Lis_sflbController],
  exports: [Lis_sflbService],
})
export class Lis_sflbModule {}
