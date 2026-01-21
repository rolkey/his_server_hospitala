import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { emr_jcsq } from './emr_jcsq.entity';
import { Jcbw, Jcff, QueryDto, SaveDto, } from './dto';
import { ERR } from '@/common/exceptions/error-code';
import { CustomException } from '@/common/exceptions/custom.exception';
import { emr_jcsqmx } from './emr_jcsqmx.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';

@Injectable()
export class emr_jcsqService {

  constructor(
    @InjectRepository(emr_jcsq)
    private emr_jcsqRepo: Repository<emr_jcsq>,
    private dataSource: DataSource,
    private readonly gyIdentityService: GyIdentityService,
  ) { }

  async save(saveDto: SaveDto) {
    const { jcbwList, jcffList, zlxmList, ...data } = saveDto;

    return await this.dataSource.transaction(async (manager) => {
      try {
        if (data.jzlx === '2') {
          //zlxmList就是申请单选择的所有的关联项目
          //住院逻辑
        }
        const existingJcsq = await manager.findOne(emr_jcsq, {
          where: { sqdh: data.sqdh },
        });
        if (existingJcsq && data.sqdh) {

          //这里实现生成医嘱逻辑

          return await this.updateJcsq(existingJcsq, data, jcbwList, jcffList, manager);
        } else {

          //这里实现生成医嘱逻辑

          return await this.createJcsq(data, jcbwList, jcffList, manager);
        }
      } catch (error) {
        console.error(error);
        throw new CustomException(ERR.ERR_10000, error.message ?? '保存申请单失败');
      }
    });
  }

  /**
   * 更新检查申请单
   */
  private async updateJcsq(
    existingJcsq: emr_jcsq,
    data: Partial<emr_jcsq>,
    jcbwList: any[],
    jcffList: any[],
    manager: EntityManager
  ): Promise<emr_jcsq> {
    // 手动合并属性，避免类型问题
    Object.assign(existingJcsq, data);
    const updatedJcsq = existingJcsq;

    // 清空旧的明细记录
    await manager.delete(emr_jcsqmx, { sqdh: data.sqdh! });

    await this.saveJcsqDetails(data.sqdh, jcbwList, jcffList, manager)

    return await manager.save(updatedJcsq);
  }

  /**
   * 创建新的检查申请单
   */
  private async createJcsq(
    data: Partial<emr_jcsq>,
    jcbwList: Jcbw[],
    jcffList: Jcff[],
    manager: EntityManager
  ): Promise<emr_jcsq> {
    const newId = await this.gyIdentityService.getMax('emr_jcsq');
    const newJcsq = manager.create(emr_jcsq, {
      ...data,
      sqdh: newId.toString(),
      jczt: '0',
    });

    await this.saveJcsqDetails(newId.toString(), jcbwList, jcffList, manager)

    return await manager.save(newJcsq);
  }

  /**
   * 保存检查申请单的明细记录
   */
  private async saveJcsqDetails(
    sqdh: string,
    jcbwList: Jcbw[],
    jcffList: Jcff[],
    manager: EntityManager
  ): Promise<void> {
    // 保存检查部位
    if (jcbwList?.length) {
      const bwEntities = jcbwList.map((bw) =>
        manager.create(emr_jcsqmx, {
          sqdh,
          jcxmid: bw.jcxmid,
          bwid: bw.bwid,
        }),
      );
      await manager.save(bwEntities);
    }

    // 保存检查方法
    if (jcffList?.length) {
      const ffEntities = jcffList.map((ff) =>
        manager.create(emr_jcsqmx, {
          sqdh,
          jcxmid: ff.jcxmid,
          ffid: ff.ffid,
        }),
      );
      await manager.save(ffEntities);
    }
  }
  findOne(queryDto: QueryDto) {
    const queryBuilder = this.emr_jcsqRepo.createQueryBuilder('jcsq')

      // 👇 部位和方法从 emr_jcxmmx 取出来
      .leftJoinAndMapMany(
        'jcsq.jcsqmxList', // 映射成 jcxm.mxList 数组
        'emr_jcsqmx',  // 中间表
        'mx',
        'mx.sqdh = jcsq.sqdh'
      )
      .leftJoinAndMapOne('mx.jcbw', 'emr_jcbw', 'bw', 'bw.bwid = mx.bwid')
      .leftJoinAndMapOne('mx.jcff', 'emr_jcff', 'ff', 'ff.ffid = mx.ffid')
      .leftJoinAndMapOne('mx.jcxm', 'emr_jcxm', 'xm', 'xm.jcxmid = mx.jcxmid')
      .leftJoinAndSelect('bw.zlxmList', 'zlxmList')
    queryBuilder.andWhere('jcsq.sqdh = :sqdh', { sqdh: queryDto.sqdh });

    return queryBuilder.getOne()
  }
}
