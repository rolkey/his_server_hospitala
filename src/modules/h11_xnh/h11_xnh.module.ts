import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H11Xnh } from './h11_xnh.entity';
import { H11XnhService } from './h11_xnh.service';
import { H11XnhController } from './h11_xnh.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H11Xnh])],
  controllers: [H11XnhController],
  providers: [H11XnhService],
  exports: [H11XnhService],
})
export class H11XnhModule {}
