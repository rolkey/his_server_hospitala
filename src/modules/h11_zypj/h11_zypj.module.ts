import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Zypj } from './h11_zypj.entity';
import { H11ZypjService } from './h11_zypj.service';
import { H11ZypjController } from './h11_zypj.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H11Zypj])],
  controllers: [H11ZypjController],
  providers: [H11ZypjService],
  exports: [H11ZypjService],
})
export class H11ZypjModule {}
