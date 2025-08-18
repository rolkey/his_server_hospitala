import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ParamService } from '../h12_xmzd/service/param.service';
import { SysparDto } from './dto/syspar.dto';

@Injectable()
export class SystemService {
  constructor(private readonly paramService: ParamService) {}

  /**
   * 获取当前系统时间
   * @returns 返回当前系统时间的ISO字符串
   */
  getCurrentTime(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * 获取系统参数
   * @returns 返回当前系统时间的ISO字符串
   */
  getParam(query: SysparDto): Promise<string> {
    return this.paramService.gfGetPara(query.xtsb, query.csmc, query.default, query.bz);
  }
}
