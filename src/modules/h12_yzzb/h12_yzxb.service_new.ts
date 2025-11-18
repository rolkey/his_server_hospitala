import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { h12_yzzb } from './h12_yzzb.entity';
import { h12_yzxb } from './h12_yzxb.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { reviewDto } from './dto/h12_yzzbOpe.dto';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

/**
 * 单一个Service程序过多，应该把一部分功能拆分出来，放在new里面
 */
@Injectable()
export class h12_yzxbServiceNew {
  constructor(
    @InjectRepository(h12_yzzb)
    private h12_yzzbRepo: Repository<h12_yzzb>,
    @InjectRepository(h12_yzxb)
    private h12_yzxbRepo: Repository<h12_yzxb>,
    private readonly gyIdentityService: GyIdentityService,
    private dataSource: DataSource,
  ) { }

  // 取组套
  async addPackageToAdvice() { }


  //护士复核医嘱
  async review(dto: reviewDto) {
    let yzxbList = await this.h12_yzxbRepo.find({
      where: {
        zyid: dto.zyid,
        yzlx: dto.yzlx,
        yzxh: In([...dto.yzxh]),
        mxxh: In([...dto.mxxh])
      },
      select: {
        kshs: true,
        hdhs: true,
        hshdrq: true,
        zyid: true,
        yzlx: true,
        yzxh: true,
        mxxh: true
      }
    })
    yzxbList.forEach((yzxb) => {
      if (yzxb.kshs) {
        throw new CustomException(ERR.ERR_10000, '该医嘱已经复核,复核工号：' + yzxb.kshs);
      }
      if (yzxb.hshd) {
        throw new CustomException(ERR.ERR_10000, '该医嘱已经核对,核对工号：' + yzxb.hshd);
      }
      yzxb.kshs = dto.kshs
      yzxb.hshd = dto.jshs
      // yzxb.hshdrq = new Date()
    })
    await this.h12_yzxbRepo.save(yzxbList)
    // await this.dataSource.transaction(async (manager) => {
    //   try {
    //     const brxxRepository = manager.getRepository(h11_brxx)
    //     const [brxx] = await Promise.all([
    //       brxxRepository.findOne({
    //         where: { zyid: dto.zyid },
    //         select: { rycw: true, cycw: true, zyid: true }
    //       }),
    //     ])
    //     if (!brxx) {
    //       throw new CustomException(ERR.ERR_10000, '未找到有效住院信息');
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     throw new CustomException(ERR.ERR_10000, error.message ?? '复核失败');
    //   }
    // });
  }
}
