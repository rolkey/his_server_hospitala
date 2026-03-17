import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H00Gxzd } from './h00_gxzd.entity';
import { H00GxzdService } from './h00_gxzd.service';
import { H00GxzdController } from './h00_gxzd.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H00Gxzd])],
  controllers: [H00GxzdController],
  providers: [H00GxzdService],
  exports: [H00GxzdService],
})
export class H00GxzdModule {}
