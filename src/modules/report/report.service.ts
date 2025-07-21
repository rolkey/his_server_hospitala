import { CreateDto } from './../module/dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, In, Like } from 'typeorm';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';
import { report_params } from './entities/report_params.entity';
import { ReportCategory } from './entities/report_category.entity';
import { ReportInformation } from './entities/report_information.entity';
import { report_sql } from './entities/report_sql.entity';
import {
  Carete_Report_CategoryDto,
  Updateh_Report_CategoryDto,
  Carete_Report_InfomationDto,
  Update_Report_InfomationDto,
  Get_Report_InfomationDto,
} from './dto';
import { SharedService } from '@/shared/shared.service';

@Injectable()
export class reportService {
  constructor(
    @InjectRepository(ReportCategory)
    private reportCategory: Repository<ReportCategory>,
    @InjectRepository(ReportInformation)
    private reportInformation: Repository<ReportInformation>,
    @InjectRepository(report_params)
    private reportParamsRepo: Repository<report_params>,
    @InjectRepository(report_sql)
    private reportSqlRepo: Repository<report_sql>,
    private dataSource: DataSource,
    private readonly sharedService: SharedService,
  ) {}

  findAll() {
    return this.reportSqlRepo.find({});
  }

  listParams(reportCode: string) {
    return this.reportParamsRepo.find({ where: { report_code: reportCode } });
  }

  async listCatetory() {
    const categoryList = await this.reportCategory.find();
    return this.sharedService.handleTree(categoryList, 'sys_report_category_id', 'parent_id');
  }

  async createCatetory(report_catetory: Carete_Report_CategoryDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const create = manager.create(ReportCategory, report_catetory);
        await manager.save(create);
        return true;
      } catch (error) {
        console.error(error);
        throw new CustomException(ErrorCode.ERR_11006, '增加模块失败');
      }
    });
  }

  async updateCategory(id: string, updateDto: Updateh_Report_CategoryDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        // 1. 获取旧数据
        const module = await manager.findOne(ReportCategory, {
          where: { sys_report_category_id: id },
        });

        if (!module) {
          throw new CustomException(ErrorCode.ERR_11006, '模块不存在');
        }
        // 2. 更新其他字段
        manager.merge(ReportCategory, module, updateDto);

        // 3. 保存更新
        await manager.save(module);
        return true;
      } catch (error) {
        console.error(error);
        throw new CustomException(ErrorCode.ERR_11006, '更新模块失败');
      }
    });
  }

  async removeCategory(id: string) {
    const module = await this.reportCategory.findOne({ where: { sys_report_category_id: id } });
    await this.reportCategory.remove(module);
    return true;
  }

  async listInformation(query: Get_Report_InfomationDto) {
    const pageSize = query.pageSize || 500;
    const pageNo = query.pageNo || 1;
    const [data, total] = await this.reportInformation.findAndCount({
      where: { report_category_id: query.report_category_id },
      order: {
        code: 'ASC',
      },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
    });
    return { data, total };
  }

  async createInformation(createDto: Carete_Report_InfomationDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const create = manager.create(ReportInformation, createDto);
        await manager.save(create);
        return true;
      } catch (error) {
        console.error(error);
        throw new CustomException(ErrorCode.ERR_11006, '增加模块失败');
      }
    });
  }

  async updateInformation(id: string, updateDto: Update_Report_InfomationDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        // 1. 获取旧数据
        const module = await manager.findOne(ReportInformation, {
          where: { sys_report_information_id: id },
        });

        if (!module) {
          throw new CustomException(ErrorCode.ERR_11006, '模块不存在');
        }
        // 2. 更新其他字段
        manager.merge(ReportInformation, module, updateDto);

        // 3. 保存更新
        await manager.save(module);
        return true;
      } catch (error) {
        console.error(error);
        throw new CustomException(ErrorCode.ERR_11006, '更新模块失败');
      }
    });
  }

  async removeInformation(id: string) {
    const module = await this.reportInformation.findOne({
      where: { sys_report_information_id: id },
    });
    await this.reportInformation.remove(module);
    return true;
  }
}
