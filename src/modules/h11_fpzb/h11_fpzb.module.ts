import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Fpzb } from './h11_fpzb.entity';
import { H11FpzbService } from './h11_fpzb.service';
import { H11FpzbController } from './h11_fpzb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H11Fpzb])],
  controllers: [H11FpzbController],
  providers: [H11FpzbService],
  exports: [H11FpzbService],
})
export class H11FpzbModule {}
