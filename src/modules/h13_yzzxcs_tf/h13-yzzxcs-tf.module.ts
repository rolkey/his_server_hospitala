import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H13YzzxcsTf } from './h13-yzzxcs-tf.entity';
import { H13YzzxcsTfService } from './h13-yzzxcs-tf.service';
import { H13YzzxcsTfController } from './h13-yzzxcs-tf.controller';
import { h12_yzxb } from '../h12_yzzb/h12_yzxb.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H13YzzxcsTf, h12_yzxb])],
  controllers: [H13YzzxcsTfController],
  providers: [H13YzzxcsTfService],
  exports: [H13YzzxcsTfService],
})
export class H13YzzxcsTfModule {}
