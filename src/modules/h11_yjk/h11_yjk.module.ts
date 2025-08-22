import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Yjk } from './h11_yjk.entity';
import { H11YjkService } from './h11_yjk.service';
import { H11YjkController } from './h11_yjk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H11Yjk])],
  controllers: [H11YjkController],
  providers: [H11YjkService],
  exports: [H11YjkService],
})
export class H11YjkModule {}
