import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { Repository } from 'typeorm';
import { N0421 } from './n04_21.entity';
import { PatientCaseLockService } from './patient-case-lock.service';
import { N0421RetrieveService } from './n04_21.retrieve.service';
import { PatientCaseRetrieveResult } from './dto/patient-case-retrieve.dto';

const STRING_COLUMN_TYPES = new Set(['varchar', 'nvarchar', 'char', 'nchar', 'text', 'ntext']);
const NUMBER_COLUMN_TYPES = new Set([
  'int',
  'integer',
  'tinyint',
  'smallint',
  'bigint',
  'decimal',
  'numeric',
  'float',
  'real',
  'money',
  'smallmoney',
]);
const DATE_COLUMN_TYPES = new Set(['datetime', 'datetime2', 'smalldatetime', 'date', 'time']);

@Injectable()
export class N0421Service {
  constructor(
    @InjectRepository(N0421)
    private readonly n0421Repository: Repository<N0421>,
    private readonly patientCaseLockService: PatientCaseLockService,
    private readonly n0421RetrieveService: N0421RetrieveService,
  ) {}

  /**
   * 按实体列类型归一化入参，避免前端把数字传给 varchar/nvarchar、
   * 空字符串传给 datetime 时触发 tedious Invalid string / Invalid Date。
   */
  normalizeSaveData(data: Partial<N0421>): Partial<N0421> {
    const columns = this.n0421Repository.metadata.columns;
    const columnMap = new Map<string, ColumnMetadata>(
      columns.map((column) => [column.propertyName, column]),
    );
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      const column = columnMap.get(key);
      if (!column) {
        continue;
      }

      const typeName =
        typeof column.type === 'string'
          ? column.type.toLowerCase()
          : String(column.type).toLowerCase();

      if (value === undefined) {
        continue;
      }

      if (STRING_COLUMN_TYPES.has(typeName)) {
        if (value === null) {
          result[key] = null;
        } else if (typeof value === 'string') {
          result[key] = value;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          result[key] = String(value);
        } else {
          result[key] = value == null ? null : String(value);
        }
        continue;
      }

      if (DATE_COLUMN_TYPES.has(typeName)) {
        if (value === null || value === '') {
          result[key] = null;
          continue;
        }
        const dateValue = value instanceof Date ? value : new Date(String(value));
        result[key] = Number.isNaN(dateValue.getTime()) ? null : dateValue;
        continue;
      }

      if (NUMBER_COLUMN_TYPES.has(typeName)) {
        if (value === null || value === '') {
          result[key] = null;
          continue;
        }
        if (typeof value === 'number') {
          result[key] = Number.isFinite(value) ? value : null;
          continue;
        }
        const num = Number(value);
        result[key] = Number.isFinite(num) ? num : null;
        continue;
      }

      result[key] = value;
    }

    return result as Partial<N0421>;
  }

  async create(data: Partial<N0421>): Promise<N0421> {
    const entity = this.n0421Repository.create(this.normalizeSaveData(data));
    return await this.n0421Repository.save(entity);
  }

  async findByCondition(condition: Partial<N0421>): Promise<N0421[]> {
    return await this.n0421Repository.find({ where: condition });
  }

  /**
   * 对齐 PB WF_RETRIEVE_PATIENT：无 n04_21 时从 h11_brxx 初始化，有记录时合并出院信息。
   */
  async findByZyid(zyid: string): Promise<PatientCaseRetrieveResult> {
    return this.n0421RetrieveService.retrievePatientCase(zyid);
  }

  async findOne(zyid: string): Promise<Partial<N0421>> {
    const result = await this.findByZyid(zyid);
    return result.record ?? {};
  }

  async update(zyid: string, data: Partial<N0421>): Promise<Partial<N0421>> {
    await this.patientCaseLockService.assertNotArchived(zyid, { sjbz: data.sjbz });
    const { zyid: _, ...updateData } = this.normalizeSaveData(data);
    const result = await this.n0421Repository.update({ zyid }, updateData);
    if (result.affected === 0) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案首页不存在`);
    }
    return this.findOne(zyid);
  }

  async save(data: Partial<N0421>): Promise<Partial<N0421> | N0421> {
    const normalized = this.normalizeSaveData(data);
    const { zyid } = normalized;
    if (!zyid) {
      throw new NotFoundException('住院ID不能为空');
    }
    await this.patientCaseLockService.assertNotArchived(zyid, { sjbz: normalized.sjbz });
    const existing = await this.n0421Repository.findOne({ where: { zyid } });
    if (existing) {
      await this.n0421Repository.update({ zyid }, normalized);
      return this.findOne(zyid);
    }
    return this.create(normalized);
  }

  async remove(zyid: string): Promise<void> {
    const result = await this.n0421Repository.delete({ zyid });
    if (result.affected === 0) {
      throw new NotFoundException(`住院ID ${zyid} 对应的病案首页不存在`);
    }
  }
}
