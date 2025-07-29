// H00_xmzdModule.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H00_xmzd } from './h00_xmzd.entity';
import { H00_xmzdService } from './h00_xmzd.service';
import { H00_xmzdController } from './h00_xmzd.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H00_xmzd])],
  providers: [H00_xmzdService],
  controllers: [H00_xmzdController],
})
export class H00_xmzdModule {}
