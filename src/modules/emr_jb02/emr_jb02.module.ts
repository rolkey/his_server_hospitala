import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { emr_jb02 } from './emr_jb02.entity';
import { emr_jb02Controller } from './emr_jb02.controller';
import { emr_jb02Service } from './emr_jb02.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([emr_jb02])],
  controllers: [emr_jb02Controller],
  providers: [emr_jb02Service],
  exports: [emr_jb02Service],
})
export class emr_jb02Module {}
