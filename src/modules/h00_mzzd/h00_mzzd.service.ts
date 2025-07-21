
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { h00_mzzd } from './h00_mzzd.entity';

@Injectable()
export class h00_mzzdService {

  constructor(
    @InjectRepository(h00_mzzd)
    private h00_mzzdRepo: Repository<h00_mzzd>,
  ) { }

  findAll() {
    return this.h00_mzzdRepo.find({ })
  }
}
