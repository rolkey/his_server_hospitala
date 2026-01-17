import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H15Ssxb } from './h15-ssxb.entity';
import { H15SsxbService } from './h15-ssxb.service';
import { H15SsxbController } from './h15-ssxb.controller';
import { H15Sszb } from '../h15_sszb/h15-sszb.entity';
import { SmSssq } from '../sm-sssq/sm-sssq.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { GyIdentity } from '../gy_identity/gy-identity.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H15Ssxb, H15Sszb, SmSssq, GyIdentity, h11_brxx])],
  controllers: [H15SsxbController],
  providers: [H15SsxbService, GyIdentityService],
  exports: [H15SsxbService],
})
export class H15SsxbModule {}
