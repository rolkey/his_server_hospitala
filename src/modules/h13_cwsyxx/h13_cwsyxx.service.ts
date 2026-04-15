import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h13_cwsyxx } from './h13_cwsyxx.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

@Injectable()
export class h13_cwsyxxService {
  constructor(
    @InjectRepository(h13_cwsyxx)
    private h13_cwsyxxRepo: Repository<h13_cwsyxx>,
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
  ) {}

  async findAll(queryDto: { ksid: string }) {
    const [cwxx, brxx] = await Promise.all([
      this.h13_cwsyxxRepo
        .createQueryBuilder('cw')
        .leftJoinAndSelect('cw.cwidEntity', 'cwxx')
        .where({ ksid: queryDto.ksid || '' })
        .getMany(),
      this.h11_brxxRepo
        .createQueryBuilder('br')
        .leftJoinAndSelect('br.brlxidEntity', 'brlxidEntity')
        .leftJoinAndSelect('br.mzysEntity', 'mzysEntity')
        .leftJoinAndSelect('br.sxysEntity', 'sxysEntity')
        .leftJoinAndSelect('br.zrhsEntity', 'zrhsEntity')
        .leftJoinAndSelect('br.zkbqidEntity', 'zkbqidEntity')
        .leftJoinAndSelect('br.rybqidEntity', 'rybqidEntity')
        .leftJoinAndSelect('br.yishEntity', 'yish', `yish.lx='饮食'`)
        .where({ ryksid: queryDto.ksid || '' })
        .andWhere('exists (select 1 from h13_cwsyxx where br.zyid=h13_cwsyxx.zyid)')
        .getMany(),
    ]);
    const brxxMap = new Map(brxx.map((item) => [item.zyid, item] as const));

    cwxx.forEach((item) => {
      if (item.zyid) item.zyidEntity = brxxMap.get(item.zyid);
    });

    return cwxx;
  }
}
