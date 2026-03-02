import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmSsap } from './sm-ssap.entity';
import { SmSsapService } from './sm-ssap.service';
import { SmSsapController } from './sm-ssap.controller';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { SmSssq } from '../sm-sssq/sm-sssq.entity';
import { GyIdentityModule } from '../gy_identity/gy-identity.module';

@Module({
  imports: [TypeOrmModule.forFeature([SmSsap, h11_brxx, SmSssq]), GyIdentityModule],
  controllers: [SmSsapController],
  providers: [SmSsapService],
  exports: [SmSsapService],
})
export class SmSsapModule {}
