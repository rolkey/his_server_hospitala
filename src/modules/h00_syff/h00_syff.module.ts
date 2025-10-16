import { Global, Module } from '@nestjs/common';
import { h00_syffService } from './h00_syff.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_syff } from './h00_syff.entity';
import { h00_syffController } from './h00_syff.controller';
import { H00_xmzd } from '../h00_xmzd/h00_xmzd.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_syff, H00_xmzd])],
  controllers: [h00_syffController],
  providers: [h00_syffService],
  exports: [h00_syffService],
})
export class h00_syffModule {}
