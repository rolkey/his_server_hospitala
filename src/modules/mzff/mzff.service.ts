import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Mzff } from './mzff.entity';
import { QueryMzffDto } from './dto/mzff.dto';

@Injectable()
export class MzffService {
  constructor(
    @InjectRepository(Mzff)
    private readonly mzffRepository: Repository<Mzff>,
  ) {}

  // 创建记录 - Controller中 @Post() 使用
  async create(mzff: Partial<Mzff>): Promise<Mzff> {
    const newMzff = this.mzffRepository.create(mzff);
    return await this.mzffRepository.save(newMzff);
  }

  // 根据条件查询 - Controller中 @Get() 使用
  async findByCondition(queryDto: QueryMzffDto) {
    const { pageSize = 10, pageNo = 1, value } = queryDto;
    const params = value ?? '';
    const where = [
      { mzffmc: Like(`%${params}%`) },
      { gjmc: Like(`%${params}%`) },
      { pybm: Like(`%${params?.toUpperCase()}%`) },
      { wbbm: Like(`%${params?.toUpperCase()}%`) },
    ];

    const [data, total] = await this.mzffRepository.findAndCount({
      where,
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    });

    return { total, data };
  }

  // 更新记录 - Controller中 @Put() 使用
  async update(mzff: Partial<Mzff>): Promise<Mzff> {
    const { mzid, ...mzffUpdate } = mzff;
    await this.mzffRepository.update({ mzid }, mzffUpdate);
    return await this.mzffRepository.findOne({
      where: { mzid },
    });
  }

  // 删除记录 - Controller中 @Delete() 使用
  async remove(mzid: string): Promise<void> {
    await this.mzffRepository.delete({ mzid });
  }

  // 保存门诊方式列表 - 用于批量保存
  async save(mzffs: Partial<Mzff>[]): Promise<void> {
    await this.mzffRepository.save(mzffs);
  }
}
