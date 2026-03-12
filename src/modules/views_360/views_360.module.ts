import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Views360 } from './views_360.entity';
import { Views360Service } from './views_360.service';
import { Views360Controller } from './views_360.controller';
import { h21_brxx } from '../h21_brxx/h21-brxx.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { H21Ylzh } from '../h21_ylzh/h21_ylzh.entity';
import { N04_23 } from '../n04-23/n04-23.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Views360,
      h21_brxx,
      h11_brxx,
      H21Ylzh,
      N04_23,
    ]),
  ],
  controllers: [Views360Controller],
  providers: [Views360Service],
  exports: [Views360Service],
})
export class Views360Module {}
