import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { N0424 } from './n04_24.entity';
import { N0424Service } from './n04_24.service';
import { N0424Controller } from './n04_24.controller';
import { N0421Module } from '../n04_21/n04_21.module';

@Module({
  imports: [TypeOrmModule.forFeature([N0424]), N0421Module],
  controllers: [N0424Controller],
  providers: [N0424Service],
  exports: [N0424Service],
})
export class N0424Module {}
