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
  ksid: string;

  // 组号：同组医嘱的组号，为空时表示不同组
  // 如果等于-1则重取yzzh，否则使用传入的yzzh
  @Allow()
  yzzh?: number;

  // 是否为附加项目：如果是附加项目则不取新的zxcs，由前端处理zxcs
  @Allow()
  isAdditional?: boolean;

  @Allow()
  h12_mbxbs: UpdateH12_mbxbDto[];
}
