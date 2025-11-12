import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';

/**
 * 单一个Service程序过多，应该把一部分功能拆分出来，放在new里面
 */
@Injectable()
export class h12_yzxbService {
  constructor(
    @InjectRepository(h12_yzzb)
    private h12_yzzbRepo: Repository<h12_yzzb>,
    @InjectRepository(h12_yzxb)
    private h12_yzxbRepo: Repository<h12_yzxb>,
    private readonly gyIdentityService: GyIdentityService,
  ) {}

  // 取组套
  async addPackageToAdvice() {}
}
