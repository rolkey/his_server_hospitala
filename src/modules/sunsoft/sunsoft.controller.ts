import { Controller, Body, Param, All, Req, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtGuard } from '@/common/guards';
import { firstValueFrom } from 'rxjs';

// @UseGuards(JwtGuard)
@Controller('sunsoft')
export class SunsoftController {
  constructor(private readonly httpService: HttpService) {}

  @All(':serviceName/:method')
  async forwardRequest(
    @Param('serviceName') serviceName: string,
    @Param('method') method: string,
    @Body() body: any,
    @Req() request: any,
  ) {
    const targetUrl = `/api/sunsoft/${serviceName}/${method}`;
    const httpMethod = request.method.toLowerCase();
    const headers = { ...request.headers };
    delete headers['host']; // 避免 host 冲突
    console.log('-------------httpMethod targetUrl', httpMethod, targetUrl);
    let response;
    try {
      if (httpMethod === 'get' || httpMethod === 'delete') {
        response = await firstValueFrom(
          this.httpService[httpMethod](targetUrl, { headers, params: request.query }),
        );
      } else if (httpMethod === 'post' || httpMethod === 'put' || httpMethod === 'patch') {
        response = await firstValueFrom(this.httpService[httpMethod](targetUrl, body, { headers }));
      } else {
        throw new Error(`不支持的 HTTP 方法: ${httpMethod}`);
      }
      return response?.data.data;
    } catch (error) {
      console.error('Sunsoft 转发异常:', error?.response?.data || error.message);
      return {
        success: false,
        message: 'Sunsoft 转发异常',
        error: error?.response?.data || error.message,
      };
    }
  }
}
