import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async getMax(asTableName: string, anNeedCount: number = 1): Promise<number> {
    if (!anNeedCount || anNeedCount < 1) {
      return -1;
    }

    let llValue: number = 0;
    let llCount: number;
    let llRetry = 0;

    while (true) {
      try {
        // 开始事务
        await this.gyIdentityRepository.manager.transaction(async (transactionalEntityManager) => {
          const result = await transactionalEntityManager
            .createQueryBuilder()
            .update(GyIdentity)
            .set({ value: () => `value + ${anNeedCount}` })
            .where('tname = :tname', { tname: asTableName })
            .execute();

          if (result.affected === 0) {
            // 更新失败，检查记录是否存在
            llCount = await transactionalEntityManager
              .createQueryBuilder()
              .select('COUNT(*)', 'count')
              .from(GyIdentity, 'gy')
              .where('tname = :tname', { tname: asTableName })
              .getRawOne();

            if (llCount > 0) {
              llRetry++;
              if (llRetry >= 3) {
                throw new InternalServerErrorException('最大重试次数已达到');
              }
              // 回滚并重试
              throw new Error('重试');
            } else {
              // 插入新记录
              await transactionalEntityManager.insert(GyIdentity, {
                tname: asTableName,
                value: anNeedCount,
                origin_value: 1,
                inc_value: 1,
              });
              llValue = anNeedCount;
            }
          } else {
            // 获取当前值
            const entity = await transactionalEntityManager
              .createQueryBuilder(GyIdentity, 'gy')
              .select('gy.value')
              .where('gy.tname = :tname', { tname: asTableName })
              .getOne();

            if (!entity) {
              throw new InternalServerErrorException('记录不存在');
            }

            llValue = entity.value;

            if (llValue < anNeedCount) {
              throw new InternalServerErrorException('当前值小于请求值');
            }
          }
        });

        return llValue - anNeedCount + 1; // 返回结果
      } catch (error) {
        // 处理错误
        console.error(error);
        return -1;
      }
    }
  }
}
