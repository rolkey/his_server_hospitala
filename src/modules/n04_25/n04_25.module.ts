import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { N0425 } from './n04_25.entity';
import { N0425Service } from './n04_25.service';
import { N0425Controller } from './n04_25.controller';

@Module({
  imports: [TypeOrmModule.forFeature([N0425])],
  controllers: [N0425Controller],
  providers: [N0425Service],
  exports: [N0425Service],
})
export class N0425Module {}
