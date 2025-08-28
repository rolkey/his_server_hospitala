import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Jsxb } from './h11_jsxb.entity';
import { H11JsxbService } from './h11_jsxb.service';
import { H11JsxbController } from './h11_jsxb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H11Jsxb])],
  controllers: [H11JsxbController],
  providers: [H11JsxbService],
  exports: [H11JsxbService],
})
export class H11JsxbModule {}
