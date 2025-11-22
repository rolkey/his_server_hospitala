import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H31Lyjl } from './h31_lyjl.entity';

import {
  CreateH31LyjlDto,
  UpdateH31LyjlDto,
  QueryH31LyjlDto,
  QueryByAdviceDto,
  QueryByAdviceDetailDto,
} from './h31_lyjl.dto';

@Injectable()
export class H31LyjlService {
  constructor(
    @InjectRepository(H31Lyjl)
    private readonly h31LyjlRepository: Repository<H31Lyjl>,

  ) { }


}
