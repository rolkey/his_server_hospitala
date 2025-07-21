
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { h00_rybq } from './h00_rybq.entity';

@Injectable()
export class h00_rybqService {

  constructor(
    @InjectRepository(h00_rybq)
    private h00_rybqRepo: Repository<h00_rybq>,
  ) { }

  findAll() {
    return this.h00_rybqRepo.find({ })
  }
}
