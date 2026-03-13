import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H23Mzzd } from './h23_mzzd.entity';
import { H23MzzdService } from './h23_mzzd.service';
import { H23MzzdController } from './h23_mzzd.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H23Mzzd])],
  controllers: [H23MzzdController],
  providers: [H23MzzdService],
  exports: [H23MzzdService],
})
export class H23MzzdModule {}

