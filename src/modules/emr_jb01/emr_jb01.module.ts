import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { emr_jb01 } from './emr_jb01.entity';
import { emr_jb02 } from '../emr_jb02/emr_jb02.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { emr_jb01Controller } from './emr_jb01.controller';
import { emr_jb01Service } from './emr_jb01.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([emr_jb01, emr_jb02, h11_brxx])],
  controllers: [emr_jb01Controller],
  providers: [emr_jb01Service],
  exports: [emr_jb01Service],
})
export class emr_jb01Module {}
