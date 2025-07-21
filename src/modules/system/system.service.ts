import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class SystemService {
  /**
   * 获取当前系统时间
   * @returns 返回当前系统时间的ISO字符串
   */
  getCurrentTime(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  }
} 