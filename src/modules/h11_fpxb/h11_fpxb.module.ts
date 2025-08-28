import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Fpxb } from './h11_fpxb.entity';
import { H11FpxbService } from './h11_fpxb.service';
import { H11FpxbController } from './h11_fpxb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H11Fpxb])],
  controllers: [H11FpxbController],
  providers: [H11FpxbService],
  exports: [H11FpxbService],
})
export class H11FpxbModule {}
