import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H00Brlb } from './h00_brlb.entity';
import { H00BrlbService } from './h00_brlb.service';
import { H00BrlbController } from './h00_brlb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H00Brlb])],
  controllers: [H00BrlbController],
  providers: [H00BrlbService],
  exports: [H00BrlbService],
})
export class H00BrlbModule {}
