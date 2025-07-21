import { Global, Module } from '@nestjs/common';
import { h00_fylbService } from './h00_fylb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_fylb } from './h00_fylb.entity';
import { h00_fylbController } from './h00_fylb.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_fylb])],
  // controllers: [h00_fylbController],
  providers: [h00_fylbService],
  exports: [h00_fylbService],
})
export class h00_fylbModule {}
