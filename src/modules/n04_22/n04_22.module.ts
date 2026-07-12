import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { N0422 } from './n04_22.entity';
import { N0422Service } from './n04_22.service';
import { N0422Controller } from './n04_22.controller';
import { N0421Module } from '../n04_21/n04_21.module';

@Module({
  imports: [TypeOrmModule.forFeature([N0422]), N0421Module],
  controllers: [N0422Controller],
  providers: [N0422Service],
  exports: [N0422Service],
})
export class N0422Module {}
