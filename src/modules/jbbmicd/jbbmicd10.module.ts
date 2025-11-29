import { Global, Module } from '@nestjs/common';
import { Jbbmicd10Service } from './jbbmicd10.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jbbmicd10 } from './jbbmicd10.entity';
import { Jbbmicd10Controller } from './jbbmicd10.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Jbbmicd10])],
  controllers: [Jbbmicd10Controller],
  providers: [Jbbmicd10Service],
  exports: [Jbbmicd10Service],
})
export class Jbbmicd10Module {}
