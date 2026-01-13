import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { N04_23 } from './n04-23.entity';
import { N0423Service } from './n04-23.service';
import { N0423Controller } from './n04-23.controller';

@Module({
  imports: [TypeOrmModule.forFeature([N04_23])],
  controllers: [N0423Controller],
  providers: [N0423Service],
  exports: [N0423Service],
})
export class N0423Module {}
