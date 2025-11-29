// src/h12-cycl/h12-cycl.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H12CyclService } from './h12-cycl.service';
import { H12CyclController } from './h12-cycl.controller';
import { H12Cycl } from './h12-cycl.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H12Cycl])],
  controllers: [H12CyclController],
  providers: [H12CyclService],
  exports: [H12CyclService],
})
export class H12CyclModule {}
