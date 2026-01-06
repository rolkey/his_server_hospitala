import { PartialType } from '@nestjs/mapped-types';
import { Allow } from 'class-validator';

export class BaseC00FbxxDto {
  @Allow()
  syid: string;

  @Allow()
  fksid: string;

  @Allow()
  sksid: string;

  @Allow()
  usid: string;

  @Allow()
  zyid: string;

  @Allow()
  xmid: string;

  @Allow()
  xmmc: string;

  @Allow()
  sm: string;

  @Allow()
  fbry: string;

  @Allow()
  ckry: string;

  @Allow()
  zt: string;

  @Allow()
  yxbz: number;

  @Allow()
  bzxx: string;

  @Allow()
  bzxx1: string;

  @Allow()
  bzxx2: string;

  @Allow()
  fbsj: Date;

  @Allow()
  mxxh: number;

  @Allow()
  yzzh: number;

  @Allow()
  xmbh: string;

  @Allow()
  zh: number;

  @Allow()
  xsl: number;

  @Allow()
  jfyl: number;

  @Allow()
  yzlx: number;

  @Allow()
  zxrq: Date;
}

export class CreateC00FbxxDto extends BaseC00FbxxDto {
  // 创建时可能需要的特殊字段或验证可以在这里添加
}

export class UpdateC00FbxxDto extends PartialType(BaseC00FbxxDto) {
  @Allow()
  jlxh: number;
}
