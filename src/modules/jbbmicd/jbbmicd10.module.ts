import { Global, Module } from '@nestjs/common';
import { jbbmicd10Service } from './jbbmicd10.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jbbmicd10 } from './jbbmicd10.entity';
import { jbbmicd10Controller } from './jbbmicd10.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([jbbmicd10])],
  // controllers: [jbbmicd10Controller],
  providers: [jbbmicd10Service],
  exports: [jbbmicd10Service],
})
export class jbbmicd10Module {}
