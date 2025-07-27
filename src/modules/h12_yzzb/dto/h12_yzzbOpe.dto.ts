import { Allow } from 'class-validator';
import { UpdateH12_yzxbDto } from './h12_yzxb.dto';

/**
 * 操作参数类，医嘱保存时前端的附加信息通过这个参数来传
 */
export class H12_yzzbOpeDto {
  @Allow()
  attachFlag?: boolean;

  @Allow()
  zyid: string;

  @Allow()
  yzlx: number;

  @Allow()
  h12_yzxbs: UpdateH12_yzxbDto[];
}
