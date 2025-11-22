import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H31LyjlService } from './h31_lyjl.service';
import { H31LyjlController } from './h31_lyjl.controller';
import { H31Lyjl } from './h31_lyjl.entity';
import { H31Lymx } from './h31_lymx.entity';


@Module({
  imports: [TypeOrmModule.forFeature([H31Lyjl, H31Lymx])],
  controllers: [H31LyjlController],
  providers: [H31LyjlService],
})
export class H31LyjlModule { }
