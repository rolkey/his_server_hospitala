import { Injectable } from '@nestjs/common';
import { QueryDto } from '../emr_jcsq/dto';
import { QueryParamsDto } from './his-tech.dto';

@Injectable()
export class HisTechService {
  constructor() {}

  async queryBrxxs(queryDto: QueryParamsDto) {
    // 查询患者
    console.log('患者信息', queryDto);
  }
}
