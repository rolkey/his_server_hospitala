import { Module } from '@nestjs/common';
import { TechnologyOrdersController } from './technology-orders.controller';
import { TechnologyOrdersService } from './technology-orders.service';
@Module({
  controllers: [TechnologyOrdersController],
  providers: [TechnologyOrdersService],
  exports: [TechnologyOrdersService],
})
export class TechnologyOrdersModule {}
