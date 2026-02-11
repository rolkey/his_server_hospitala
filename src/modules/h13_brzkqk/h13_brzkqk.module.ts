import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h13_brzkqk } from './h13_brzkqk.entity';
import { h13_brzkqkService } from './h13_brzkqk.service';
import { h13_brzkqkController } from './h13_brzkqk.controller';
import { SfxmModule } from '../h12_xmzd/sfxm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([h13_brzkqk]),
    SfxmModule,
  ],
  controllers: [h13_brzkqkController],
  providers: [h13_brzkqkService],
  exports: [h13_brzkqkService],
})
export class H13BrzkqkModule {}
