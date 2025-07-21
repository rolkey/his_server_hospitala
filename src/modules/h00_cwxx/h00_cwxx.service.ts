import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h00_cwxx } from './h00_cwxx.entity';

@Injectable()
export class h00_cwxxService {
  constructor(
    @InjectRepository(h00_cwxx)
    private h00_cwxxRepo: Repository<h00_cwxx>,
  ) {}
}
