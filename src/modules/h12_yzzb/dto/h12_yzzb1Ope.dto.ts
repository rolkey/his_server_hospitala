import { Allow } from 'class-validator';
import { UpdateH12_yzxbDto, H12_yzxbDto } from './h12_yzxb.dto';

/**
 * 操作参数类，医嘱保存时前端的附加信息通过这个参数来传
 */
export class H12_yzzb1OpeDto {
  @Allow()
  zyid: string;

  @Allow()
  zybh: string;

  @Allow()
  brxm: string;

  @Allow()
  yzlx: number;

  @Allow()
  userId: string;

  @Allow()
  systemId: string;

  @Allow()
  ksid: string;

  @Allow()
  cycw: string;

  @Allow()
  qfbz: number;

  @Allow()
  h12_yzxbs: UpdateH12_yzxbDto[];

  @Allow()
  deleteList: H12_yzxbDto[];
}
