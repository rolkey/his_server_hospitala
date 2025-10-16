import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H21Ylzh } from './h21_ylzh.entity';
import { H21YlzhService } from './h21_ylzh.service';
import { H21YlzhController } from './h21_ylzh.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H21Ylzh])],
  controllers: [H21YlzhController],
  providers: [H21YlzhService],
  exports: [H21YlzhService],
})
export class H21YlzhModule {}
