// src/services/param.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Syspar } from '../entity/syspar.entity';
import { SysparNew } from '../entity/__syspar_new.entity';
import { SysparDto } from '@/modules/system/dto/syspar.dto';

@Injectable()
export class ParamService {
  constructor(
    @InjectRepository(Syspar)
    private readonly sysparRepository: Repository<Syspar>,
    @InjectRepository(SysparNew)
    private readonly sysparNewRepository: Repository<SysparNew>,
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

  async saveParam(sysparDto: SysparDto) {
    const syspar = this.sysparRepository.findOne({
      where: {
        syid: String(sysparDto.xtsb),
        prid: sysparDto.csmc.toUpperCase(),
      },
    });
    if (syspar) {
      await this.sysparRepository.update(
        {
          syid: String(sysparDto.xtsb),
          prid: sysparDto.csmc.toUpperCase(),
        },
        {
          pval: sysparDto.default,
          pnam: sysparDto.bz,
        },
      );
    } else {
      await this.sysparRepository.save({
        syid: String(sysparDto.xtsb),
        prid: sysparDto.csmc.toUpperCase(),
        pval: sysparDto.default,
        pnam: sysparDto.bz,
      });
    }
  }

  async saveNewParam(sysparNew: SysparDto) {
    const saveData = new SysparNew();
    Object.assign(saveData, sysparNew);
    await this.sysparNewRepository.save(saveData);
  }

  async gfGetParaNew(
    liXtsb: number,
    lsCsmc: string,
    lsDefault: string,
    lsBz: string,
  ): Promise<string> {
    const lsXtsb = liXtsb.toString();
    const upperLsBz = lsBz.toUpperCase();

    try {
      // 首先尝试从新表中获取参数
      const existingParam = await this.sysparNewRepository.findOne({
        where: {
          syid: lsXtsb,
          pnam: upperLsBz,
        },
      });

      if (existingParam) {
        return existingParam.pval?.trim() || lsDefault;
      }

      // 如果新表中没有，尝试从旧表中获取
      const oldParam = await this.sysparRepository.findOne({
        where: {
          syid: lsXtsb,
          pnam: upperLsBz,
        },
      });

      if (oldParam) {
        // 将旧表的值迁移到新表
        const newParam = this.sysparNewRepository.create({
          syid: lsXtsb,
          prid: lsCsmc.toUpperCase(),
          pnam: upperLsBz,
          pval: oldParam.pval,
        });
        await this.sysparNewRepository.save(newParam);
        return oldParam.pval?.trim() || lsDefault;
      }

      // 如果两个表中都没有，创建新记录到新表
      const newParam = this.sysparNewRepository.create({
        syid: lsXtsb,
        prid: lsCsmc.toUpperCase(),
        pnam: upperLsBz,
        pval: lsDefault,
      });
      await this.sysparNewRepository.save(newParam);
      return lsDefault;
    } catch (error) {
      console.error(`Failed to get parameter from new table [${lsXtsb}][${upperLsBz}]`, error);
      // 出错时回退到旧表
      return this.gfGetPara(liXtsb, lsCsmc, lsDefault, lsBz);
    }
  }
}
