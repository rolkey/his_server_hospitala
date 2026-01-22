import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { H15SsxbTf } from './h15-ssxb-tf.entity';
import { CreateH15SsxbTfDto, UpdateH15SsxbTfDto } from './dto/h15-ssxb-tf.dto';

// readGsCxsz

@Injectable()
export class H15SsxbTfService {
  constructor(
    @InjectRepository(H15SsxbTf)
    private readonly h15SsxbTfRepository: Repository<H15SsxbTf>,
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
  async add(sourceDtos: CreateH15SsxbTfDto[]): Promise<void> {
    const returnRecords = [];
    // 获取源数据
    for (const sourceDto of sourceDtos) {
      // 创建退费记录
      const returnRecord = new H15SsxbTf();

      // 复制源数据
      Object.assign(returnRecord, sourceDto);

      // 设置退费相关字段
      returnRecord.jfyl = sourceDto.tfsl * -1;
      returnRecord.tpbz = 0;
      returnRecord.jsbz = 0;
      returnRecord.tjbz = 1;
      returnRecord.bz1 = sourceDto.maxid;
      returnRecord.fydh = '';
      returnRecord.ssrq = new Date(); // 当前时间作为退费日期

      if (sourceDto.tpbz === 0) {
        returnRecord.sjtysl = sourceDto.tfsl * -1;
        returnRecord.jfyl = 0;
      }

      returnRecords.push(returnRecord);
    }

    // 保存退费记录
    await this.h15SsxbTfRepository.save(returnRecords);
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
