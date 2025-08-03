import { Module, Global } from '@nestjs/common';
import { SunsoftController } from './sunsoft.controller';
import { SunsoftService } from './sunsoft.service'; // 添加这行
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Global() // 添加这个装饰器使模块成为全局模块
@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: 6000,
        maxRedirects: 5,
        baseURL: configService.get('SERVER_URL') || 'http://localhost:8085',
      }),
    }),
  ],
  controllers: [SunsoftController],
  providers: [SunsoftService],
  exports: [SunsoftService],
})
export class SunsoftModule {}
