// n04-23.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { N04_23 } from './n04-23.entity';
import {
  CreateN0423Dto,
  QueryN0423Dto,
  UpdateN0423Dto,
  N0423BatchOperationDto,
  N0423ResponseDto,
} from './dto/n04-23.dto';

@Injectable()
export class N0423Service {
  constructor(
    @InjectRepository(N04_23)
    private readonly n0423Repository: Repository<N04_23>,
  ) {}

  /**
   * 创建手术记录
   */
  async create(createDto: CreateN0423Dto): Promise<N0423ResponseDto> {
    const newRecord = this.n0423Repository.create(createDto);
    const saved = await this.n0423Repository.save(newRecord);
    return this.formatResponse(saved);
  }

  /**
   * 分页查询手术记录
   */
  async findAll(queryDto: QueryN0423Dto): Promise<{ total: number; data: N0423ResponseDto[] }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'ssxh',
      sortOrder = 'ASC',
      keyword,
      startDate,
      endDate,
      ...conditions
    } = queryDto;

    const where = this.buildWhereConditions(conditions, keyword, startDate, endDate);

    const [data, total] = await this.n0423Repository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      total,
      data: data.map((item) => this.formatResponse(item)),
    };
  }

  /**
   * 获取单个手术记录
   */
  async findOne(zyid: string, ssxh: number): Promise<N0423ResponseDto> {
    const record = await this.n0423Repository.findOne({ where: { zyid, ssxh } });
    return this.formatResponse(record);
  }

  /**
   * 更新手术记录
   */
  async update(zyid: string, ssxh: number, updateDto: UpdateN0423Dto): Promise<N0423ResponseDto> {
    await this.n0423Repository.update({ zyid, ssxh }, updateDto);
    return this.findOne(zyid, ssxh);
  }

  /**
   * 删除手术记录
   */
  async remove(zyid: string, ssxh: number): Promise<void> {
    await this.n0423Repository.delete({ zyid, ssxh });
  }

  /**
   * 批量操作
   */
  async batchOperation(operationDto: N0423BatchOperationDto): Promise<any> {
    const { operationType, createItems, updateItems, deleteItems } = operationDto;

    switch (operationType) {
      case 'create':
        return this.batchCreate(createItems);
      case 'update':
        return this.batchUpdate(updateItems);
      case 'delete':
        return this.batchDelete(deleteItems);
      default:
        throw new Error('Invalid operation type');
    }
  }

  /**
   * 批量创建
   */
  private async batchCreate(items: CreateN0423Dto[]): Promise<N0423ResponseDto[]> {
    const entities = items.map((item) => this.n0423Repository.create(item));
    const saved = await this.n0423Repository.save(entities);
    return saved.map((item) => this.formatResponse(item));
  }

  /**
   * 批量更新
   */
  private async batchUpdate(
    items: Array<{ zyid: string; ssxh: number; data: UpdateN0423Dto }>,
  ): Promise<void> {
    await Promise.all(
      items.map((item) =>
        this.n0423Repository.update({ zyid: item.zyid, ssxh: item.ssxh }, item.data),
      ),
    );
  }

  /**
   * 批量删除
   */
  private async batchDelete(items: Array<{ zyid: string; ssxh: number }>): Promise<void> {
    await Promise.all(
      items.map((item) => this.n0423Repository.delete({ zyid: item.zyid, ssxh: item.ssxh })),
    );
  }

  /**
   * 构建查询条件
   */
  private buildWhereConditions(
    conditions: any,
    keyword?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const where = {};

    // 处理关键字搜索
    if (keyword) {
      where['ssjczmc'] = Like(`%${keyword}%`);
    }

    // 处理日期范围
    if (startDate && endDate) {
      where['ssjczrq'] = Between(new Date(startDate), new Date(endDate));
    }

    // 处理其他条件
    Object.keys(conditions).forEach((key) => {
      if (conditions[key] !== undefined) {
        if (typeof conditions[key] === 'string') {
          where[key] = Like(`%${conditions[key]}%`);
        } else {
          where[key] = conditions[key];
        }
      }
    });

    return where;
  }

  /**
   * 格式化响应数据
   */
  private formatResponse(record: N04_23): N0423ResponseDto {
    const response = { ...record } as N0423ResponseDto;

    // 格式化手术名称
    if (response.ssjczmc) {
      response.formattedSsjczmc = response.ssjczmc.trim();
    }

    // 格式化ICD10编码
    if (response.icd10) {
      response.formattedIcd10 = response.icd10.toUpperCase();
    }

    // 计算手术持续时间
    if (response.sskssj && response.ssjssj) {
      const duration = new Date(response.ssjssj).getTime() - new Date(response.sskssj).getTime();
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      response.operationDuration = `${hours}小时${minutes}分钟`;
    }

    return response;
  }
}
