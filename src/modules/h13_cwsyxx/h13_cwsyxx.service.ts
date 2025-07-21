import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h13_cwsyxx } from './h13_cwsyxx.entity';

@Injectable()
export class h13_cwsyxxService {
  constructor(
    @InjectRepository(h13_cwsyxx)
    private h13_cwsyxxRepo: Repository<h13_cwsyxx>,
  ) {}

  async findAll(queryDto: { ksid: string }) {
    return this.h13_cwsyxxRepo
      .createQueryBuilder('cw')
      .leftJoinAndSelect('cw.zyidEntity', 'br')
      .leftJoinAndSelect('cw.cwidEntity', 'cwxx')
      .leftJoinAndSelect('br.brlxidEntity', 'brlxidEntity')
      .leftJoinAndSelect('br.mzysEntity', 'mzysEntity')
      .leftJoinAndSelect('br.sxysEntity', 'sxysEntity')
      .leftJoinAndSelect('br.zrhsEntity', 'zrhsEntity')
      .leftJoinAndSelect('br.zkbqidEntity', 'zkbqidEntity')
      .leftJoinAndSelect('br.rybqidEntity', 'rybqidEntity')
      .leftJoinAndSelect('br.yishEntity', 'yish', `yish.lx='饮食'`)
      .where({ ksid: queryDto.ksid || '' })
      .getMany();
  }
}
