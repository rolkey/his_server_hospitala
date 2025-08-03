import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface ApiResponse {
  data: any; // 或者更具体的类型
  [key: string]: any;
}

@Injectable()
export class SunsoftService {
  constructor(private readonly httpService: HttpService) {}

  async forwardRequest(serviceName: string, method: string, body: any, request: any) {
    const targetUrl = `/api/sunsoft/${serviceName}/${method}`;
    const httpMethod = request.method.toLowerCase();
    const headers = { ...request.headers };
    delete headers['host']; // 避免 host 冲突

    try {
      // const axiosInstance = (this.httpService as any).axiosRef;
      let response: { data: ApiResponse };

      if (httpMethod === 'get' || httpMethod === 'delete') {
        response = await firstValueFrom(
          this.httpService[httpMethod]<ApiResponse>(targetUrl, { headers, params: request.query }),
        );
      } else if (httpMethod === 'post' || httpMethod === 'put' || httpMethod === 'patch') {
        response = await firstValueFrom(
          this.httpService[httpMethod]<ApiResponse>(targetUrl, body, { headers }),
        );
      } else {
        throw new Error(`不支持的 HTTP 方法: ${httpMethod}`);
      }
      return response.data.data;
    } catch (error) {
      console.error('Sunsoft 转发异常:', error?.response?.data || error.message);
      //   return {
      //     success: false,
      //     message: 'Sunsoft 转发异常',
      //     error: error?.response?.data || error.message,
      //   };
      throw new BadRequestException(error.message);
    }
  }
}
