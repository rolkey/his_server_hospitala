// src/modules/h30_ypzd/h30_ypzd.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H30_ypzd } from './h30_ypzd.entity';
import { H30_ypzdService } from './h30_ypzd.service';
import { H30_ypzdController } from './h30_ypzd.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H30_ypzd])],
  providers: [H30_ypzdService],
  controllers: [H30_ypzdController],
})
export class H30_ypzdModule {}
