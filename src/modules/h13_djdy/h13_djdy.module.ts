import { Global, Module } from '@nestjs/common';
import { h13_djdyService } from './h13_djdy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h13_djdy } from './h13_djdy.entity';
import { h13_djdyController } from './h13_djdy.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h13_djdy])],
  controllers: [h13_djdyController],
  providers: [h13_djdyService],
  exports: [h13_djdyService],
})
export class h13_djdyModule { }
