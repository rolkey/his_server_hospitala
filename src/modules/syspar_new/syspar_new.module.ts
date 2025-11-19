
import { Global, Module } from '@nestjs/common';
import { syspar_newService } from './syspar_new.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { syspar_new } from './syspar_new.entity';
import { syspar_newController } from './syspar_new.controller';
import { syspar } from './syspar.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([syspar_new, syspar])],
  controllers: [syspar_newController],
  providers: [syspar_newService],
  exports: [syspar_newService],
})
export class syspar_newModule { }
