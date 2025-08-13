import { Global, Module } from '@nestjs/common';
import { h00_fkfsService } from './h00_fkfs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_fkfs } from './h00_fkfs.entity';
import { h00_fkfsController } from './h00_fkfs.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_fkfs])],
  controllers: [h00_fkfsController],
  providers: [h00_fkfsService],
  exports: [h00_fkfsService],
})
export class h00_fkfsModule {}
