import { Exclude } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsDecimal,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';

/**
 * 操作参数类，医嘱保存时前端的附加信息通过这个参数来传
 */
export class h12_yzzbOpeDto {
  @Allow()
  attachFlag?: boolean;
}
