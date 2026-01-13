import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasOpr } from './bas-opr.entity';
import { BasOprService } from './bas-opr.service';
import { BasOprController } from './bas-opr.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BasOpr])],
  controllers: [BasOprController],
  providers: [BasOprService],
  exports: [BasOprService],
})
export class BasOprModule {}
