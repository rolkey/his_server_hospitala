
import { forwardRef, Global, Module } from '@nestjs/common';
import { emr_jcsqService } from './emr_jcsq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { emr_jcsq } from './emr_jcsq.entity';
import { emr_jcsqController } from './emr_jcsq.controller';
import { emr_jcsqmx } from './emr_jcsqmx.entity';
import { GyIdentityModule } from '../gy_identity/gy-identity.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([emr_jcsq, emr_jcsqmx,]),
  forwardRef(() => GyIdentityModule),],
  controllers: [emr_jcsqController],
  providers: [emr_jcsqService],
  exports: [emr_jcsqService],
})
export class emr_jcsqModule { }
