import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enr_jb02 } from './enr_jb02.entity';
import { enr_jb02Controller } from './enr_jb02.controller';
import { enr_jb02Service } from './enr_jb02.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([enr_jb02])],
  controllers: [enr_jb02Controller],
  providers: [enr_jb02Service],
  exports: [enr_jb02Service],
})
export class enr_jb02Module {}
