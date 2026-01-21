
import { Global, Module } from '@nestjs/common';
import { emr_xmflService } from './emr_xmfl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { emr_xmfl } from './emr_xmfl.entity';
import { emr_xmflController } from './emr_xmfl.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([emr_xmfl])],
  controllers: [emr_xmflController],
  providers: [emr_xmflService],
  exports: [emr_xmflService],
})
export class emr_xmflModule { }
