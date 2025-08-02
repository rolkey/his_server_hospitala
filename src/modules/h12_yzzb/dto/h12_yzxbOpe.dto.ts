import { Allow } from 'class-validator';
import { UpdateH12_mbxbDto } from '../../h12_mbxb/h12_mbxb.dto';

/**
 * 操作参数类，医嘱保存时前端的附加信息通过这个参数来传
 */
export class H12_yzxbOpeDto {
  @Allow()
  yzlx: number;

  @Allow()
  zyid: string;

  @Allow()
  userId: string;

  @Allow()
  systemId: string;

  @Allow()
  h12_mbxbs: UpdateH12_mbxbDto[];
}
