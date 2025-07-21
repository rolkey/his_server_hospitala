import { Global, Module } from '@nestjs/common';
import { ksmcService } from './ksmc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ksmc } from './ksmc.entity';
import { ksmcController } from './ksmc.controller';
import { usrcat } from '../usrcat/usrcat.entity';
import { fyxx } from '../fyxx/fyxx.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ksmc, usrcat, fyxx])],
  controllers: [ksmcController],
  providers: [ksmcService],
  exports: [ksmcService],
})
export class ksmcModule {}
