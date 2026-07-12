import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { N0425 } from './n04_25.entity';
import { N0425Service } from './n04_25.service';
import { N0425Controller } from './n04_25.controller';
import { N0421Module } from '../n04_21/n04_21.module';

@Module({
  imports: [TypeOrmModule.forFeature([N0425]), N0421Module],
  controllers: [N0425Controller],
  providers: [N0425Service],
  exports: [N0425Service],
})
export class N0425Module {}
