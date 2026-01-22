import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { H15SsxbTf } from './h15-ssxb-tf.entity';
import { CreateH15SsxbTfDto, H15SsxbTfDto } from './dto/h15-ssxb-tf.dto';
import { ParamService } from '../h12_xmzd/service/param.service';

// readGsCxsz

@Injectable()
export class H15SsxbTfService {
  constructor(
    @InjectRepository(H15SsxbTf)
    private readonly h15SsxbTfRepository: Repository<H15SsxbTf>,

    private readonly entityManager: EntityManager,
    private readonly paramService: ParamService,
  ) {}

  // 创建记录 - Controller中 @Post() 使用
  async create(h15SsxbTf: Partial<H15SsxbTf>): Promise<H15SsxbTf> {
    const newH15SsxbTf = this.h15SsxbTfRepository.create(h15SsxbTf);
    return await this.h15SsxbTfRepository.save(newH15SsxbTf);
  }

  // 根据条件查询 - Controller中 @Get() 使用
  async findByCondition(condition: Partial<H15SsxbTf>): Promise<H15SsxbTf[]> {
    return await this.h15SsxbTfRepository.find({
      where: condition,
    });
  }

  // 更新记录 - Controller中 @Put() 使用
  async update(h15SsxbTf: Partial<H15SsxbTf>): Promise<void> {
    const { ssid, zyid, ssmxid, maxid, ...updateData } = h15SsxbTf;
  }

  // 删除记录 - Controller中 @Delete() 使用
  async remove(maxid: number): Promise<void> {
    await this.h15SsxbTfRepository.delete({ maxid });
  }

  // 批量保存 - 用于保存收费明细
  async add(sourceDtos: CreateH15SsxbTfDto[], manager: EntityManager): Promise<void> {
    const returnRecords = [];
    // 获取源数据
    for (const sourceDto of sourceDtos) {
      // 创建退费记录
      const returnRecord = new H15SsxbTf();

      // 复制源数据
      //   const { maxid, ...sourceDtoWithoutMaxid } = sourceDto;
      Object.assign(returnRecord, sourceDto);

      // 设置退费相关字段
      returnRecord.jfyl = sourceDto.tfsl * -1;
      returnRecord.tpbz = 0;
      returnRecord.jsbz = 0;
      returnRecord.tjbz = 1;
      returnRecord.bz1 = sourceDto.maxid;
      returnRecord.xnhbz = sourceDto.maxid;
      returnRecord.fydh = '';
      returnRecord.ssrq = new Date(); // 当前时间作为退费日期

      if (sourceDto.tpbz === 0) {
        returnRecord.sjtysl = sourceDto.tfsl * -1;
        returnRecord.jfyl = 0;
      }

      returnRecords.push(returnRecord);
    }

    // 保存退费记录
    await manager.save(H15SsxbTf, returnRecords);
  }

  // 在 H15SsxbTfService 类中添加以下方法

  /**
   * 处理退费逻辑
   * @param returnRecords 退费记录数组
   */
  //   async processRefund(returnRecords: CreateH15SsxbTfDto[]): Promise<void> {
  //     const yksl = await this.paramService.gfGetPara(30, 'yksl', '0', '启用药品预扣数量');
  //     for (const record of returnRecords) {
  //       // 检查处理标志
  //       if (record.clbz === 1 || record.clbz === 2) {
  //         continue;
  //       }

  //       // 获取医嘱信息
  //       const prescription = await this.h15SsxbTfRepository
  //         .createQueryBuilder('h12_yzxb')
  //         .select('ksid')
  //         .where('zyid = :zyid', { zyid: record.zyid })
  //         .andWhere('yzlx = :yzlx', { yzlx: record.yzlx })
  //         .andWhere('yzxh = :yzxh', { yzxh: record.yzxh })
  //         .andWhere('mxxh = :mxxh', { mxxh: record.mxxh })
  //         .getRawOne();

  //       if (!prescription?.ksid) {
  //         throw new Error(`${record.xmid}医嘱发药科室为空，请核对!`);
  //       }

  //       // 计算退费数量
  //       const refundQuantity = record.jfyl * (record.zxcs - record.bzxcs) * record.kyts;

  //       const kssz = await this.paramService.gfGetPara(30, 'yzkssz', '0', '医嘱科室发药');

  //       // 如果启用预扣数量且有批次号
  //       if (yksl === '1' && record.scph) {
  //         // 调用库存预扣方法
  //         await this.gu_ypgl.ue_kcxx_yksl(
  //           3,
  //           prescription.ksid,
  //           record.xmid,
  //           record.scph,
  //           refundQuantity,
  //         );

  //         // 更新处理标志为已退药
  //         record.clbz = 2;
  //       }
  //     }

  //     // 保存更新的记录
  //     await this.h15SsxbTfRepository.save(returnRecords);
  //   }

  async commitTf(sourceDtos: H15SsxbTfDto): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      try {
        await this.add(sourceDtos.tfList, manager);

        await manager.query(
          `EXEC sp_h13zxcs_fyjl @as_ksid = '', @li_para = @0, @ls_usid = @1, @yzlx = 3`,
          [sourceDtos.zyid, sourceDtos.userId],
        );
      } catch (error) {
        console.error('手术退费错误！！', error);
      }
    });
  }

  // 分页查询
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    condition?: Partial<H15SsxbTf>,
  ): Promise<[H15SsxbTf[], number]> {
    const [data, total] = await this.h15SsxbTfRepository.findAndCount({
      where: condition,
      skip: (page - 1) * limit,
      take: limit,
    });
    return [data, total];
  }

  // 更新收费状态
  async updateFeeStatus(
    ssid: string,
    zyid: string,
    ssmxid: number,
    jsbz: number,
    jsdh?: string,
  ): Promise<void> {
    await this.h15SsxbTfRepository.update({ ssid, zyid, ssmxid }, { jsbz, jsdh });
  }

  // 批量更新收费状态
  async batchUpdateFeeStatus(
    ssids: string[],
    zyids: string[],
    ssmxids: number[],
    jsbz: number,
    jsdh?: string,
  ): Promise<void> {
    await this.h15SsxbTfRepository
      .createQueryBuilder()
      .update(H15SsxbTf)
      .set({ jsbz, jsdh })
      .where('ssid IN (:...ssids) AND zyid IN (:...zyids) AND ssmxid IN (:...ssmxids)', {
        ssids,
        zyids,
        ssmxids,
      })
      .execute();
  }
}
