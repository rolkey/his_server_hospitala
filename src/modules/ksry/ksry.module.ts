import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ksry } from './ksry.entity';
import { KsryService } from './ksry.service';
import { KsryController } from './ksry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ksry])],
  providers: [KsryService],
  controllers: [KsryController],
  exports: [KsryService],
})
export class KsryModule {}
