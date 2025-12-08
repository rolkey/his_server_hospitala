// src/h22-sfjl/h22-sfjl.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H22Sfjl } from './h22_sfjl.entity';
import { H22SfjlService } from './h22_sfjl.service';
import { H22SfjlController } from './h22_sfjl.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H22Sfjl])],
  providers: [H22SfjlService],
  controllers: [H22SfjlController],
  exports: [H22SfjlService],
})
export class H22SfjlModule {}
