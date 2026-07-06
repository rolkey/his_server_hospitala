import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { N0421 } from './n04_21.entity';
import { N0421Service } from './n04_21.service';
import { N0421Controller } from './n04_21.controller';

@Module({
  imports: [TypeOrmModule.forFeature([N0421])],
  controllers: [N0421Controller],
  providers: [N0421Service],
  exports: [N0421Service],
})
export class N0421Module {}
