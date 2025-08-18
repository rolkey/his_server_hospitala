import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Jshztzd1 } from './h11-jshztzd1.entity';
import { H11Jshztzd1Service } from './h11-jshztzd1.service';
import { H11Jshztzd1Controller } from './h11-jshztzd1.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H11Jshztzd1])],
  controllers: [H11Jshztzd1Controller],
  providers: [H11Jshztzd1Service],
  exports: [H11Jshztzd1Service],
})
export class H11Jshztzd1Module {}
