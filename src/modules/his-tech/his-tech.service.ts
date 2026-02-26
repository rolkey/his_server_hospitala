import { Injectable } from '@nestjs/common';
import { QueryDto } from '../emr_jcsq/dto';
import { ConfigDto, QueryParamsDto } from './his-tech.dto';
import { ParamService } from '../h12_xmzd/service/param.service';

@Injectable()
export class HisTechService {
  constructor(private readonly paramService: ParamService) {}

  async queryBrxxs(ip: string, queryDto: QueryParamsDto) {
    // 查询患者
    console.log('患者信息', queryDto);

    const configDto = await this.getConfig(ip);
    console.log('配置信息', configDto);
  }

  async getConfig(ip: string): Promise<ConfigDto> {
    // 读取配置
    const [hlfylbid0, hlfylbid1, hlfylbid2, hlfylbid3, hlfylbid4] = await Promise.all([
      this.paramService.gfGetPara(40, 'fylb1_' + ip, '', '医技费用类型1'),
      this.paramService.gfGetPara(40, 'fylb2_' + ip, '', '医技费用类型2'),
      this.paramService.gfGetPara(40, 'fylb3_' + ip, '', '医技费用类型3'),
      this.paramService.gfGetPara(40, 'fylb4_' + ip, '', '医技费用类型4'),
      this.paramService.gfGetPara(40, 'fylb5_' + ip, '', '医技费用类型5'),
    ]);
    return { hlfylbid0, hlfylbid1, hlfylbid2, hlfylbid3, hlfylbid4 };
  }

  async changeConfig(ip: string, saveDto: ConfigDto) {
    await Promise.all([
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb1_' + ip,
        default: saveDto.hlfylbid0,
        bz: '医技费用类型1',
      }),
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb2_' + ip,
        default: saveDto.hlfylbid0,
        bz: '医技费用类型2',
      }),
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb3_' + ip,
        default: saveDto.hlfylbid0,
        bz: '医技费用类型3',
      }),
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb4_' + ip,
        default: saveDto.hlfylbid0,
        bz: '医技费用类型4',
      }),
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb5_' + ip,
        default: saveDto.hlfylbid0,
        bz: '医技费用类型5',
      }),
    ]);
  }
}
