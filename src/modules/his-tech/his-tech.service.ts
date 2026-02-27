import { BadRequestException, Injectable } from '@nestjs/common';
// import dayjs from 'dayjs';
import dayjs = require('dayjs');
import {
  CfDetailDto,
  ConfigDto,
  PatientInfoDto,
  QueryParamsDto,
  YzDetailDto,
} from './his-tech.dto';
import { ParamService } from '../h12_xmzd/service/param.service';
import { DataSource } from 'typeorm';

@Injectable()
export class HisTechService {
  constructor(
    private readonly paramService: ParamService,
    private dataSource: DataSource,
  ) {}

  /**
   * 查询患者
   *
   * @param ip
   * @param queryDto
   * @returns
   */
  async queryBrxxs(ip: string, queryDto: QueryParamsDto): Promise<PatientInfoDto[]> {
    const configDto = await this.getConfig(ip);

    const fylbs = [
      configDto.hlfylbid0,
      configDto.hlfylbid1,
      configDto.hlfylbid2,
      configDto.hlfylbid3,
      configDto.hlfylbid4,
    ].filter((value) => value != null && value !== '');

    if (fylbs.length === 0) {
      throw new BadRequestException('没有配置当前工作站的费用类别！！');
    }

    // 将fylbs数组转换为字符串，用逗号分隔
    const fylbString = fylbs.map((item) => `'${item}'`).join(',');

    const query = `
      SELECT
        -- 患者基本信息
        1 as ywlx,           -- 业务类型：门诊
        mzid as brid,              -- 病人ID
        brxm,                      -- 病人姓名
        xbid,                      -- 性别ID
        brnl,                      -- 病人年龄
        yets as nldw,              -- 年龄单位
        jzsj as zxsj,              -- 执行时间
        ysid,                      -- 医生ID
        ksid,                      -- 科室ID
        lczd as icd11,             -- 诊断
        icd.zwmc as zdmc,          -- 诊断名称
        cyzd2 as icd11_1,            -- 诊断ICD
        brlbid,                    -- 病人类别ID
        qtid,                      -- 其他ID
        sfzh,                      -- 身份证号
        lxdh,                      -- 联系电话
        lxdz,                      -- 联系地址
        ylzh,                      -- 医疗证号
        csrq,                      -- 出生日期
        -- NULL值填充住院特有字段
        NULL as zybh,              -- 住院编号
        NULL as yzxs,              -- 医嘱形式
        NULL as ryzd,              -- 入院诊断
        NULL as cycw,              -- 出院床位
        NULL as rycw,              -- 入院床位
        NULL as bz2,               -- 备注2
        NULL as brlxid,            -- 病人类型ID
        NULL as hkdz,              -- 户口地址
        NULL as ryksmc,            -- 入院科室名称
        NULL as rysj,              -- 入院时间
        NULL as mzys,              -- 门诊医生
        NULL as bzxx,              -- 备注信息
        NULL as jtdh,              -- 家庭电话
        NULL as zyzt               -- 住院状态
      FROM h21_brxx
      LEFT JOIN __jbbmicd10 icd ON icd.icd11 = h21_brxx.lczd
      WHERE h21_brxx.jzsj >= @0
         and h21_brxx.jzsj <= @1
         and mzid in
             (select mzid
                from h23_cfzb,
                     h23_cfxb
               where h21_brxx.mzid = h23_cfzb.mzid
                 and h23_cfzb.cfid = h23_cfxb.cfid
                 and h23_cfxb.yzcs = 0
                 and isnull(h23_cfzb.zfrid, '') = ''
                 and (h21_brxx.qtid = '2' or isnull(h21_brxx.bz, '') = '5' or h21_brxx.ywlx = '体检' or (h23_cfzb.cfzt = 1))
                 and h23_cfxb.fylbid in (${fylbString}))
      UNION ALL
      SELECT
        -- 患者基本信息
        2 as ywlx,           -- 业务类型：住院
        zyid as brid,              -- 病人ID
        brxm,                      -- 病人姓名
        xbid,                      -- 性别ID
        brnl,                      -- 病人年龄
        nldw,                      -- 年龄单位
        -- 使用执行日期作为执行时间
        (SELECT TOP 1 zxrq FROM h13_yzzxcs
         WHERE h13_yzzxcs.zyid = h11_brxx.zyid
           and h13_yzzxcs.zxrq >= @2
           and h13_yzzxcs.zxrq <= @3
           and isnull(h13_yzzxcs.clbz, 0) = 0
         ORDER BY zxrq) as zxsj,   -- 执行时间
        mzys as ysid,              -- 医生ID（门诊医生）
        -- 科室ID处理
        cyksid as ksid, -- 科室ID
        ryzd as icd11,             -- 诊断
        icd.zwmc as zdmc,          -- 诊断名称
        null as icd11_1,           -- 次诊断
        brlxid as brlbid,          -- 病人类别ID（病人类型ID）
        NULL as qtid,              -- 其他ID（住院无此字段）
        sfzh,                      -- 身份证号
        jtdh as lxdh,              -- 联系电话（家庭电话）
        hkdz as lxdz,              -- 联系地址（户口地址）
        ylzh,                      -- 医疗证号
        csrq,                      -- 出生日期
        -- 住院特有字段
        zybh,                      -- 住院编号
        yzxs,                      -- 医嘱形式
        ryzd,                      -- 入院诊断
        cycw,                      -- 出院床位
        rycw,                      -- 入院床位
        h11_brxx.bz2,              -- 备注2
        brlxid,                    -- 病人类型ID
        hkdz,                      -- 户口地址
        ryksmc,                    -- 入院科室名称
        rysj,                      -- 入院时间
        mzys,                      -- 门诊医生
        h11_brxx.bzxx,             -- 备注信息
        jtdh,                      -- 家庭电话
        zyzt                       -- 住院状态
      FROM h11_brxx
      LEFT JOIN __jbbmicd10 icd ON icd.bzbm = h11_brxx.ryzd
      WHERE EXISTS (select 1
                from h13_yzzxcs
               where h13_yzzxcs.zyid = h11_brxx.zyid
                 and h13_yzzxcs.zxrq >= @4
                 and h13_yzzxcs.zxrq <= @5
                 and isnull(h13_yzzxcs.clbz, 0) = 0
                 and h13_yzzxcs.fylbid in (${fylbString}))
      ORDER BY ywlx, zxsj
    `;

    const params = [
      queryDto.kssj,
      queryDto.jssj,
      queryDto.kssj,
      queryDto.jssj,
      queryDto.kssj,
      queryDto.jssj,
    ];

    try {
      const result = await this.dataSource.query(query, params);
      result.forEach((element) => {
        element.zxsj = dayjs(element.zxsj).format('YYYY-MM-DD HH:mm:ss');
      });
      return result;
    } catch (error) {
      console.error('查询患者信息失败:', error);
      throw new Error('查询患者信息失败');
    }
  }

