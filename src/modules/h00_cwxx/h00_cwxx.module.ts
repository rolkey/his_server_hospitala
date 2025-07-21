import { Global, Module } from '@nestjs/common';
import { h00_cwxxService } from './h00_cwxx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_cwxx } from './h00_cwxx.entity';
import { h00_cwxxController } from './h00_cwxx.controller';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_cwxx, h11_brxx])],
  // controllers: [h00_cwxxController],
  providers: [h00_cwxxService],
  exports: [h00_cwxxService],
})
export class h00_cwxxModule {}
