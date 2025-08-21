import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h11_zybh } from './h11_zybh.entity';
import { DateTime } from 'luxon';
import { ParamService } from '@/modules/h12_xmzd/service/param.service';
import { log } from 'console';
@Injectable()
export class h11_zybhService {
  constructor(
    @InjectRepository(h11_zybh)
    private h11_zybhRepo: Repository<h11_zybh>,
    private readonly paramService: ParamService,
  ) {}

  async findCurrentZYBH() {
    const result =
      (await this.h11_zybhRepo.findOne({
        where: { hsbz: 1 },
      })) ||
      (await this.h11_zybhRepo.findOne({
        where: { hsbz: 0 },
      }));
    const rule = await this.paramService.gfGetPara(11, 'zybhsz', '按自定义', '住院号生成规则');
    return {
      zybh: this.convertZybh(rule, result.code, String(result.zybh)),
    };
  }

  async addUpZYBH(zybh: number) {
    return this.h11_zybhRepo
      .createQueryBuilder()
      .update(h11_zybh)
      .set({
        zybh: zybh + 1,
      })
      .where('hsbz = 0')
      .execute();
  }

  /**
   * 根据策略生成住院号/病案号
   * @param strategy 编号策略
   * @param length 编号长度
   * @param existingNumber 现有编号
   * @returns 生成的编号
   */
  private convertZybh(strategy: string, length: number, existingNumber: string): string {
    const currentDate = DateTime.now();
    let generatedNumber: string;

    switch (strategy) {
      case '病案号次数0000001':
      case '按自定义':
      case '住院号病案号取新的':
      case '住院号病案号取旧的':
      case '住院号取新病案号取旧':
        generatedNumber = existingNumber || '';
        break;

      case '按年份yyyy0001':
        generatedNumber = this.handleYearPrefixStrategy(
          existingNumber,
          currentDate.toFormat('yyyy'),
          4,
          '0001',
          4,
        );
        break;

      case '按年份yymm001':
        generatedNumber = this.handleYearPrefixStrategy(
          existingNumber,
          currentDate.toFormat('yyMM'),
          4,
          '001',
          3,
        );
        break;

      case '按年份yymm0001':
        generatedNumber = this.handleYearPrefixStrategy(
          existingNumber,
          currentDate.toFormat('yyMM'),
          4,
          '0001',
          4,
        );
        break;

      case '按年份yyyymm001':
        generatedNumber = this.handleYearPrefixStrategy(
          existingNumber,
          currentDate.toFormat('yyyyMM'),
          6,
          '001',
          3,
        );
        break;

      case '按年份yyyymm0001':
        generatedNumber = this.handleYearPrefixStrategy(
          existingNumber,
          currentDate.toFormat('yyyyMM'),
          6,
          '0001',
          4,
        );
        break;

      case '按年份yyyymmdd01':
        generatedNumber = this.handleYearPrefixStrategy(
          existingNumber,
          currentDate.toFormat('yyyyMMdd'),
          8,
          '01',
          2,
        );
        break;

      case '按年份yyyymm00001':
        generatedNumber = this.handleYearPrefixStrategy(
          existingNumber,
          currentDate.toFormat('yyyyMM'),
          6,
          '00001',
          5,
        );
        break;

      default:
        throw new Error(`未知的编号策略: ${strategy}`);
    }
    return generatedNumber.padStart(12, '0').slice(-length);
  }

  /**
   * 处理带年份前缀的编号策略
   * @param existingNumber 现有编号
   * @param datePrefix 日期前缀
   * @param prefixLength 前缀长度
   * @param defaultSuffix 默认后缀
   * @param suffixLength 后缀长度(可选)
   */
  private handleYearPrefixStrategy(
    existingNumber: string,
    datePrefix: string,
    prefixLength: number,
    defaultSuffix: string,
    suffixLength?: number,
  ): string {
    if (!existingNumber || existingNumber.length !== prefixLength + defaultSuffix.length) {
      return datePrefix + defaultSuffix;
    }

    const existingPrefix = existingNumber.substring(0, prefixLength);
    if (existingPrefix !== datePrefix) {
      return datePrefix + defaultSuffix;
    }

    if (suffixLength) {
      return datePrefix + existingNumber.substring(prefixLength).padStart(suffixLength, '0');
    }

    return existingNumber;
  }
}
