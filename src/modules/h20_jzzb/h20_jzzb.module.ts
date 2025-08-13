import { Global, Module } from '@nestjs/common';
import { h20_jzzbService } from './h20_jzzb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h20_jzzb } from './h20_jzzb.entity';
import { h20_jzzbController } from './h20_jzzb.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h20_jzzb])],
  controllers: [h20_jzzbController],
  providers: [h20_jzzbService],
  exports: [h20_jzzbService],
})
export class h20_jzzbModule {}
