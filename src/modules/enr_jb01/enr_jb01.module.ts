import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enr_jb01 } from './enr_jb01.entity';
import { enr_jb01Controller } from './enr_jb01.controller';
import { enr_jb01Service } from './enr_jb01.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([enr_jb01])],
  controllers: [enr_jb01Controller],
  providers: [enr_jb01Service],
  exports: [enr_jb01Service],
})
export class enr_jb01Module {}
