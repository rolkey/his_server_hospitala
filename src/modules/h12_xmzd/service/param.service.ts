// src/services/param.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Syspar } from '../entity/syspar.entity';

@Injectable()
export class ParamService {
  constructor(
    @InjectRepository(Syspar)
    private readonly sysparRepository: Repository<Syspar>,
  ) {}

  async gfGetPara(
    liXtsb: number,
    lsCsmc: string,
    lsDefault: string,
    lsBz: string,
  ): Promise<string> {
    const lsXtsb = liXtsb.toString();
    const upperLsBz = lsBz.toUpperCase();

    // 检查参数是否存在
    const existingParam = await this.sysparRepository.findOne({
      where: {
        syid: lsXtsb,
        pnam: upperLsBz,
      },
    });

    if (!existingParam) {
      // 参数不存在，创建新记录
      const newParam = this.sysparRepository.create({
        syid: lsXtsb,
        prid: lsCsmc.toUpperCase(),
        pnam: upperLsBz,
        pval: lsDefault,
      });

      try {
        await this.sysparRepository.save(newParam);
        return lsDefault;
      } catch (error) {
        console.error(`Failed to create parameter [${lsXtsb}][${upperLsBz}]`, error);
        throw error;
      }
    }

    // 参数存在，返回当前值
    return existingParam.pval?.trim();
  }
}
