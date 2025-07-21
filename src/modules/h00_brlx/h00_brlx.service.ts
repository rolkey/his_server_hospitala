import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h00_brlx } from './h00_brlx.entity';

@Injectable()
export class h00_brlxService {
  constructor(
    @InjectRepository(h00_brlx)
    private h00_brlxRepo: Repository<h00_brlx>,
  ) {}

  findAll() {
    return this.h00_brlxRepo.find({});
  }
}
