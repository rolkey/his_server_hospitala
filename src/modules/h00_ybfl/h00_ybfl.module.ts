import { Global, Module } from '@nestjs/common';
import { h00_ybflService } from './h00_ybfl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_ybfl } from './h00_ybfl.entity';
import { h00_ybflController } from './h00_ybfl.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_ybfl])],
  // controllers: [h00_ybflController],
  providers: [h00_ybflService],
  exports: [h00_ybflService],
})
export class h00_ybflModule {}
