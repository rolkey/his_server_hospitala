import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HisTechController } from './his-tech.controller';
import { HisTechService } from './his-tech.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    // forwardRef(() => GyIdentityModule),
  ],
  controllers: [HisTechController],
  providers: [HisTechService],
  exports: [HisTechService],
})
export class HisTechModule {}
