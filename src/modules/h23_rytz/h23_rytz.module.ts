import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H23Rytz } from './h23_rytz.entity';
import { H23RytzService } from './h23_rytz.service';
import { H23RytzController } from './h23_rytz.controller';

@Module({
  imports: [TypeOrmModule.forFeature([H23Rytz])],
  controllers: [H23RytzController],
  providers: [H23RytzService],
  exports: [H23RytzService],
})
export class H23RytzModule {}