  /**
   * 读配置
   *
   * @param ip
   * @returns
   */
  async getConfig(ip: string): Promise<ConfigDto> {
    // 读取配置
    const [hlfylbid0, hlfylbid1, hlfylbid2, hlfylbid3, hlfylbid4] = await Promise.all([
      this.paramService.gfGetPara(40, 'fylb0_' + ip, '', '医技费用类型0'),
      this.paramService.gfGetPara(40, 'fylb1_' + ip, '', '医技费用类型1'),
      this.paramService.gfGetPara(40, 'fylb2_' + ip, '', '医技费用类型2'),
      this.paramService.gfGetPara(40, 'fylb3_' + ip, '', '医技费用类型3'),
      this.paramService.gfGetPara(40, 'fylb4_' + ip, '', '医技费用类型4'),
    ]);
    return { hlfylbid0, hlfylbid1, hlfylbid2, hlfylbid3, hlfylbid4 };
  }

  /**
   * 保存配置
   *
   * @param ip
   * @param saveDto
   */
  async changeConfig(ip: string, saveDto: ConfigDto) {
    await Promise.all([
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb0_' + ip,
        default: saveDto.hlfylbid0,
        bz: '医技费用类型0',
      }),
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb1_' + ip,
        default: saveDto.hlfylbid1,
        bz: '医技费用类型1',
      }),
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb2_' + ip,
        default: saveDto.hlfylbid2,
        bz: '医技费用类型2',
      }),
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb3_' + ip,
        default: saveDto.hlfylbid3,
        bz: '医技费用类型3',
      }),
      this.paramService.saveParam({
        xtsb: 40,
        csmc: 'fylb4_' + ip,
        default: saveDto.hlfylbid4,
        bz: '医技费用类型4',
      }),
    ]);
  }

  /**
   * 查询住院患者检查单
   * @param ip
   * @param zyid
   */
  async queryDetail1(ip: string, queryDto: QueryParamsDto): Promise<YzDetailDto[]> {
    const configDto = await this.getConfig(ip);
    const fylbs = [configDto.hlfylbid0, configDto.hlfylbid1, configDto.hlfylbid2].filter(
      (value) => value != null && value !== '',
    );

    if (fylbs.length === 0) {
      throw new BadRequestException('没有配置当前工作站的费用类别！！');
    }

    // 将fylbs数组转换为字符串，用逗号分隔
    const fylbString = fylbs.map((item) => `'${item}'`).join(',');

    const query = `
    SELECT h12_yzxb.zyid,
           h12_yzxb.yzlx,
           h12_yzxb.yzxh,
           h12_yzxb.mxxh,
           h12_yzxb.xmid,
           h12_yzxb.xmmc,
           ((h13_yzzxcs.zxcs - h13_yzzxcs.bzxcs) * h13_yzzxcs.jfyl * h13_yzzxcs.kyts) as jfyl,
           h12_yzxb.ksys,
           h12_yzxb.kssxys,
           h12_yzxb.xmdj,
           h12_yzxb.xmdw,
           h12_yzxb.xmgg,
           h12_yzxb.yzzh,
           h12_yzxb.zyid,
           h12_yzxb.clbz,
           h12_yzxb.ksid,
           0 as szbz,
           h12_yzxb.bzxx,
           h12_yzxb.zxhs,
           h12_yzxb.zxsj,
           h12_yzxb.cjid,
           h13_yzzxcs.maxid,
           h13_yzzxcs.yjry,
           h13_yzzxcs.yjrq,
           h13_yzzxcs.zxrq,
           h12_yzxb.yzrq,
           h12_yzxb.tzrq
      FROM h12_yzxb
      join h13_yzzxcs on h12_yzxb.zyid = h13_yzzxcs.zyid
                     and h12_yzxb.yzlx = h13_yzzxcs.yzlx
                     and h12_yzxb.mxxh = h13_yzzxcs.mxxh
                     and h12_yzxb.yzxh = h13_yzzxcs.yzxh
     where h12_yzxb.zyid = @0
       and h12_yzxb.fylbid in (${fylbString})
       and isnull(h13_yzzxcs.clbz, 0) = 0
       and isnull(h12_yzxb.sjbz, 0) = 1
       and h12_yzxb.xmzl = 1
  `;

    const params = [queryDto.brid];

    try {
      const result = await this.dataSource.query(query, params);
      return result.map((item: YzDetailDto) => ({
        ...item,
        zxsj: item.zxsj ? dayjs(item.zxsj).format('YYYY-MM-DD HH:mm:ss') : null,
        yjrq: item.yjrq ? dayjs(item.yjrq).format('YYYY-MM-DD HH:mm:ss') : null,
        zxrq: item.zxrq ? dayjs(item.zxrq).format('YYYY-MM-DD HH:mm:ss') : null,
        yzrq: item.yzrq ? dayjs(item.yzrq).format('YYYY-MM-DD HH:mm:ss') : null,
        tzrq: item.tzrq ? dayjs(item.tzrq).format('YYYY-MM-DD HH:mm:ss') : null,
      }));
    } catch (error) {
      console.error('查询住院患者检查单失败:', error);
      throw new Error('查询住院患者检查单失败');
    }
  }

  /**
   * 查询处方医技单详情
   *
   * @param ip
   * @param queryDto
   * @returns
   */
  async queryDetail0(ip: string, queryDto: QueryParamsDto): Promise<CfDetailDto[]> {
    const configDto = await this.getConfig(ip);
    const fylbs = [
      configDto.hlfylbid0,
      configDto.hlfylbid1,
      configDto.hlfylbid2,
      configDto.hlfylbid3,
      configDto.hlfylbid4,
    ].filter((value) => value != null && value !== '');

    if (fylbs.length === 0) {
      throw new BadRequestException('没有配置当前工作站的费用类别！！');
    }

    // 将fylbs数组转换为字符串，用逗号分隔
    const fylbString = fylbs.map((item) => `'${item}'`).join(',');

    const query = `
    SELECT h23_cfzb.mzid,
           h23_cfxb.cfid,
           h23_cfxb.mxxh,
           h23_cfxb.xmmc,
           h23_cfxb.xmid,
           h23_cfxb.yzcs,
           h23_cfxb.ksid,
           0 as zxsz,
           h23_cfxb.sl,
           h23_cfxb.dj,
           h23_cfxb.yjry,
           h23_cfxb.yjrq,
           h23_cfxb.jcbw,
           h23_cfxb.jcmd
      FROM h23_cfxb,
           h23_cfzb
     WHERE (h23_cfxb.cfid = h23_cfzb.cfid)
       and h23_cfxb.yzcs = 0
       and h23_cfzb.mzid = @0
       and h23_cfxb.fylbid in (${fylbString})
       and h23_cfzb.xjfpid not in (select fpid
                                    from h22_fpzb
                                   where zfbz = 1
                                      or isnull(zfrid, '') <> '')
    `;

    // 确保至少有5个参数，不足的用空字符串填充
    const params = [queryDto.brid];

    try {
      const result = await this.dataSource.query(query, params);
      return result;
    } catch (error) {
      throw new Error(`查询处方详情失败: ${error.message}`);
    }
  }
}
