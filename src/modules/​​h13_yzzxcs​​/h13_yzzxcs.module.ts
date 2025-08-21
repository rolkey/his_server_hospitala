import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { h13_yzzxcsService } from './h13_yzzxcs.service';
import { h13_yzzxcsController } from './h13_yzzxcs.controller';
import { H13YzzxcsTf } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.entity';
import { H13YzzxcsTfModule } from '../h13_yzzxcs_tf/h13-yzzxcs-tf.module';
import { h12_yzxb } from '@/modules/h12_yzzb/h12_yzxb.entity';
import { h12_yzzbModule } from '../h12_yzzb/h12_yzzb.module';

// H13YzzxcsTfModule
@Module({
  imports: [
    TypeOrmModule.forFeature([h13_yzzxcs, H13YzzxcsTf, h12_yzxb]),
    forwardRef(() => H13YzzxcsTfModule),
    forwardRef(() => h12_yzzbModule),
  ],
  providers: [h13_yzzxcsService],
  controllers: [h13_yzzxcsController],
  exports: [h13_yzzxcsService],
})
export class h13_yzzxcsModule {}
