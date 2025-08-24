import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Yjk } from './h11_yjk.entity';
import { H11YjkService } from './h11_yjk.service';
import { H11YjkController } from './h11_yjk.controller';
import { H11ZypjService } from '../h11_zypj/h11_zypj.service';
import { H11Zypj } from '../h11_zypj/h11_zypj.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H11Yjk, H11Zypj])],
  controllers: [H11YjkController],
  providers: [H11YjkService, H11ZypjService],
  exports: [H11YjkService],
})
export class H11YjkModule {}
