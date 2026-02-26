import { Injectable } from '@nestjs/common';
import { QueryDto } from '../emr_jcsq/dto';

@Injectable()
export class HisTechService {
  constructor() {}

  async queryBrxxs(queryDto: QueryDto) {
    // 查询患者
  }
}
