import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { ConfigReaderService } from '../h12_xmzd/service/config-reader.service';
import { h11_lshService } from '../h11_lsh/h11_lsh.service';

@Injectable()
export class BabyAdviceService {
  constructor(
    @InjectRepository(h11_brxx)
    private h11_brxxRepo: Repository<h11_brxx>,
    private readonly configReaderService: ConfigReaderService,
    private readonly h11_lshService: h11_lshService,
  ) { }

  /**
   * 生成毛毛医嘱 - 主入口函数
   */
  async baby_generateAdvice(zyid: string, ysid: string): Promise<any> {
    try {
      const gs_cxsz = await this.configReaderService.readGsCxsz();
      // 2. 获取母亲记录
      const motherRecord = await this.baby_getMotherRecord(zyid);

      // 3. 验证并处理毛毛数量逻辑
      const babyInfo = await this.baby_processBabyCount(zyid, motherRecord);

      // 4. 插入新的毛毛记录
      const result = await this.baby_insertBabyRecord(motherRecord, babyInfo, ysid, gs_cxsz);

      return result;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `生成毛毛医嘱失败: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取母亲记录
   */
  private async baby_getMotherRecord(zyid: string): Promise<h11_brxx> {
    const motherRecord = await this.h11_brxxRepo.findOne({
      where: { zyid },
    });

    if (motherRecord?.yebz === 1) {
      throw new HttpException('该患者是婴儿，不能生成毛毛，请选择母亲!', HttpStatus.BAD_REQUEST);
    }
    if (motherRecord?.xbid === '1') {
      throw new HttpException('该患者是男性，不能生成毛毛，请选择母亲!', HttpStatus.BAD_REQUEST);
    }
    if (!motherRecord) {
      throw new HttpException('未找到对应的母亲记录', HttpStatus.NOT_FOUND);
    }

    return motherRecord;
  }

  /**
   * 处理毛毛数量逻辑
   */
  private async baby_processBabyCount(
    zyid: string,
    h11_brxx_zy: any,
  ): Promise<{ brxm: string; zybh: string }> {
    const babyCount = await this.h11_brxxRepo.count({
      where: { lsh: zyid, yebz: 1 },
    });

    let brxm = `${h11_brxx_zy.brxm.trim()}毛毛`;
    let zybh = `${h11_brxx_zy.zybh}-1`;

    if (babyCount === 1) {
      // 双胞胎逻辑
      brxm = `${h11_brxx_zy.brxm.trim()}大毛`;
      zybh = `${h11_brxx_zy.zybh}-2`;
    } else if (babyCount >= 2) {
      throw new HttpException('该母亲已是双胞胎！', HttpStatus.BAD_REQUEST);
    }

    return { brxm, zybh };
  }

  /**
   * 插入毛毛记录
   */
  private async baby_insertBabyRecord(
    motherRecord: h11_brxx,
    babyInfo: { brxm: string; zybh: string },
    ysid: any,
    gs_cxsz: any,
  ): Promise<any> {
    // 生成新的流水号
    const newZyid = await this.h11_lshService.getSerialNumber('ZYID', '住院ID号', 12);
    if (newZyid === '-1') {
      throw new HttpException('生成流水号失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 获取最大住院次数
    // const maxZycs = await this.h11_brxxRepo
    //   .createQueryBuilder('brxx')
    //   .select('MAX(brxx.zycs)', 'maxZycs')
    //   .where('brxx.zybh = :zybh', { zybh: babyInfo.zybh })
    //   .getRawOne();

    // const zycs = (maxZycs?.maxZycs || 0) + 1;
    const zycs = motherRecord.zycs;
    const currentTime = new Date();

    // 创建毛毛记录
    const babyRecord = this.baby_createBabyRecord(
      motherRecord,
      babyInfo,
      newZyid,
      zycs,
      ysid,
      gs_cxsz,
      currentTime,
    );

    // 保存新记录
    await this.h11_brxxRepo.save(babyRecord);

    return {
      success: true,
      message: '已生成毛毛，请回到主界面刷新床位卡！',
      data: {
        newZyid: newZyid,
        brxm: babyInfo.brxm,
        zybh: babyInfo.zybh,
      },
    };
  }

  /**
   * 创建毛毛记录对象
   */
  private baby_createBabyRecord(
    motherRecord: h11_brxx,
    babyInfo: { brxm: string; zybh: string },
    newZyid: string,
    zycs: number,
    ysid: any,
    gs_cxsz: any,
    currentTime: Date,
  ): Partial<h11_brxx> {
    // 基于母亲记录创建新的毛毛记录
    const babyRecord: Partial<h11_brxx> = {
      ...motherRecord,

      // 覆盖需要修改的字段
      zyid: newZyid,
      zybh: babyInfo.zybh,
      zycs: zycs,
      brxm: babyInfo.brxm,
      brnl: '1',
      nldw: '天',
      yebz: 1,
      mmlsh: gs_cxsz.mmgl === '1' ? motherRecord.zyid : '',
      rysj: currentTime,
      ryqzsj: currentTime,
      csrq: currentTime,
      mzys: ysid,
      xbid: '',

      // 清空或重置字段
      hyzkmc: '',
      hyid: '',
      mzmc: '',
      sfzh: '',
      cyzd: '',
      hbh: '',
      cyzd1: '',
      cyzd2: '',
      bz4: '',
      ylzh: '',
      cyzd5: '',
    };

    // 移除不应复制的ID字段
    delete (babyRecord as any).id;

    return babyRecord;
  }

  /**
   * 获取毛毛记录统计
   */
  async baby_getBabyStatistics(zyid: string): Promise<{ total: number; details: any[] }> {
    const babies = await this.h11_brxxRepo.find({
      where: { lsh: zyid, yebz: 1 },
      select: ['zyid', 'brxm', 'zybh', 'rysj'],
    });

    const details = babies ?? [];
    return {
      total: details.length,
      details,
    };
  }

  /**
   * 验证是否可以生成毛毛
   */
  //   async baby_validateBabyCreation(zyid: string): Promise<{ valid: boolean; message?: string }> {
  //     try {
  //       const babyCount = await this.h11_brxxRepo.count({
  //         where: { lsh: zyid, yebz: 1 },
  //       });

  //       if (babyCount >= 2) {
  //         return { valid: false, message: '该母亲已是双胞胎，无法再生成毛毛' };
  //       }

  //       return { valid: true };
  //     } catch (error) {
  //       return { valid: false, message: error.message };
  //     }
  //   }
}
