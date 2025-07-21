import { Global, Module } from '@nestjs/common';
import { h00_mzzdService } from './h00_mzzd.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_mzzd } from './h00_mzzd.entity';
import { h00_mzzdController } from './h00_mzzd.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_mzzd])],
  // controllers: [h00_mzzdController],
  providers: [h00_mzzdService],
  exports: [h00_mzzdService],
})
export class h00_mzzdModule {}
