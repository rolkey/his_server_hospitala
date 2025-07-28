// src/h12_mbxb/h12_mbxb.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H12_mbxb } from './h12_mbxb.entity';
import { H12_mbxbService } from './h12_mbxb.service';
import { H12_mbxbController } from './h12_mbxb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H12_mbxb])],
  providers: [H12_mbxbService],
  controllers: [H12_mbxbController],
  exports: [H12_mbxbService],
})
export class H12_mbxbModule {}
