import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmSssq } from './sm-sssq.entity';
import { SmSssqService } from './sm-sssq.service';
import { SmSssqController } from './sm-sssq.controller';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { GyIdentityModule } from '../gy_identity/gy-identity.module';
import { GyIdentity } from '../gy_identity/gy-identity.entity';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';
import { h12_yzxbService } from '../h12_yzzb/h12_yzxb.service';
import { h12_yzzbModule } from '../h12_yzzb/h12_yzzb.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmSssq, h11_brxx, GyIdentity, h12_yzxb]),
    forwardRef(() => GyIdentityModule),
    forwardRef(() => h12_yzzbModule),
  ],
  controllers: [SmSssqController],
  providers: [SmSssqService, GyIdentityService, h12_yzxbService],
  exports: [SmSssqService],
})
export class SmSssqModule {}
