import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { N0422 } from './n04_22.entity';
import { PatientCaseLockService } from '../n04_21/patient-case-lock.service';

@Injectable()
export class N0422Service {
  constructor(
    @InjectRepository(N0422)
    private readonly n0422Repository: Repository<N0422>,
    private readonly patientCaseLockService: PatientCaseLockService,
  ) {}

  // 创建记录 - Controller中 @Post() 使用
  async create(n0422: Partial<N0422>): Promise<N0422> {
    const newN0422 = this.n0422Repository.create(n0422);
    return await this.n0422Repository.save(newN0422);
  }

  // 根据条件查询 - Controller中 @Get() 使用
  async findByCondition(condition: Partial<N0422>): Promise<N0422[]> {
    return await this.n0422Repository.find({
      where: condition,
    });
  }

  // 更新记录 - Controller中 @Put() 使用
  async update(n0422: Partial<N0422>): Promise<N0422> {
    const { zyid, zdxh, ...n0422Update } = n0422;
    await this.n0422Repository.update({ zyid, zdxh }, n0422Update);
    return await this.n0422Repository.findOne({
      where: { zyid, zdxh },
    });
  }

  // 删除记录 - Controller中 @Delete() 使用
  async remove(zyid: string, zdxh: number): Promise<void> {
    await this.n0422Repository.delete({ zyid, zdxh });
  }

  async save(zyid: string, n0422s: Partial<N0422>[]): Promise<void> {
    // 诊断行若显式带 sjbz，视为工作流写状态，放行；否则已归档则拒绝
    const hasSjbz =
      Array.isArray(n0422s) && n0422s.some((row) => row && row.sjbz !== undefined);
    await this.patientCaseLockService.assertNotArchived(zyid, {
      allowWorkflowWrite: hasSjbz,
    });
    await this.n0422Repository.delete({ zyid });
    for (const [index, n0422] of n0422s.entries()) {
      n0422.zyid = zyid;
      n0422.zdxh = index;
    }
    await this.n0422Repository.insert(n0422s);
  }
}