import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { N0421 } from '../n04_21/n04_21.entity';

/**
 * 病案已归档（N04_21.sjbz=1）时禁止普通修改。
 * 若请求体显式携带 sjbz（工作流写状态 / 取消归档），则放行。
 */
@Injectable()
export class PatientCaseLockService {
  constructor(
    @InjectRepository(N0421)
    private readonly n0421Repository: Repository<N0421>,
  ) {}

  async assertNotArchived(
    zyid?: string,
    options?: { allowWorkflowWrite?: boolean; sjbz?: unknown },
  ) {
    if (!zyid) return;

    const allowWorkflowWrite =
      options?.allowWorkflowWrite === true || options?.sjbz !== undefined;
    if (allowWorkflowWrite) return;

    const basic = await this.n0421Repository.findOne({
      where: { zyid },
      select: ['zyid', 'sjbz'],
    });
    if (basic && Number(basic.sjbz) === 1) {
      throw new ConflictException('病案已归档，不允许修改！');
    }
  }
}
