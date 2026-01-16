import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { H15Sszb } from './h15-sszb.entity';
import { H15SszbService } from './h15-sszb.service';
import { H15SszbController } from './h15-sszb.controller';
import { SmSssq } from '../sm-sssq/sm-sssq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([H15Sszb, SmSssq])],
  controllers: [H15SszbController],
  providers: [H15SszbService],
  exports: [H15SszbService],
})
export class H15SszbModule {}
