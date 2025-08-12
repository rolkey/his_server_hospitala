import { Global, Module } from '@nestjs/common';
import { csxzService } from './csxz.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { csxz } from './csxz.entity';
import { csxzController } from './csxz.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([csxz])],
  controllers: [csxzController],
  providers: [csxzService],
  exports: [csxzService],
})
export class csxzModule {}
