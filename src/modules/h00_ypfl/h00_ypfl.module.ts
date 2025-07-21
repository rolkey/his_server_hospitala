import { Global, Module } from '@nestjs/common';
import { h00_ypflService } from './h00_ypfl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_ypflController } from './h00_ypfl.controller';
import { h00_ypfl } from './h00_ypfl.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_ypfl])],
  // controllers: [h00_ypflController],
  providers: [h00_ypflService],
  exports: [h00_ypflService],
})
export class h00_ypflModule {}
