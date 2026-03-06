import { H12_mbSaveDto } from './h12_mbzb.dto';
// src/h12_mbzb/h12_mbzb.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, DataSource } from 'typeorm';
import { H12_mbzb } from './h12_mbzb.entity';
import {
  CreateH12_mbzbDto,
  UpdateH12_mbzbDto,
  QueryH12_mbzbDto,
  H12_mbzbResponseDto,
} from './h12_mbzb.dto';
import { H12_mbxb } from '../h12_mbxb/h12_mbxb.entity';
import { GyIdentityService } from '../gy_identity/gy-identity.service';
import { H00TcxbZyfj } from '../h00_tcxb/entity/h00_tcxb_zyfj.entity';

@Injectable()
export class H12_mbzbService {
  constructor(
    @InjectRepository(H12_mbzb)
    private readonly h12MbzbRepository: Repository<H12_mbzb>,
    @InjectRepository(H12_mbxb)
    private readonly h12MbxbRepository: Repository<H12_mbxb>,
    // @InjectRepository(H00TcxbZyfj)
    // private readonly h00TcxbZyfjRepository: Repository<H00TcxbZyfj>,
    // private readonly gyIdentityService: GyIdentityService,
    private dataSource: DataSource,
  ) {}

  async findAll(queryDto: QueryH12_mbzbDto) {
    const queryBuilder = this.h12MbzbRepository
      .createQueryBuilder('h12_mbzb')
      .leftJoinAndSelect('h12_mbzb.ksidEntity', 'ksidEntity')
      .leftJoinAndSelect('h12_mbzb.ysidEntity', 'ysidEntity');

    // 费用类别
    if (queryDto.xtsb) {
      // 按费用类型查询
      queryBuilder.andWhere('h12_mbzb.bz1 = :xtsb', { xtsb: queryDto.xtsb });
    }

    // 费用类别
    if (queryDto.mbfl !== '0') {
      // 按费用类型查询
      queryBuilder.andWhere('h12_mbzb.mbfl = :mbfl', { mbfl: queryDto.mbfl });
    }

    // 模板类型
    queryBuilder.andWhere('h12_mbzb.mblx = :mblx', { mblx: queryDto.mblx });
    if (Number(queryDto.mblx) === 2) {
      queryBuilder.andWhere('h12_mbzb.ysid = :ysid', { ysid: queryDto.ysid });
    }
    if (Number(queryDto.mblx) === 1) {
      queryBuilder.andWhere('h12_mbzb.ksid = :ksid', { ksid: queryDto.ksid });
    }
    /**
 * 	String ls_filter
	If Asc(Left(Trim(This.Text),1)) > 160 Then
		ls_filter = "Upper(mbmc) LIKE '" + Upper(This.Text) + "%" + "'"//用汉字查找
	Else
		IF ii_input_way  = 1 THEN//拼音输入
			ls_filter = "Upper(pybm) LIKE '" + Upper(This.Text) + "%" + "'"
		ELSEIF ii_input_way  = 2 THEN//五笔输入
			ls_filter = "Upper(wbbm) LIKE '" + Upper(This.Text) + "%" + "'"
		ElseIf ii_input_way  = 3 Then//其他
			ls_filter = "Upper(qtbm) LIKE '" + "%" + Upper(This.Text) + "%" + "'"
		END IF
	End If
 */
    // 模糊查询
    if (queryDto.value) {
      const value = '%' + queryDto.value.toUpperCase() + '%';
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere('h12_mbzb.mbmc like :value', { value })
            .orWhere('h12_mbzb.pybm like :value', { value })
            .orWhere('h12_mbzb.wbbm like :value', { value })
            .orWhere('h12_mbzb.qtbm like :value', { value });
        }),
      );
    }

    // 返回数据
    const pageSize = queryDto.pageSize || 10;
    const pageNo = queryDto.pageNo || 1;
    queryBuilder.skip((pageNo - 1) * pageSize).take(pageSize);
    const [pageData, total] = await queryBuilder.getManyAndCount();
    return { pageData, total };
  }

  async findOne(mbid: string, mblx: number): Promise<H12_mbzbResponseDto | null> {
    const item = await this.h12MbzbRepository.findOne({ where: { mbid, mblx } });
    return item ? this.toResponseDto(item) : null;
  }

  async create(createDto: CreateH12_mbzbDto): Promise<H12_mbzbResponseDto> {
    const newItem = this.h12MbzbRepository.create(createDto);
    const savedItem = await this.h12MbzbRepository.save(newItem);
    return this.toResponseDto(savedItem);
  }

  async update(
    mbid: string,
    mblx: number,
    updateDto: UpdateH12_mbzbDto,
  ): Promise<H12_mbzbResponseDto | null> {
    await this.h12MbzbRepository.update({ mbid, mblx }, updateDto);
    const updatedItem = await this.h12MbzbRepository.findOne({ where: { mbid, mblx } });
    return updatedItem ? this.toResponseDto(updatedItem) : null;
  }

  async _getMaxMbid(): Promise<string> {
    const dateStr = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const mbzb = await this.h12MbzbRepository
      .createQueryBuilder('h12_mbzb')
      .select('MAX(mbid)', 'maxMbid')
      .where(`mbid like '${dateStr}%'`)
      .getRawOne();
    if (mbzb.maxMbid) {
      return (Number(mbzb.maxMbid) + 1).toString();
    } else {
      return dateStr + '0001';
    }
  }

  //  保存模板
  async saveMb(h12_mbSaveDto: H12_mbSaveDto) {
    const newItem = this.h12MbzbRepository.create(h12_mbSaveDto);
    if (!newItem.mbid) {
      newItem.mbid = await this._getMaxMbid();
    }
    const savedItem = await this.h12MbzbRepository.save(newItem);
    await Promise.all(
      h12_mbSaveDto.h12mbxb.map(async (item, index) => {
        item.mbid = savedItem.mbid;
        item.mblx = savedItem.mblx;
        item.mxxh = index + 1;
        const mbxb = this.h12MbxbRepository.create(item);
        return this.h12MbxbRepository.save(mbxb);
        // 如果是中药处方，保存中药明细
      }),
    );
    // if (h12_mbSaveDto.cyTcxb?.length > 0) {
    //   await Promise.all(
    //     h12_mbSaveDto.cyTcxb.map(async (item, index) => {
    //       item.mxxh = index + 1;
    //       item.tcid = newItem.mbid;
    //       const newTcxb = this.h00TcxbZyfjRepository.create(item);
    //       return this.h00TcxbZyfjRepository.save(newTcxb);
    //     }),
    //   );
    // }
    return true;
  }

  async delete(mbid: string, mblx: number): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      await manager.delete(H12_mbxb, { mbid, mblx });
      await manager.delete(H12_mbzb, { mbid, mblx });
    });
  }

  private toResponseDto(item: H12_mbzb): H12_mbzbResponseDto {
    return {
      mbid: item.mbid,
      mblx: item.mblx,
      mbmc: item.mbmc,
      mbbz: item.mbbz,
      pybm: item.pybm,
      wbbm: item.wbbm,
      qtbm: item.qtbm,
      ksid: item.ksid,
      mbfl: item.mbfl,
      ysid: item.ysid,
      bz1: item.bz1,
      bz2: item.bz2,
      bz3: item.bz3,
    };
  }
}
