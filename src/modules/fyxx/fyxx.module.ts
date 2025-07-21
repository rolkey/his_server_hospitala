import { Global, Module } from '@nestjs/common';
import { fyxxService } from './fyxx.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fyxx } from './fyxx.entity';
import { fyxxController } from './fyxx.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([fyxx])],
  // controllers: [fyxxController],
  providers: [fyxxService],
  exports: [fyxxService],
})
export class fyxxModule {}
