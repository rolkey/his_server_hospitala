import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GyIdentity } from './gy-identity.entity';
import { CreateGyIdentityDto } from './gy-identity.dto';

@Injectable()
export class GyIdentityService {
  constructor(
    @InjectRepository(GyIdentity)
    private readonly gyIdentityRepository: Repository<GyIdentity>,
  ) {}

  async create(createGyIdentityDto: CreateGyIdentityDto): Promise<GyIdentity> {
    const gyIdentity = this.gyIdentityRepository.create(createGyIdentityDto);
    return this.gyIdentityRepository.save(gyIdentity);
  }

  async findAll(): Promise<GyIdentity[]> {
    return this.gyIdentityRepository.find();
  }

  async findOne(tname: string): Promise<GyIdentity> {
    return this.gyIdentityRepository.findOneBy({ tname });
  }

  async update(tname: string, updateData: Partial<CreateGyIdentityDto>): Promise<GyIdentity> {
    await this.gyIdentityRepository.update(tname, updateData);
    return this.findOne(tname);
  }

  async remove(tname: string): Promise<void> {
    await this.gyIdentityRepository.delete(tname);
  }

  async incTable(tname: string, inc: number = 1): Promise<number> {
    // 取记录，更新ID，保存记录
    const gyIdentity = await this.findOne(tname);
    if (!gyIdentity) {
      // 添加新记录
      const newGyIdentity = await this.create({ tname, value: inc + 1 });
      return inc + 1;
    } else {
      gyIdentity.value += inc;
      await this.gyIdentityRepository.save(gyIdentity);
      return gyIdentity.value;
    }
  }
}
