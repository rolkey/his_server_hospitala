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
  async getParam(query: SysparDto): Promise<string> {
    return await this.paramService.gfGetPara(query.xtsb, query.csmc, query.default, query.bz);
  }

  /**
   * 批量读配置
   * @param data
   * @returns
   */
  async batchParamsRead(data: SysparDto[]): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    await Promise.all(
      data.map(async (item) => {
        const value = await this.getParam(item);
        result[item.csmc] = value;
      }),
    );
    return result;
  }

  /**
   * 批量保存配置
   * @param data
   */
  async batchParamsWrite(data: SysparDto[]): Promise<void> {
    Promise.all(data.map((item) => this.paramService.saveParam(item)));
  }
}
