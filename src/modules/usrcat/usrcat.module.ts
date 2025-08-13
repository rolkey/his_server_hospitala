import { Global, Module } from '@nestjs/common';
import { UsrcatService } from './usrcat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { usrcat } from './usrcat.entity';
import { UsrcatController } from './usrcat.controller';
import { UsrcatNewController } from './usrcatUnlimited.controller';
import { Role } from '../role/role.entity';
import { ksmc } from '../ksmc/ksmc.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([usrcat, Role, ksmc])],
  controllers: [UsrcatController, UsrcatNewController],
  providers: [UsrcatService],
  exports: [UsrcatService],
})
export class UsrcatModule {}
