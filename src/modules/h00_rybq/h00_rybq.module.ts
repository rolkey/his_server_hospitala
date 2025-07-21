import { Global, Module } from '@nestjs/common';
import { h00_rybqService } from './h00_rybq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_rybq } from './h00_rybq.entity';
import { h00_rybqController } from './h00_rybq.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_rybq])],
  // controllers: [h00_rybqController],
  providers: [h00_rybqService],
  exports: [h00_rybqService],
})
export class h00_rybqModule {}
