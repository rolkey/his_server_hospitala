import { Global, Module } from '@nestjs/common';
import { h00_syplService } from './H00_sypl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_sypl } from './h00_sypl.entity';
import { h00_syplController } from './h00_sypl.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_sypl])],
  // controllers: [h00_syplController],
  providers: [h00_syplService],
  exports: [h00_syplService],
})
export class h00_syplModule {}
