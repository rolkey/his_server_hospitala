import { Global, Module } from '@nestjs/common';
import { h13_cwsyxxService } from './h13_cwsyxx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h13_cwsyxx } from './h13_cwsyxx.entity';
import { h13_cwsyxxController } from './h13_cwsyxx.controller';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h13_cwsyxx, h11_brxx])],
  controllers: [h13_cwsyxxController],
  providers: [h13_cwsyxxService],
  exports: [h13_cwsyxxService],
})
export class h13_cwsyxxModule {}
