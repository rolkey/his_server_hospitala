import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h13_yzzxcs } from './h13_yzzxcs.entity';
import { h13_yzzxcsService } from './h13_yzzxcs.service';
import { h13_yzzxcsController } from './h13_yzzxcs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([h13_yzzxcs])],
  providers: [h13_yzzxcsService],
  controllers: [h13_yzzxcsController],
  exports: [h13_yzzxcsService],
})
export class h13_yzzxcsModule {}
