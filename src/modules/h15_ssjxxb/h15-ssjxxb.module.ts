import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H15Ssjxxb } from './h15-ssjxxb.entity';
import { H15SsjxxbService } from './h15-ssjxxb.service';
import { H15SsjxxbController } from './h15-ssjxxb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H15Ssjxxb])],
  controllers: [H15SsjxxbController],
  providers: [H15SsjxxbService],
  exports: [H15SsjxxbService],
})
export class H15SsjxxbModule {}
