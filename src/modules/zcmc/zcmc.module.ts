import { Global, Module } from '@nestjs/common';
import { zcmcService } from './zcmc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { zcmc } from './zcmc.entity';
import { zcmcController } from './zcmc.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([zcmc])],
  // controllers: [zcmcController],
  providers: [zcmcService],
  exports: [zcmcService],
})
export class zcmcModule {}
