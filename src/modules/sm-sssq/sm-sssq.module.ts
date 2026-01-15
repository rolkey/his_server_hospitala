import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmSssq } from './sm-sssq.entity';
import { SmSssqService } from './sm-sssq.service';
import { SmSssqController } from './sm-sssq.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SmSssq])],
  controllers: [SmSssqController],
  providers: [SmSssqService],
  exports: [SmSssqService],
})
export class SmSssqModule {}
