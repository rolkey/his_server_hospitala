import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H13YzzxcsTf } from './h13-yzzxcs-tf.entity';
import { H13YzzxcsTfService } from './h13-yzzxcs-tf.service';
import { H13YzzxcsTfController } from './h13-yzzxcs-tf.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H13YzzxcsTf])],
  controllers: [H13YzzxcsTfController],
  providers: [H13YzzxcsTfService],
  exports: [H13YzzxcsTfService],
})
export class H13YzzxcsTfModule {}
