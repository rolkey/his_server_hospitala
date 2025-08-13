import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h00_fkfs } from './h00_fkfs.entity';

@Injectable()
export class h00_fkfsService {
  constructor(
    @InjectRepository(h00_fkfs)
    private h00_fkfsRepo: Repository<h00_fkfs>,
  ) {}

  findZY() {
    return this.h00_fkfsRepo
      .createQueryBuilder('h00_fkfs')
      .where("isnull(h00_fkfs.szbm,'')<>'0' and isnull(h00_fkfs.bz,'')='1'")
      .getMany();
  }
}
