import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, QueryRunner, Repository } from 'typeorm';
import { h13_brzkqk } from './h13_brzkqk.entity';
import { AbandonBrzkqkDto, ConfirmBrzkqkDto } from './dto/h13_brzkqk.dto';
import { ParamService } from '../h12_xmzd/service/param.service';
import { CustomException } from '@/common/exceptions/custom.exception';
import { ERR } from '@/common/exceptions/error-code';
import { h11_brxx } from '../h11_brxx/h11_brxx.entity';

/**
 * 病人转科情况 h13_brzkqk 服务
 * 表结构见 SQL：主键 (zkksid, zksj, zyid, lrsj)
 */
@Injectable()
export class h13_brzkqkService {
  constructor(
    @InjectRepository(h13_brzkqk)
    private readonly repo: Repository<h13_brzkqk>,
    private readonly dataSource: DataSource,
    private readonly paramService: ParamService,
  ) { }


  /**
   * 
   * @param body 转科确认
   * @returns 
   */
  async confirmZk(body: ConfirmBrzkqkDto) {
    const { zyid } = body;
    // 查看转科记录
    const record = await this.repo.findOne({
      where: {
        zyid,
      },
    });
    if (!record) {
      throw new CustomException(ERR.ERR_500, '转科记录不存在');
    }
    //     1a 在转科记录中写上确认时间和护士
    //     2a 在病人信息表中出院科室写上转科科室，住院状态变为1(住院)
    //     3a 设置转科后的操作(停止病床、医嘱、租床)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      await this.doConfirm(queryRunner, record, body);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        code: 200,
        message: '转科确认成功',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new CustomException(ERR.ERR_500, '转科确认失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 放弃转科
   */
  async abandonZk(body: AbandonBrzkqkDto) {
    const { zyid } = body;
    // 查看转科记录
    const record = await this.repo.findOne({
      where: {
        zyid,
      },
    });
    if (!record) {
      throw new CustomException(ERR.ERR_500, '转科记录不存在');
    }
    //     1a 在转科记录中写上确认时间和护士
    //     2a 在病人信息表中出院科室写上转科科室，住院状态变为1(住院)
    //     3a 设置转科后的操作(停止病床、医嘱、租床)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      await this.doAbandon(queryRunner, record, body);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        code: 200,
        message: '放弃转科成功',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new CustomException(ERR.ERR_500, '放弃转科失败');
    } finally {
      await queryRunner.release();
    }
  }


  /**
   *
   */
  async queryNeedConfirmZk(ksid) {
    // 关联zyid 查出病人信息
    const rows = await this.repo.createQueryBuilder('h13_brzkqk')
      .leftJoinAndSelect('h13_brzkqk.h11_brxxEntity', 'h11_brxx')
      .where('h13_brzkqk.qrsj is null or h13_brzkqk.qrsj is null')
      .andWhere('Upper(h13_brzkqk.zkksid) = Upper(:ksid)', { ksid })
      .getMany();
    return rows;
  }




  /** 确认转科：1a 写确认时间/护士 2a 病人表 3a 停止转出科室病床、医嘱 */
  private async doConfirm(
    queryRunner: QueryRunner,
    record: h13_brzkqk,
    body: ConfirmBrzkqkDto,
  ) {
    const { zyid, qrrid } = body;
    const zkksid = record.zkksid;
    const zksj = record.zksj;
    const cyksid = record.ksid; // 转出科室（原科室）

    // 1a 在转科记录中写上确认时间和护士
    await queryRunner.manager.update(
      h13_brzkqk,
      {
        zkksid: record.zkksid,
        zksj: record.zksj,
        zyid: record.zyid,
        lrsj: record.lrsj,
      },
      { qrsj: new Date(), qrrid: qrrid ?? undefined },
    );

    // 查询接受科室名称
    const ksmcRows = await queryRunner.query(
      `SELECT ksmc FROM dbo.__ksmc WHERE ksid = @0`,
      [zkksid],
    );
    const ksmc = ksmcRows[0]?.ksmc?.trim() ?? zkksid;

    // 2a 在病人信息表中：出院科室、入院科室、费用科室改为接受科室，住院状态变为 1(住院)
    await queryRunner.query(
      `UPDATE h11_brxx
       SET cyksid = @0, cyksmc = @1, ryksid = @2, ryksmc = @3, zkksid = @4, zyzt = 1
       WHERE zyid = @5`,
      [zkksid, ksmc, zkksid, ksmc, zkksid, zyid],
    );

    // 接受科室确认：医嘱主表标志改成未停止
    await queryRunner.query(
      `UPDATE h12_yzzb SET tzbz = 0 WHERE zyid = @0 AND ksid = @1`,
      [zyid, zkksid],
    );

    // 3a 设置转科后的操作：停止转出科室的病床、医嘱（以转科时间为停嘱时间）
    if (cyksid) {
      await queryRunner.query(
        `UPDATE h12_yzzb SET tzbz = 1, tzsj = @0, tzrid = @1 WHERE zyid = @2 AND ksid = @3`,
        [zksj, qrrid ?? '', zyid, cyksid],
      );
      await queryRunner.query(
        `UPDATE h13_cwsyxx SET zyid = '', cwfpxx = '' WHERE zyid = @0 AND ksid = @1`,
        [zyid, cyksid],
      );
    }
  }

  /** 放弃转科：1b 插入作废表 2b 住院状态 3b 删除转科记录；按参数处理押金、医嘱跟科 */
  private async doAbandon(
    queryRunner: QueryRunner,
    record: h13_brzkqk,
    body: AbandonBrzkqkDto,
  ) {
    const { zyid } = body;
    const zkksid = record.zkksid;

    // 1b 将转科记录插入转科记录作废表
    await queryRunner.query(
      `INSERT INTO h13_brzkqk_zf (zkksid, zksj, zyid, lrsj, zfsj, zflryid, lryid)
       VALUES (@0, @1, @2, @3, GETDATE(), @4, @5)`,
      [
        record.zkksid,
        record.zksj,
        record.zyid,
        record.lrsj,
        body.zflryid ?? '',
        record.lryid,
      ],
    );

    // 2b 住院状态变为 1(住院)，清空出院诊断
    await queryRunner.query(
      `UPDATE h11_brxx SET zyzt = 1, cyzd = '' WHERE zyid = @0`,
      [zyid],
    );

    // 接受科室：医嘱主表标志改成未停止
    await queryRunner.query(
      `UPDATE h12_yzzb SET tzbz = 0 WHERE zyid = @0 AND ksid = @1`,
      [zyid, zkksid],
    );

    const yjkzkParam = await this.paramService.gfGetPara(13, 'yjkzk', '0', '转科同时转押金');
    if (yjkzkParam === '1') {
      await queryRunner.query(`UPDATE h11_yjk SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
    }

    const zkjlParam = await this.paramService.gfGetPara(13, 'zkjl', '0', '转科前与转科后分开');
    if (zkjlParam === '1') {
      await queryRunner.query(`UPDATE h12_yzzb SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
      await queryRunner.query(`UPDATE h13_yzzxcs SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
      try {
        await queryRunner.query(`UPDATE h13_yzzxcs_tf SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
      } catch {
        // 表可能不存在
      }
      await queryRunner.query(`UPDATE h11_yjk SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
      await queryRunner.query(`UPDATE h12_blzb SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
      await queryRunner.query(`UPDATE h15_sszb SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
      await queryRunner.query(`UPDATE h15_ssxb SET ksid = @0 WHERE zyid = @1`, [zkksid, zyid]);
      try {
        await queryRunner.query(`UPDATE BQ_HLJL_NEW SET BRKS = @0 WHERE zyh = @1`, [zkksid, zyid]);
      } catch {
        // 表可能不存在
      }
    }

    // 3b 删除转科记录
    await queryRunner.manager.delete(h13_brzkqk, {
      zkksid: record.zkksid,
      zksj: record.zksj,
      zyid: record.zyid,
      lrsj: record.lrsj,
    });
  }
}
