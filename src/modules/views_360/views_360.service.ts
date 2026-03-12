import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { h21_brxx } from '../h21_brxx/h21-brxx.entity';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';
import { MedicalRecordQueryDto } from './views_360.dto';
import { H21Ylzh } from '../h21_ylzh/h21_ylzh.entity';
import { N04_23 } from '../n04-23/n04-23.entity';

@Injectable()
export class Views360Service {
  constructor(
    @InjectRepository(h21_brxx)
    private readonly h21BrxxRepo: Repository<h21_brxx>,
    @InjectRepository(h11_brxx)
    private readonly h11BrxxRepo: Repository<h11_brxx>,
    @InjectRepository(H21Ylzh)
    private readonly h21YlzhRepo: Repository<H21Ylzh>,

    @InjectRepository(N04_23)
    private readonly n04_23Repo: Repository<N04_23>,
  ) {}

  async findMedicalRecord(queryDto: MedicalRecordQueryDto): Promise<any[]> {
    const { ylzh, startDate, endDate } = queryDto;

    // 门诊：h21_brxx
    const mzQuery = await this.h21BrxxRepo
      .createQueryBuilder('h21')
      .leftJoinAndSelect('h21.Jbbmicd10Entity', 'jbbmicd10Entity')
      .leftJoinAndSelect('h21.kfysidEntity', 'ysidEntity')
      .leftJoinAndSelect('h21.ksidEntity', 'ksidEntity')
      .leftJoinAndSelect('h21.fyidEntity', 'fyidEntity')
      .where('h21.ylzh = :ylzh', { ylzh });
    if (startDate) {
      mzQuery.andWhere('h21.jzsj >= :startDate', { startDate: new Date(startDate) });
    }
    if (endDate) {
      mzQuery.andWhere('h21.jzsj <= :endDate', { endDate: new Date(endDate) });
    }
    const mzList = await mzQuery.getMany();

    // 住院：h11_brxx
    const zyQuery = await this.h11BrxxRepo
      .createQueryBuilder('h11')
      .leftJoinAndSelect('h11.cyksidEntity', 'ksidEntity')
      .leftJoinAndSelect('h11.ryzdEntity', 'jbbmicd10Entity')
      .leftJoinAndSelect('h11.sxysEntity', 'ysidEntity')
      .leftJoinAndSelect('h11.fyidEntity', 'fyidEntity')
      .where('h11.ylzh = :ylzh', { ylzh });
    if (startDate) {
      zyQuery.andWhere('h11.rysj >= :startDate', { startDate: new Date(startDate) });
    }
    if (endDate) {
      zyQuery.andWhere('h11.rysj <= :endDate', { endDate: new Date(endDate) });
    }
    const zyList = await zyQuery.getMany();

    // const list = [...mzList, ...zyList].sort((a, b) => {
    //   const t1 = a.就诊时间 ? new Date(a.就诊时间).getTime() : 0;
    //   const t2 = b.就诊时间 ? new Date(b.就诊时间).getTime() : 0;
    //   return t2 - t1;
    // });

    return [
      ...mzList.map((item: any) => ({
        ...item,
        jzsj: item.jzsj,
        jzh: item.mzid,
        type: '1',
        zdmc: item.Jbbmicd10Entity?.bzmc,
        ysmc: item.kfysidEntity?.unam,
        ksmc: item.ksidEntity?.ksmc,
        fymc: item.fyidEntity?.fymc,
        id: item.mzid + '_' + 1,
      })),
      ...zyList.map((item: any) => ({
        ...item,
        jzsj: item.rysj,
        jzh: item.zyid,
        type: '2',
        zdmc: item.ryzdEntity?.bzmc,
        ysmc: item.sxysEntity?.unam,
        ksmc: item.cyksidEntity?.ksmc,
        fymc: item.fyidEntity?.fyname,
        id: item.zyid + '_' + 2,
      })),
    ].sort((a, b) => {
      return new Date(b.jzsj).getTime() - new Date(a.jzsj).getTime();
    });
  }

  async findPatientInfo(ylzh: string) {
    const patientInfo = await this.h21YlzhRepo.findOne({ where: { ylzh } });
    // 取门诊病人信息
    const mzPatientInfo = await this.h21BrxxRepo.findOne({
      where: { ylzh },
      order: { jzsj: 'DESC' },
    });

    // 门诊次数
    const mzCount = await this.h21BrxxRepo.count({ where: { ylzh } });
    // 住院次数
    const zyCount = await this.h11BrxxRepo.count({ where: { ylzh } });

    // 检验次数：v_his_yh_liszb 与 V_BRXX 关联，按就诊号匹配，按医疗账户过滤
    // 对应 SQL：
    // select count(*)
    // from v_his_yh_liszb lis
    // join V_BRXX v on lis.brdh = v.jzbh
    // where v.ylzh = @ylzh
    // const jyCount = await this.h21BrxxRepo.manager
    //   .createQueryBuilder()
    //   .from('V_BRXX', 'v')
    //   .innerJoin('v_his_yh_liszb', 'lis', 'lis.brdh = v.jzbh')
    //   .where('v.ylzh = :ylzh', { ylzh })
    //   .getCount();

    // 检查次数：pacs_report(T_STUDY_REPORT) 与 V_BRXX 关联，门诊号 / 住院号任一匹配
    // 对应 SQL：
    // select count(*)
    // from V_BRXX v
    // join pacs_report T_STUDY_REPORT
    //   on v.jzbh = T_STUDY_REPORT.门诊号
    //   or v.jzbh = T_STUDY_REPORT.住院号
    // where v.ylzh = @ylzh
    // const jcCount = await this.h21BrxxRepo.manager
    //   .createQueryBuilder()
    //   .from('V_BRXX', 'v')
    //   .innerJoin(
    //     'pacs_report',
    //     'T_STUDY_REPORT',
    //     'v.jzbh = T_STUDY_REPORT.门诊号 OR v.jzbh = T_STUDY_REPORT.住院号',
    //   )
    //   .where('v.ylzh = :ylzh', { ylzh })
    //   .getCount();
    let surgeryHistory = [];

    // 手术史
    // 先找住院id, 然后找手术史
    const zyInfo = await this.h11BrxxRepo.findOne({ where: { ylzh } });
    if (zyInfo) {
      surgeryHistory = await this.n04_23Repo.find({ where: { zyid: zyInfo.zyid } });
    }
    return {
      ...patientInfo,
      mzCount: mzCount,
      zyCount: zyCount,
      // jyCount,
      // jcCount,
      tw: mzPatientInfo?.tw,
      tzxx: mzPatientInfo?.tzxx,
      ywfy: mzPatientInfo?.ywfy,
      surgeryHistory: surgeryHistory.map((item) => item.ssjczmc),
    };
  }
}
