import { Global, Module } from '@nestjs/common';
import { h00_brlxService } from './h00_brlx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { h00_brlx } from './h00_brlx.entity';
import { h00_brlxController } from './h00_brlx.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([h00_brlx])],
  // controllers: [h00_brlxController],
  providers: [h00_brlxService],
  exports: [h00_brlxService],
})
export class h00_brlxModule {}
