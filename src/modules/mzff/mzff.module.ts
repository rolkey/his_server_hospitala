// mzff.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mzff } from './mzff.entity';
import { MzffService } from './mzff.service';
import { MzffController } from './mzff.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mzff])],
  providers: [MzffService],
  controllers: [MzffController],
  exports: [MzffService],
})
export class MzffModule {}
