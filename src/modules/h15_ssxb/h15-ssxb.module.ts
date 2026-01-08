import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H15Ssxb } from './h15-ssxb.entity';
import { H15SsxbService } from './h15-ssxb.service';
import { H15SsxbController } from './h15-ssxb.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H15Ssxb])],
  controllers: [H15SsxbController],
  providers: [H15SsxbService],
  exports: [H15SsxbService],
})
export class H15SsxbModule {}
