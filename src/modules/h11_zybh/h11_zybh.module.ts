import { Global, Module } from '@nestjs/common';
import { h11_zybhService } from './h11_zybh.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h11_zybh } from './h11_zybh.entity';
import { h11_zybhController } from './h11_zybh.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h11_zybh])],
  controllers: [h11_zybhController],
  providers: [h11_zybhService],
  exports: [h11_zybhService],
})
export class h11_zybhModule {}
