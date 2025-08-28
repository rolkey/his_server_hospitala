import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { h11_lsh } from './h11_lsh.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { H11Jszb } from '../h11_jszb/h11_jszb.entity';
import { Createh11_lshDto } from './h11_lsh.dto';

@Injectable()
export class h11_lshService {
  constructor(
    @InjectRepository(h11_brxx)
    private readonly h11_brxxRepository: Repository<h11_brxx>,
    @InjectRepository(h11_lsh)
    private readonly h11_lshRepository: Repository<h11_lsh>,
    @InjectRepository(H11Jszb)
    private readonly h11_jszbRepository: Repository<H11Jszb>,
    private readonly dataSource: DataSource,
  ) {}

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
        await this.h11_lshRepository.manager.transaction(async (transactionalEntityManager) => {
          const result = await transactionalEntityManager
            .createQueryBuilder()
            .update(h11_lsh)
            .set({ value: () => `value + ${anNeedCount}` })
            .where('tname = :tname', { tname: asTableName })
            .execute();

          if (result.affected === 0) {
            // 更新失败，检查记录是否存在
            llCount = await transactionalEntityManager
              .createQueryBuilder()
              .select('COUNT(*)', 'count')
              .from(h11_lsh, 'gy')
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
              await transactionalEntityManager.insert(h11_lsh, {
                lshid: asTableName,
                lshmc: anNeedCount.toString(),
              });
              llValue = anNeedCount;
            }
          } else {
            // 获取当前值
            const entity = await transactionalEntityManager
              .createQueryBuilder(h11_lsh, 'gy')
              .select('gy.value')
              .where('gy.tname = :tname', { tname: asTableName })
              .getOne();

            if (!entity) {
              throw new InternalServerErrorException('记录不存在');
            }

            //llValue = entity.value;

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

  /**
   * 获取流水号（TypeScript实现版）
   * @param lshId 流水号ID（对应h11_lsh.lshid）
   * @param lshName 流水号名称（对应h11_lsh.lshmc）
   * @param length 流水号长度
   * @returns 格式化后的流水号字符串，出错返回'-1'
   */
  async getSerialNumber(lshid: string, lshmc: string, length: number): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 查询现有流水号记录
      const existingRecord = await this.h11_lshRepository.findOne({
        where: { lshid },
      });

      let currentNumber: number;

      if (existingRecord) {
        // 2. 存在记录时直接获取当前值
        currentNumber = existingRecord.dqlsh;
      } else {
        // 3. 无记录时根据不同业务类型初始化
        if (lshid === 'ZYID') {
          // 住院ID特殊处理
          const maxZyid = await this.h11_brxxRepository
            .createQueryBuilder()
            .select('MAX(zyid)', 'maxZyid')
            .getRawOne();

          currentNumber = maxZyid?.maxZyid ? parseInt(maxZyid.maxZyid) + 1 : 1;
        } else if (lshid === 'JSDH') {
          // 结算单号特殊处理
          const maxJsdh = await this.h11_jszbRepository
            .createQueryBuilder()
            .select('MAX(jsdh)', 'maxJsdh')
            .getRawOne();
          currentNumber = maxJsdh?.maxJsdh ? parseInt(maxJsdh.maxJsdh) + 1 : 1;
          currentNumber = 1;
        } else {
          // 默认初始值
          currentNumber = 1;
        }

        // 创建新记录
        const newRecord = this.h11_lshRepository.create({
          lshid,
          lshmc,
          dqlsh: currentNumber,
        });
        await this.h11_lshRepository.save(newRecord);
      }

      // 4. 更新流水号（当前值+1）
      await this.h11_lshRepository.update({ lshid }, { dqlsh: currentNumber + 1 });

      // 5. 格式化输出
      const formattedNumber = currentNumber.toString().padStart(length, '0');

      if (!formattedNumber) {
        throw new Error('流水号格式化失败');
      }

      await queryRunner.commitTransaction();
      return formattedNumber;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('流水号生成错误:', error);
      return '-1';
    } finally {
      await queryRunner.release();
    }
  }
}
