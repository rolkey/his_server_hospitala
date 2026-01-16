import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { H15Sszb } from './h15-sszb.entity';
import {
  CreateH15SszbDto,
  UpdateH15SszbDto,
  QueryH15SszbDto,
  SurgeryStatisticsDto,
} from './dto/h15-sszb.dto';

@Injectable()
export class H15SszbService {
  constructor(
    @InjectRepository(H15Sszb)
    private readonly repository: Repository<H15Sszb>,
  ) {}

  // CRUD 方法
  async create(createDto: CreateH15SszbDto): Promise<H15Sszb> {
    // 检查h5-sszb是否存在匹配记录
    return await this.repository.save(createDto);
  }

  async findAll(queryDto: QueryH15SszbDto) {
    // 构建查询条件
    const whereCondition: any = {};

    // 只有当 ssid 有值时才加入查询条件
    if (queryDto.ssid) {
      whereCondition.ssid = queryDto.ssid;
    }

    // 只有当 zyid 有值时才加入查询条件
    if (queryDto.zyid) {
      whereCondition.zyid = queryDto.zyid;
    }

    // 只有当 xh 有值时才加入查询条件
    if (queryDto.xh) {
      whereCondition.xh = queryDto.xh;
    }

    // 只有当 ksid 有值时才加入查询条件
    if (queryDto.ksid) {
      whereCondition.ksid = queryDto.ksid;
    }

    // 只有当日期范围都有值时才加入查询条件
    // if (queryDto.startDate && queryDto.endDate) {
    //   whereCondition.ssrq = Between(queryDto.startDate, queryDto.endDate);
    // }

    // // 只有当患者姓名有值时才加入模糊查询条件
    // if (queryDto.patientName) {
    //   whereCondition.brxm = Like(`%${queryDto.patientName}%`);
    // }

    return this.repository.find({
      where: whereCondition,
    });
  }

  async findOne(ssid: string, zyid: string, xh: number, ksid: string): Promise<H15Sszb> {
    // 实现按复合主键查询
    return await this.repository.findOne({ where: { ssid, zyid, xh, ksid } });
  }

  async update(
    // ssid: string,
    // zyid: string,
    // xh: number,
    // ksid: string,
    updateDto: UpdateH15SszbDto,
  ): Promise<H15Sszb> {
    // 实现更新逻辑
    const { ssid, zyid, xh, ksid, ...updateValue } = updateDto;
    const entity = await this.repository.findOne({ where: { ssid, zyid, xh, ksid } });
    if (!entity) {
      throw new NotFoundException('未找到对应的手术记录');
    }
    return await this.repository.save({ ...entity, ...updateValue });
  }

  async remove(ssid: string): Promise<void> {
    // 实现删除逻辑
    this.repository.delete(ssid);
  }

  // 业务方法
  async findByZyid(zyid: string): Promise<H15Sszb[]> {
    // 根据住院ID查询所有手术记录
    return this.repository.find({ where: { zyid } });
  }

  async getSurgeryStatistics(statisticsDto: SurgeryStatisticsDto) {
    // 获取手术统计信息
  }

  //   async updateSurgeryStatus(
  //     ssid: string,
  //     zyid: string,
  //     xh: number,
  //     ksid: string,
  //     statusDto: UpdateSurgeryStatusDto,
  //   ) {
  //     // 更新手术状态
  //   }
}
